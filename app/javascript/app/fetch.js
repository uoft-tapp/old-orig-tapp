import { appState } from './appState.js'

function defaultFailure(response) {
    if (response.status === 404 || response.status === 422) {
        alert("Action Failed: "+msg);
        return null;
    }
    else if (response.status === 204)
        return {};
    else
        return response.json();
}

function fetchHelper(URL, method = 'GET', body, success, failure = defaultFailure) {
    fetch(URL, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: method,
        body: this.jsonToURI(body),
	
    }).then(function(response) {
	return response.json();
	
    }).then(function(response) {
	if (response.ok)
	    return success(response);
	
	return failure(response);
	
    }).catch(function(error) {
	console.log(error);
    });
}

function fetchHelper(URL, success, failure) {
    return fetch(URL).then(function(response) {
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

    appState.setApplicantsList(applicants);
    appState.setFetchingApplicantsList(false);

    return resp;
}

function fetchApplicants() {
    appState.setFetchingApplicantsList(true);

    return fetchHelper('/applicants', onFetchApplicantsSuccess, (error) => {console.log(error);});
}

function onFetchApplicationsSuccess(resp) {
    let applications = {}, newApp;
    
    resp.forEach(app => {
	newApp = {
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
	};

	if (applications[app.applicant_id])
	    applications[app.applicant_id].push(newApp);
	else
	    applications[app.applicant_id] = [newApp];
    });

    appState.setApplicationsList(applications);

    return resp;
}

function fetchApplications() {
    appState.setFetchingApplicationsList(true);

    return fetchHelper('/applications', onFetchApplicationsSuccess, (error) => {console.log(error);});
}

function onFetchCoursesSuccess(resp) {
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
	    instructors: course.instructors.map(instr => instr.id),
	    estimatedPositions: course.estimated_count,
	    estimatedEnrol: course.estimated_enrolment,
	    positionHours: course.hours,
	    assignmentCount: 0, // populated by assignment fetch
	    qual: course.qualifications,
	    resp: course.duties,
	};

	rounds[course.id] = course.round_id;
    });

    appState.setCoursesList(courses);

    return courses;
}

function fetchCourses() {
    appState.setFetchingCoursesList(true);

    return fetchHelper('/positions',
		       (resp) => onFetchCoursesSuccess(resp),
		       (error) => {console.log(error);});
}

function onFetchAssignmentsSuccess(resp) {
    let assignments = {}, assignmentCounts = {}, count, newAss;

    resp.forEach(ass => {
	newAss = {
	    id: ass.id,
	    positionId: ass.position_id,
	    hours: ass.hours,
	};

	if (assignments[ass.applicant_id])
	    assignments[ass.applicant_id].push(newAss);
	else
	    assignments[ass.applicant_id] = [newAss];
	
	count = assignmentCounts[ass.position_id].assignmentCount;
	assignmentCounts[ass.position_id] = count ? count+1 : 1;
    });

    appState.setAssignmentsList(assignments);
    appState.setFetchingAssignmentsList(false);

    // return assignmentCounts, to be used to populate the corresponding courses field
    return assignmentCounts;
}

function fetchAssignments() {
    appState.setFetchingAssignmentsList(true);

    return fetchHelper('/assignments',
		       (resp) => onFetchAssignmentsSuccess(resp),
		       (error) => {console.log(error);});
}

function onFetchInstructorsSuccess(resp) {
    let instructors = {};

    resp.forEach(instr => {
	instructors[instr.id] = instr.name;
    });

    appState.setInstructorsList(instructors);
    appState.setFetchingInstructorsList(false);

    return resp;
}

function fetchInstructors() {
    appState.setFetchingInstructorsList(true);

    return fetchHelper('/instructors',
		       (resp) => onFetchInstructorsSuccess(resp),
		       (error) => {console.log(error);});
}

function fetchAll() {
    let applicantPromise = fetchApplicants();
    let applicationPromise = fetchApplications();
    let coursePromise = fetchCourses();
    let assignmentPromise = fetchAssignments();
    let instructorsPromise = fetchInstructors();

    // add rounds to applications from courses, once both have been fetched
    Promise.all([applicationPromise, coursePromise]).then(
	([_, courses]) => {
	    appState.setApplicationRounds(courses);
	    appState.setFetchingApplicationsList(false);
	}
    );

    // add assignment counts to courses, once both have been fetched
    Promise.all([coursePromise, assignmentPromise]).then(
	([_, assignmentCounts]) => {
	    appState.setCoursesAssignmentCount(assignmentCounts);
	    appState.setFetchingCoursesList(false);
	}
    );
}

export {fetchAll};
