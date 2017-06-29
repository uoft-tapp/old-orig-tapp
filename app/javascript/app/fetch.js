import { appState } from './appState.js'

function fetchHelper(URL, success, failure) {
    return fetch(URL).then(function(response) {
	return response.json();
    }).then(function(response) {
	return success(response);
    }).catch(function(error) {
	return failure(error);
    });
}

function onFetchApplicantsSuccess(resp) {
    let applicants = {};

    resp.forEach(app => {
	applicants[app.id] = {
	    lastName: app.last_name,
	    firstName: app.first_name,
	    utorid: app.utorid,
	    email: app.email,
	    phone: app.phone,
	    studentNumber: app.student_number,
	    address: app.address,
	    dept: app.dept,
	    program: (function (id) { // will need to add 'MScAC', 'MEng', 'OG'
		switch (id) {
		case '7PDF': return 'PostDoc';
		case '1PHD': return 'PhD';
		case '2Msc': return 'MSc';
		case '4MASc': return 'MASc';
		case '8UG': return 'UG';
		default: return 'Other';
		}
	    })(app.program_id),
	    year: app.yip,
	}
    });

    appState.setApplicantList(applicants);
    appState.setFetchingApplicantList(false);

    return resp;
}

function fetchApplicants() {
    appState.setFetchingApplicantList(true);

    return fetchHelper('/applicants', onFetchApplicantsSuccess, (error) => {console.log(error);});
}

function onFetchApplicationsSuccess(resp) {
    let applications = {};

    resp.forEach(app => {
	let prev = applications[app.applicant_id] ? applications[app.applicant_id] : [];
	prev.push({
	    taTraining: app.ta_training == 'Y',
	    academicAccess: app.access_acad_history == 'Y',
	    round: null, // populated by positions fetch
	    prefs: (function (prefs) {
		return prefs.map(pref => ({positionId: pref.position_id,
				    preferred: pref.rank == 1}));
	    })(app.preferences),
	    exp: app.ta_experience,
	    qual: app.academic_qualifications,
	    skills: app.technical_skills,
	    avail: app.availability,
	    other: app.other_info,
	    specialNeeds: app.special_needs,
	});

	applications[app.applicant_id] = prev;
    });

    appState.setApplicationList(applications);

    return resp;
}

function fetchApplications() {
    appState.setFetchingApplicationList(true);

    return fetchHelper('/applications', onFetchApplicationsSuccess, (error) => {console.log(error);});
}

function onFetchCoursesSuccess(resp, applicationPromise) {
    let courses = {}, rounds = {};

    resp.forEach(course => {
	courses[course.id] = {
	    round: course.round_id,
	    name: course.course_name,
	    code: course.position,
	    campus: (function (code) {
		switch (code) {
		case 1: return 'St. George';
		case 3: return 'Scarborough';
		case 5: return 'Mississauga';
		default: return 'Other';
		}
	    })(course.campus_code),
	    instructors: course.instructors.map(instr => ({
		id: instr.id, name: instr.name
	    })),
	    estimatedPositions: course.estimated_count,
	    estimatedEnrol: course.estimated_enrolment,
	    positionHours: course.hours,
	    assignmentCount: 0, // populated by assignment fetch
	    qual: course.qualifications,
	    resp: course.duties,
	};

	rounds[course.id] = course.round_id;
    });

    appState.setCourseList(courses);

    applicationPromise.then(
	() => {
	    appState.setApplicationRounds(courses);
	    appState.setFetchingApplicationList(false);
	}
    );

    return resp;
}

function fetchCourses(applicationPromise) {
    appState.setFetchingCourseList(true);

    return fetchHelper('/positions',
		       (resp) => onFetchCoursesSuccess(resp, applicationPromise),
		       (error) => {console.log(error);});
}

function onFetchAssignmentsSuccess(resp, coursePromise) {
    let assignments = {}, assignmentCounts = {}, count;

    resp.forEach(ass => {
      if(assignments[ass.applicant_id]==undefined){
        assignments[ass.applicant_id]=[];
      }
    	assignments[ass.applicant_id].push({
          id: ass.id,
    	    positionId: ass.position_id,
    	    hours: ass.hours,
    	});

      assignmentCounts[ass.position_id]= {assignmentCount: 0};
    	count = assignmentCounts[ass.position_id].assignmentCount;
    	assignmentCounts[ass.position_id] = count ? count+1 : 1;
    });

    appState.setAssignmentList(assignments);
    appState.setFetchingAssignmentList(false);

    coursePromise.then(
	() => {
	    appState.setCoursesAssignmentCount(assignmentCounts);
	    appState.setFetchingCourseList(false);
	}
    );

    return resp;
}

function fetchAssignments(coursePromise) {
    appState.setFetchingAssignmentList(true);

    return fetchHelper('/assignments',
		       (resp) => onFetchAssignmentsSuccess(resp, coursePromise),
		       (error) => {console.log(error);});
}

function fetchAll() {
    let applicantPromise = fetchApplicants();

    let applicationPromise = fetchApplications();

    let coursePromise = fetchCourses(applicationPromise);

    let assignmentPromise = fetchAssignments(coursePromise);
}

export {fetchAll};
