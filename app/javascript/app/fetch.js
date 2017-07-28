import React from 'react';
import { appState } from './appState.js';

/* General helpers */

function defaultFailure(response) {
    appState.notify(
        <span>
            <b>Action Failed:</b> {response.statusText}
        </span>
    );
    return Promise.reject(response);
}

function fetchHelper(URL, init, success, failure = defaultFailure) {
    return fetch(URL, init)
        .then(function(response) {
            if (response.ok) {
                // parse the body of the response as JSON
                if (['GET', 'POST'].includes(init.method)) {
                    return response.json().then(resp => success(resp));
                }

                return success(response);
            }

            return failure(response);
        })
        .catch(function(error) {
            appState.notify(
                <span>
                    <b>Error:</b> {URL} {error.message}
                </span>
            );
            return Promise.reject(error);
        });
}

function getHelper(URL, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
    };

    return fetchHelper(URL, init, success, failure);
}

function postHelper(URL, body, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

function deleteHelper(URL, success, failure) {
    return fetchHelper(URL, { method: 'DELETE' }, success, failure);
}

function putHelper(URL, body, success, failure) {
    let init = {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

/* Resource GETters */

const getApplicants = () => getHelper('/applicants', onFetchApplicantsSuccess);

const getApplications = () => getHelper('/applications', onFetchApplicationsSuccess);

const getCourses = () => getHelper('/positions', onFetchCoursesSuccess);

const getAssignments = () => getHelper('/assignments', onFetchAssignmentsSuccess);

const getInstructors = () => getHelper('/instructors', onFetchInstructorsSuccess);

/* Success callbacks for resource GETters */

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
            program: (function(id) {
                switch (id) {
                    case '1PHD':
                        return 'PhD';
                    case '2Msc':
                        return 'MSc';
                    case '3MScAC':
                        return 'MScAC';
                    case '4MASc':
                        return 'MASc';
                    case '5MEng':
                        return 'MEng';
                    case '6Other':
                        return 'OG';
                    case '7PDF':
                        return 'PostDoc';
                    case '8UG':
                        return 'UG';
                    default:
                        return 'Other';
                }
            })(app.program_id),
            year: app.yip,
            notes: app.commentary,
        };
    });

    return applicants;
}

function onFetchApplicationsSuccess(resp) {
    let applications = {},
        newApp;

    resp.forEach(app => {
        newApp = {
            taTraining: app.ta_training == 'Y',
            academicAccess: app.access_acad_history == 'Y',
            round: null, // populated by positions fetch
            prefs: (function(prefs) {
                return prefs.map(pref => ({
                    positionId: pref.position_id,
                    preferred: pref.rank == 1,
                }));
            })(app.preferences),
            rawPrefs: app.raw_prefs,
            exp: app.ta_experience,
            qual: app.academic_qualifications,
            skills: app.technical_skills,
            avail: app.availability,
            other: app.other_info,
            specialNeeds: app.special_needs,
        };

        if (applications[app.applicant_id]) {
            applications[app.applicant_id].push(newApp);
        } else {
            applications[app.applicant_id] = [newApp];
        }
    });

    return applications;
}

function onFetchCoursesSuccess(resp) {
    let courses = {},
        rounds = {};

    resp.forEach(course => {
        courses[course.id] = {
            round: course.round_id,
            name: course.course_name,
            code: course.position,
            campus: (function(code) {
                switch (code) {
                    case 1:
                        return 'St. George';
                    case 3:
                        return 'Scarborough';
                    case 5:
                        return 'Mississauga';
                    default:
                        return 'Other';
                }
            })(course.campus_code),
            instructors: course.instructors.map(instr => instr.id),
            estimatedPositions: course.estimated_count,
            estimatedEnrol: course.estimated_enrolment,
            positionHours: course.hours,
            assignmentCount: null, // populated by assignment fetch
            qual: course.qualifications,
            resp: course.duties,
            instructor_input: '',
        };

        rounds[course.id] = course.round_id;
    });

    return courses;
}

function onFetchAssignmentsSuccess(resp) {
    let assignments = {},
        assignmentCounts = {},
        count,
        newAss;

    resp.forEach(ass => {
        newAss = {
            id: ass.id,
            positionId: ass.position_id,
            hours: ass.hours,
        };

        if (assignments[ass.applicant_id]) {
            assignments[ass.applicant_id].push(newAss);
        } else {
            assignments[ass.applicant_id] = [newAss];
        }

        // increment the assignment count for this course
        count = assignmentCounts[ass.position_id];
        assignmentCounts[ass.position_id] = count ? count + 1 : 1;
    });

    // also return assignmentCounts, to be used to populate the corresponding courses field
    return [assignments, assignmentCounts];
}

function onFetchInstructorsSuccess(resp) {
    let instructors = {};

    resp.forEach(instr => {
        instructors[instr.id] = instr.name;
    });

    return instructors;
}

/* Function to GET all resources */

function fetchAll() {
    appState.setFetchingApplicantsList(true);
    appState.setFetchingApplicationsList(true);
    appState.setFetchingCoursesList(true);
    appState.setFetchingAssignmentsList(true);
    appState.setFetchingInstructorsList(true);

    let applicantPromise = getApplicants();
    let applicationPromise = getApplications();
    let coursePromise = getCourses();
    let assignmentPromise = getAssignments();
    let instructorsPromise = getInstructors();

    // when applicants are successfully fetched, update the applicants list; set fetching flag to false either way
    applicantPromise
        .then(applicants => {
            appState.setApplicantsList(applicants);
            appState.successFetchingApplicantsList();
        })
        .catch(() => appState.setFetchingApplicantsList(false));

    // when assignments are successfully fetched, update the assignments list; set fetching flag to false either way
    assignmentPromise
        .then(([assignments, _]) => {
            appState.setAssignmentsList(assignments);
            appState.successFetchingAssignmentsList();
        })
        .catch(() => appState.setFetchingAssignmentsList(false));

    // when instructors are successfully fetched, update the instructors list; set fetching flag to false either way
    instructorsPromise
        .then(instructors => {
            appState.setInstructorsList(instructors);
            appState.successFetchingInstructorsList();
        })
        .catch(() => appState.setFetchingInstructorsList(false));

    // if both applications and courses are successfully fetched, add rounds to applications, update the
    // the applications list, and set fetching flag to false
    Promise.all([applicationPromise, coursePromise])
        .then(([applications, courses]) => {
            applications = appState.addRoundsToApplications(applications, courses);

            appState.setApplicationsList(applications);
            appState.successFetchingApplicationsList();
        })
        .catch(() => {
            // if courses are not successfully fetched but applications are, update the applications list and set
            // fetching flag to false
            applicationPromise
                .then(applications => {
                    appState.setApplicationsList(applications);
                    appState.successFetchingApplicationsList();
                })
                // if both fail to fetch, set the fetching flag to false regardless
                .catch(() => appState.setFetchingApplicationsList(false));
        });

    // if both courses and assignments are successfully fetched, add assignment counts to courses, update the
    // courses list, and set both fetching flags to false
    Promise.all([coursePromise, assignmentPromise])
        .then(([courses, [_, assignmentCounts]]) => {
            courses = appState.addAssignmentCountsToCourses({
                assignmentCounts: assignmentCounts,
                courses: courses,
            });
            appState.setCoursesList(courses);
            appState.successFetchingCoursesList();
        })
        .catch(() => {
            // if assignments are not successfully fetched but courses are, update the courses list and set fetching
            // flag to false
            coursePromise
                .then(courses => {
                    appState.setCoursesList(courses);
                    appState.successFetchingCoursesList();
                })
                // if both fail to fetch, set the fetching flag to false regardless
                .catch(() => appState.setFetchingCoursesList(false));
        });
}

/* Task-specific resource modifiers */

// create a new assignment
function postAssignment(applicant, course, hours) {
    appState.setFetchingAssignmentsList(true);

    return postHelper(
        '/applicants/' + applicant + '/assignments',
        { position_id: course, hours: hours },
        getAssignments
    )
        .then(([assignments, assignmentCounts]) => {
            let courses = appState.addAssignmentCountsToCourses({
                assignmentCounts: assignmentCounts,
            });
            appState.setCoursesList(courses);

            appState.setAssignmentsList(assignments);
            appState.successFetchingAssignmentsList();
        })
        .catch(() => appState.setFetchingAssignmentsList(false));
}

// remove an assignment
function deleteAssignment(applicant, assignment) {
    appState.setFetchingAssignmentsList(true);

    return deleteHelper('/applicants/' + applicant + '/assignments/' + assignment, getAssignments)
        .then(([assignments, assignmentCounts]) => {
            let courses = appState.addAssignmentCountsToCourses({
                assignmentCounts: assignmentCounts,
            });
            appState.setCoursesList(courses);

            appState.setAssignmentsList(assignments);
            appState.successFetchingAssignmentsList();
        })
        .catch(() => appState.setFetchingAssignmentsList(false));
}

// add/update the notes for an applicant
function noteApplicant(applicant, notes) {
    appState.setFetchingApplicantsList(true);

    return putHelper('/applicants/' + applicant, { commentary: notes }, getApplicants)
        .then(applicants => {
            appState.setApplicantsList(applicants);
            appState.successFetchingApplicantsList();
        })
        .catch(() => appState.setFetchingApplicantsList(false));
}

// update the number of hours for an assignment
function updateAssignmentHours(applicant, assignment, hours) {
    appState.setFetchingAssignmentsList(true);

    return putHelper(
        '/applicants/' + applicant + '/assignments/' + assignment,
        { hours: hours },
        getAssignments
    )
        .then(([assignments, assignmentCounts]) => {
            let courses = appState.addAssignmentCountsToCourses({
                assignmentCounts: assignmentCounts,
            });
            appState.setCoursesList(courses);

            appState.setAssignmentsList(assignments);
            appState.successFetchingAssignmentsList();
        })
        .catch(() => appState.setFetchingAssignmentsList(false));
}

function updateCourse(courseId, data, val, attr) {
    appState.setFetchingCoursesList(true);

    return putHelper('/positions/' + courseId, data, getCourses)
        .then(courses => {
            courses = appState.addAssignmentCountsToCourses({ courses: courses });
            appState.setCoursesList(courses);
            appState.successFetchingCoursesList();
        })
        .catch(() => appState.setFetchingCoursesList(false));
}

function importChass(data, success, failure) {
    return postHelper('/import/chass', data, success, failure);
}

export {
    fetchAll,
    postAssignment,
    deleteAssignment,
    updateAssignmentHours,
    updateCourse,
    noteApplicant,
    importChass,
};
