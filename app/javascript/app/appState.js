import { Collection, fromJS } from 'immutable';
import React from 'react';

import * as fetch from './fetch.js';
import { routeConfig } from './routeConfig.js';

const initialState = {
    // navbar component
    nav: {
        role: 'role',
        user: 'user',

        selectedTab: null,

        // list of unread notifications (string can contain HTML, but be careful because it is not sanitized!)
        notifications: [],
    },

    // list of UI alerts (string can contain HTML, but be careful because it is not sanitized!)
    alerts: [],

    // applicant to display in applicant view
    selectedApplicant: null,

    // ABC view
    abcView: {
        selectedCourses: [],

        // id representing the current course panel layout in the ABC view
        // one of: 0, 1, 2, 2.1, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 4
        panelLayout: 0,

        // will be populated with mappings of selected courses to their selected sort and filter fields
        panelFields: {},
    },

    // assigned view
    assignedView: {
        // will be populated with selected sort and filter fields
        selectedSortFields: [],
        selectedFilters: {},
    },

    // unassigned view
    unassignedView: {
        // will be populated with selected sort and filter fields
        selectedSortFields: [],
        selectedFilters: {},
    },

    // assignment form used by applicant view
    assignmentForm: {
        panels: [],
        tempAssignments: [],
    },

    /** DB data **/

    applicants: { fetching: 0, list: null },
    applications: { fetching: 0, list: null },
    assignments: { fetching: 0, list: null },
    courses: { fetching: 0, list: null },
    instructors: { fetching: 0, list: null },
};

class AppState {
    constructor() {
        // container for application state
        var _data = fromJS(initialState);

        // list of change listeners
        var _listeners = [];

        var notifyListeners = () => _listeners.forEach(listener => listener());

        // parses a property path (keys and indices) into a list, as expected by Immutable
        var parsePath = path => path.split(/\[|\]|[.'"]/) // split on brackets, dots, and quotes
            .filter(key => key.length); // remove empty elements

        // getter for appState object
        // accepts an optional filter function
        this.get = function(property, filter) {
            let value = _data.getIn(parsePath(property));

            if (value instanceof Collection) {
                if (filter) {
                    value = value.filter(filter);
                }
                return value.toJS();
            }
            return value;
        };

        // setters for appState object

        this.set = function(property, value) {
            // as per the Backbone Model set() syntax, we accept a property and value pair, or
            // an object with property and value pairs as keys
            if (arguments.length == 1) {
                for (var prop in property) {
                    _data = _data.setIn(parsePath(prop), fromJS(property[prop]));
                }
            } else {
                _data = _data.setIn(parsePath(property), fromJS(value));
            }

            // notify listener(s) of change
            notifyListeners();
        };

        // add an element to an array property
        this.add = function(property, value) {
            _data = _data.updateIn(parsePath(property), list => list.push(fromJS(value)));

            // notify listener(s) of change
            notifyListeners();
        };

        // remove an element from an array property
        this.remove = function(property) {
            _data = _data.deleteIn(parsePath(property));

            // notify listener(s) of change
            notifyListeners();
        };

        // subscribe listener to change events on this model
        this.subscribe = function(listener) {
            _listeners.push(listener);
        };
    }

    // transform object into an array of [key, value] pairs found directly upon object, where key is numerical
    idEntries(object) {
        return Object.entries(object).map(([key, val]) => [Number(key), val]);
    }

    /************************************
     ** view state getters and setters **
     ************************************/

    // apply a sort to the applicant table in a course panel (sorted up initially)
    // note that we do not allow multiple sorts on the same field (incl. in different directions)
    addCoursePanelSort(course, field) {
        if (!this.getCoursePanelSortsByCourse(course).some(([f, _]) => f == field)) {
            this.add('abcView.panelFields[' + course + '].selectedSortFields', [field, 1]);
        } else {
            this.alert('<b>Applicant Table</b>&ensp;Cannot apply the same sort more than once.');
        }
    }

    // apply a sort to the applicant table in a single-applicant-table view (sorted up initially)
    // note that we do not allow multiple sorts on the same field (incl. in different directions)
    addSort(field) {
        let view = this.getSelectedViewStateComponent();

        if (!this.getSorts().some(([f, _]) => f == field)) {
            this.add(view + '.selectedSortFields', [field, 1]);
        } else {
            this.alert('<b>Applicant Table</b>&ensp;Cannot apply the same sort more than once.');
        }
    }

    // add a temporary assignment through the assignment form of the applicant view
    addTempAssignment(positionId, hours) {
        this.add('assignmentForm.tempAssignments', { positionId: positionId, hours: hours });
    }

    // add an alert to the list of active alerts
    alert(text) {
        let alerts = this.getAlerts();
        // give it an id that is 1 larger than the largest id in the array, or 0 if the array is empty
        this.add('alerts', {
            id: alerts.length > 0 ? alerts[alerts.length - 1].id + 1 : 0,
            text: text,
        });
    }

    // check whether any of the given filters in the category are selected on the applicant table in a course panel
    anyCoursePanelFilterSelected(course, field) {
        return this.getCoursePanelFiltersByCourse(course)[field] != undefined;
    }

    // check whether any of the given filters in the category are selected on the applicant table in a
    // single-applicant-table view
    anyFilterSelected(field) {
        return this.getFilters()[field] != undefined;
    }

    // remove all selected filters on the applicant table in a course panel
    clearCoursePanelFilters(course) {
        this.set('abcView.panelFields[' + course + '].selectedFilters', {});
    }

    // remove all selected filters on the applicant table in a single-applicant-table view
    clearFilters() {
        let view = this.getSelectedViewStateComponent();
        this.set(view + '.selectedFilters', {});
    }

    createAssignmentForm(panels) {
        this.set('assignmentForm.panels', panels);
    }

    dismissAlert(id) {
        let alerts = this.getAlerts();
        let i = alerts.findIndex(alert => alert.id == id);

        if (i != -1) {
            this.remove('alerts[' + i + ']');
        }
    }

    getAlerts() {
        return this.get('alerts');
    }

    getAssignmentForm() {
        return this.get('assignmentForm');
    }

    getCoursePanelFields() {
        return this.get('abcView.panelFields');
    }

    getCoursePanelFieldsByCourse(course) {
        return this.getCoursePanelFields()[course];
    }

    getCoursePanelFiltersByCourse(course) {
        return this.getCoursePanelFieldsByCourse(course).selectedFilters;
    }

    getCoursePanelLayout() {
        return this.get('abcView.panelLayout');
    }

    getCoursePanelSortsByCourse(course) {
        return this.getCoursePanelFieldsByCourse(course).selectedSortFields;
    }

    getCurrentUserName() {
        return this.get('nav.user');
    }

    getCurrentUserRole() {
        return this.get('nav.role');
    }

    getFilters() {
        return this.getTableFields().selectedFilters;
    }

    getSelectedApplicant() {
        return this.get('selectedApplicant');
    }

    getSelectedCourses() {
        return this.get('abcView.selectedCourses');
    }

    getSelectedNavTab() {
        return this.get('nav.selectedTab');
    }

    // return the name of the appState component that corresponds to the currently selected view
    getSelectedViewStateComponent() {
        switch (this.getSelectedNavTab()) {
            case routeConfig.abc.id:
                return 'abcView';
            case routeConfig.assigned.id:
                return 'assignedView';
            case routeConfig.unassigned.id:
                return 'unassignedView';
            default:
                return null;
        }
    }

    getSorts() {
        return this.getTableFields().selectedSortFields;
    }

    getTableFields() {
        let view = this.getSelectedViewStateComponent();
        return this.get(view);
    }

    getTempAssignments() {
        return this.get('assignmentForm.tempAssignments');
    }

    getUnreadNotifications() {
        return this.get('nav.notifications');
    }

    // check whether a filter is selected on the applicant table in a course panel
    isCoursePanelFilterSelected(course, field, category) {
        let filters = this.getCoursePanelFiltersByCourse(course);

        return filters[field] != undefined && filters[field].includes(category);
    }

    // check whether a sort is selected on the applicant table in a course panel
    isCoursePanelSortSelected(course, field, dir) {
        return this.getCoursePanelSortsByCourse(course).some(([f, d]) => f == field && d == dir);
    }

    // check whether a course in the course menu is selected
    isCourseSelected(course) {
        return this.getSelectedCourses().includes(course);
    }

    // check whether a filter is selected on the applicant table in a single-applicant-table view
    isFilterSelected(field, category) {
        let filters = this.getFilters();

        return filters[field] != undefined && filters[field].includes(category);
    }

    // check whether a panel is expanded in the applicant view
    isPanelExpanded(index) {
        return this.get('assignmentForm.panels[' + index + '].expanded');
    }

    // check whether a sort is selected on the applicant table in a single-applicant-table view
    isSortSelected(field, dir) {
        return this.getSorts().some(([f, d]) => f == field && d == dir);
    }

    // add a notification to the list of unread notifications
    notify(text) {
        this.add('nav.notifications', text);
    }

    // clear the list of unread notifications
    readNotifications() {
        this.set('nav.notifications', []);
    }

    // remove a sort from the applicant table in a course panel
    removeCoursePanelSort(course, field) {
        let i = this.getCoursePanelSortsByCourse(course).findIndex(([f, _]) => f == field);
        this.remove('abcView.panelFields[' + course + '].selectedSortFields[' + i + ']');
    }

    // remove a sort from the applicant table in a single-applicant-table view
    removeSort(field) {
        let view = this.getSelectedViewStateComponent();

        let i = this.getSorts().findIndex(([f, _]) => f == field);
        this.remove(view + '.selectedSortFields[' + i + ']');
    }

    // remove a temporary assignment from the assignment form of the applicant view
    removeTempAssignment(course) {
        let i = this.getTempAssignments().findIndex(ass => ass.positionId == course);
        this.remove('assignmentForm.tempAssignments[' + i + ']');
    }

    // select an applicant to display in the applicant view
    selectApplicant(applicant) {
        this.set('selectedApplicant', applicant);
    }

    // select a navbar tab
    selectNavTab(eventKey) {
        this.set('nav.selectedTab', eventKey);
    }

    // set the course panel layout in the ABC view
    setCoursePanelLayout(layout) {
        this.set('abcView.panelLayout', layout);
    }

    setSelectedCourses(courses) {
        this.set('abcView.selectedCourses', courses);
    }

    // change the number of hours of a temporary assignment
    setTempAssignmentHours(id, hours) {
        let i = this.getTempAssignments().findIndex(ass => ass.positionId == id);
        this.set('assignmentForm.tempAssignments[' + i + '].hours', hours);
    }

    // switch the places of two courses in the course panel layout in the ABC view
    swapCoursesInLayout(course1, course2) {
        let selected = this.getSelectedCourses(),
            i1,
            i2;

        for (var i = 0; i < selected.length; i++) {
            if (selected[i] == course1) {
                i1 = i;
            } else if (selected[i] == course2) {
                i2 = i;
            }
        }

        [selected[i1], selected[i2]] = [selected[i2], selected[i1]];
        this.setSelectedCourses(selected);
    }

    // toggle a filter on the applicant table in a course panel
    toggleCoursePanelFilter(course, field, category) {
        let filters = this.getCoursePanelFiltersByCourse(course);

        if (filters[field]) {
            let i = filters[field].indexOf(category);

            // filter is not already applied
            if (i == -1) {
                filters[field].push(category);

                // filter is already applied, along with other filters
            } else if (filters[field].length > 1) {
                filters[field].splice(i, 1);

                // only this filter is already applied
            } else {
                delete filters[field];
            }
        } else {
            filters[field] = [category];
        }

        this.set('abcView.panelFields[' + course + '].selectedFilters', filters);
    }

    // toggle the sort direction of the sort currently applied to the applicant table in a course panel
    toggleCoursePanelSortDir(course, field) {
        const sortFields = this.getCoursePanelSortsByCourse(course);
        let i = sortFields.findIndex(([f, _]) => f == field);

        if (i != -1) {
            sortFields[i][1] = -sortFields[i][1];
            this.set('abcView.panelFields[' + course + '].selectedSortFields', sortFields);
        }
    }

    // toggle a filter on the applicant table in a single-applicant-table view
    toggleFilter(field, category) {
        let view = this.getSelectedViewStateComponent();

        let filters = this.getFilters();

        if (filters[field]) {
            let i = filters[field].indexOf(category);

            // filter is not already applied
            if (i == -1) {
                filters[field].push(category);

                // filter is already applied, along with other filters
            } else if (filters[field].length > 1) {
                filters[field].splice(i, 1);

                // only this filter is already applied
            } else {
                delete filters[field];
            }
        } else {
            filters[field] = [category];
        }

        this.set(view + '.selectedFilters', filters);
    }

    // toggle the expanded state of a panel in the applicant assignment form component
    togglePanelExpanded(index) {
        this.set('assignmentForm.panels[' + index + '].expanded', !this.isPanelExpanded(index));
    }

    // toggle the selected state of the course that is clicked
    // note that we only allow up to 4 courses to be selected in the ABC view
    toggleSelectedCourse(course) {
        let selected = this.getSelectedCourses();
        let i = selected.indexOf(course);

        if (i == -1) {
            if (selected.length < 4) {
                this.add('abcView.selectedCourses', course);
            } else {
                this.alert('<b>Courses Menu</b>&ensp;Cannot select more than 4 courses.');
            }
        } else {
            this.remove('abcView.selectedCourses[' + i + ']');
        }
    }

    // toggle the sort direction of the sort currently applied to the applicant table in a single-applicant-table view
    toggleSortDir(field) {
        let view = this.getSelectedViewStateComponent();

        const sortFields = this.getSorts();
        let i = sortFields.findIndex(([f, _]) => f == field);

        if (i != -1) {
            sortFields[i][1] = -sortFields[i][1];
            this.set(view + '.selectedSortFields', sortFields);
        }
    }

    // unselect the applicant displayed in the applicant view
    unselectApplicant() {
        this.set('selectedApplicant', null);
    }

    // check whether a panelFields object exists for each of the currently selected courses
    // if not, create the appropriate panelFields
    updateCoursePanelFields(selected, panelFields) {
        let update = false;

        for (var course in panelFields) {
            // if a tracker is extra, remove it (the course was just unselected)
            if (!selected.includes(parseInt(course))) {
                delete panelFields[course];
                update = true;
            }
        }

        for (var course = 0; course < selected.length; course++) {
            // if a tracker is missing, create it (the course was just selected)
            if (!(selected[course] in panelFields)) {
                panelFields[selected[course]] = {
                    selectedSortFields: [],
                    selectedFilters: {},
                };
                update = true;
            }
        }

        if (update) {
            this.set('abcView.panelFields', panelFields);
        }
    }

    /******************************
     ** data getters and setters **
     ******************************/

    addInstructor(courseId, instructorId) {
        let val = this.get('courses.list[' + courseId + '].instructors');
        val.push(parseInt(instructorId));
        fetch.updateCourse(courseId, { instructors: val }, val, 'instructors');
    }

    // accepts an (optional) courses list and an (optional) list of assignment counts in an object, and returns the
    // courses list with assignment counts updated
    addAssignmentCountsToCourses(args) {
        let assignmentCounts = args.assignmentCounts,
            courses = args.courses ? args.courses : this.getCoursesList();

        // if assignment counts are not given, compute them
        if (!assignmentCounts) {
            let assignments = this.getAssignmentsList(),
                assignmentCounts = {};

            let count;
            for (var ass in assignments) {
                count = assignmentCounts[ass.position_id];
                assignmentCounts[ass.position_id] = count ? count + 1 : 1;
            }
        }

        // add assignment counts to courses
        for (var course in courses) {
            courses[course].assignmentCount = assignmentCounts[course]
                ? assignmentCounts[course]
                : 0;
        }

        return courses;
    }

    // accepts a list of applications and a (optional) list of courses, and returns the applications list with
    // rounds updated
    addRoundsToApplications(applications, courses = this.getCoursesList()) {
        // assumes that all courses in a single application will be part of the same round
        for (var applicant in applications) {
            applications[applicant].forEach((app, index) => {
                if (app.prefs && app.prefs.length > 0) {
                    applications[applicant][index].round = courses[app.prefs[0].positionId].round;
                }
            });
        }

        return applications;
    }

    // check if any data is being fetched
    anyFetching() {
        return [
            this.fetchingCourses(),
            this.fetchingInstructors(),
            this.fetchingApplicants(),
            this.fetchingApplications(),
            this.fetchingAssignments(),
        ].some(val => val);
    }

    // check if any data has not yet been fetched
    anyNull() {
        return [
            this.getCoursesList(),
            this.getInstructorsList(),
            this.getApplicantsList(),
            this.getApplicationsList(),
            this.getAssignmentsList(),
        ].some(val => val == null);
    }

    // create a new assignment
    createAssignment(applicant, course, hours) {
        fetch.postAssignment(applicant, course, hours);
    }

    // delete an assignment
    deleteAssignment(applicant, assignment) {
        fetch.deleteAssignment(applicant, assignment);
    }

    // check if applicants are being fetched
    fetchingApplicants() {
        return this.get('applicants.fetching') > 0;
    }

    // check if applications are being fetched
    fetchingApplications() {
        return this.get('applications.fetching') > 0;
    }

    // check if assignments are being fetched
    fetchingAssignments() {
        return this.get('assignments.fetching') > 0;
    }

    // check if courses are being fetched
    fetchingCourses() {
        return this.get('courses.fetching') > 0;
    }

    // check if instructors are being fetched
    fetchingInstructors() {
        return this.get('instructors.fetching') > 0;
    }

    // get applicants who are assigned to course; returns a list of [applicantID, applicantData]
    getApplicantsAssignedToCourse(course) {
        let assignments = this.getAssignmentsList(),
            applicants = this.getApplicantsList(),
            filteredApplicants = [];

        for (var applicant in assignments) {
            if (assignments[applicant].some(ass => ass.positionId == course)) {
                filteredApplicants.push([applicant, applicants[applicant]]);
            }
        }

        return filteredApplicants;
    }

    getApplicantById(applicant) {
        return this.getApplicantsList()[applicant];
    }

    getApplicantsList() {
        return this.get('applicants.list');
    }

    // get applicants who have applied to course; returns a list of [applicantID, applicantData]
    getApplicantsToCourse(course) {
        let applications = this.idEntries(this.getApplicationsList()).filter(([key, val]) =>
            val[0].prefs.some(pref => pref.positionId == course)
        );

        let applicants = this.getApplicantsList(),
            filteredApplicants = [];

        applications.forEach(([key, val]) => filteredApplicants.push([key, applicants[key]]));

        return filteredApplicants;
    }

    // get applicants to course who are not assigned to it; returns a list of [applicantID, applicantData]
    getApplicantsToCourseUnassigned(course) {
        let applicants = this.getApplicantsToCourse(course);
        let assignments = this.getAssignmentsList();

        return applicants.filter(
            ([key, val]) =>
                !assignments[key] || !assignments[key].some(ass => ass.positionId == course)
        );
    }

    getApplicationById(applicant) {
        return this.getApplicationsList()[applicant][0];
    }

    // check whether this course is a preference for this applicant
    getApplicationPreference(applicant, course) {
        let prefs = this.getApplicationById(applicant).prefs;

        return prefs.some(pref => pref.positionId == course && pref.preferred);
    }

    getApplicationsList() {
        return this.get('applications.list');
    }

    // get all applicants who have been assigned to a course; returns a list of [applicantID, applicantData]
    getAssignedApplicants() {
        let assignments = this.getAssignmentsList(),
            applicants = this.getApplicantsList(),
            filteredApplicants = [];

        for (var applicant in assignments) {
            filteredApplicants.push([applicant, applicants[applicant]]);
        }

        return filteredApplicants;
    }

    getAssignmentByApplicant(applicant, course) {
        let assignments = this.getAssignmentsList()[applicant];

        if (assignments) {
            return assignments.find(ass => ass.positionId == course);
        } else {
            return null;
        }
    }

    getAssignmentsByApplicant(applicant) {
        let assignments = this.getAssignmentsList()[applicant];

        if (assignments) {
            return assignments;
        } else {
            return [];
        }
    }

    getAssignmentsList() {
        return this.get('assignments.list');
    }

    getCoursesList() {
        return this.get('courses.list');
    }

    getCourseById(course) {
        return this.getCoursesList()[course];
    }

    // return a sorted list of course codes
    getCourseCodes() {
        let courses = Object.values(this.getCoursesList());
        courses = courses.map(course => course.code);
        courses.sort();

        return courses;
    }

    getCourseCodeById(course) {
        return this.getCourseById(course).code;
    }

    getInstructorsList() {
        return this.get('instructors.list');
    }

    // get all applicants who have not been assigned to a course; returns a list of [applicantID, applicantData]
    getUnassignedApplicants() {
        let assignments = this.getAssignmentsList(),
            applicants = this.getApplicantsList();

        for (var applicant in assignments) {
            delete applicants[applicant];
        }

        return this.idEntries(applicants);
    }

    isApplicantsListNull() {
        return this.getApplicantsList() == null;
    }

    isApplicationsListNull() {
        return this.getApplicationsList() == null;
    }

    isAssignmentsListNull() {
        return this.getAssignmentsList() == null;
    }

    isCoursesListNull() {
        return this.getCoursesList() == null;
    }

    isInstructorsListNull() {
        return this.getInstructorsList() == null;
    }

    // add/update the notes for an applicant
    noteApplicant(applicant, notes) {
        fetch.noteApplicant(applicant, notes);
    }

    // persist a temporary assignment to the database
    permAssignment(course) {
        let applicant = this.getSelectedApplicant();
        let tempAssignment = this.getTempAssignments().find(ass => ass.positionId == course);

        // note that there are two 'set' calls here
        this.createAssignment(applicant, course, tempAssignment.hours);

        this.removeTempAssignment(course);
    }

    removeInstructor(courseId, index) {
        let val = this.get('courses.list[' + courseId + '].instructors');
        val.splice(index, 1);
        fetch.updateCourse(courseId, { instructors: val }, val, 'instructors');
    }

    setApplicantsList(list) {
        this.set('applicants.list', list);
    }

    setApplicationsList(list) {
        this.set('applications.list', list);
    }

    setAssignmentsList(list) {
        this.set('assignments.list', list);
    }

    setCoursesList(list) {
        this.set('courses.list', list);
    }

    setFetchingApplicantsList(fetching) {
        let init = this.get('applicants.fetching');
        if (fetching) {
            this.notify('<i>Fetching applicants...</i>');
            this.set('applicants.fetching', init + 1);
        } else {
            this.set('applicants.fetching', init - 1);
        }
    }

    setFetchingApplicationsList(fetching) {
        let init = this.get('applications.fetching');
        if (fetching) {
            this.notify('<i>Fetching applications...</i>');
            this.set('applications.fetching', init + 1);
        } else {
            this.set('applications.fetching', init - 1);
        }
    }

    setFetchingAssignmentsList(fetching) {
        let init = this.get('assignments.fetching');
        if (fetching) {
            this.notify('<i>Fetching assignments...</i>');
            this.set('assignments.fetching', init + 1);
        } else {
            this.set('assignments.fetching', init - 1);
        }
    }

    setFetchingCoursesList(fetching) {
        let init = this.get('courses.fetching');
        if (fetching) {
            this.notify('<i>Fetching courses...</i>');
            this.set('courses.fetching', init + 1);
        } else {
            this.set('courses.fetching', init - 1);
        }
    }

    setFetchingInstructorsList(fetching) {
        let init = this.get('instructors.fetching');
        if (fetching) {
            this.notify('<i>Fetching instructors...</i>');
            this.set('instructors.fetching', init + 1);
        } else {
            this.set('instructors.fetching', init - 1);
        }
    }

    setInstructorsList(list) {
        this.set('instructors.list', list);
    }

    successFetchingApplicantsList() {
        this.notify('Finished fetching applicants.');
        this.setFetchingApplicantsList(false);
    }

    successFetchingApplicationsList() {
        this.notify('Finished fetching applications.');
        this.setFetchingApplicationsList(false);
    }

    successFetchingAssignmentsList() {
        this.notify('Finished fetching assignments.');
        this.setFetchingAssignmentsList(false);
    }

    successFetchingCoursesList() {
        this.notify('Finished fetching courses.');
        this.setFetchingCoursesList(false);
    }

    successFetchingInstructorsList() {
        this.notify('Finished fetching instructors.');
        this.setFetchingInstructorsList(false);
    }

    updateAssignment(applicant, assignment, hours) {
        fetch.updateAssignmentHours(applicant, assignment, hours);
    }

    updateCourse(courseId, val, props) {
        let data = {};
        switch (props) {
            case 'estimatedPositions':
                data['estimated_count'] = val;
                break;
            case 'positionHours':
                data['hours'] = val;
                break;
            case 'estimatedEnrol':
                data['estimated_enrolment'] = val;
                break;
            case 'qual':
                data['qualifications'] = val;
                break;
            case 'resp':
                data['duties'] = val;
                break;
        }
        fetch.updateCourse(courseId, data, val, props);
    }

    updateInstructorInput(courseId, input) {
        if (input === undefined) {
            input = '';
        }
        this.set('courses.list[' + courseId + '].instructor_input', input);
        let visible_input = document.getElementById('input_' + courseId);
        visible_input.innerHTML = input;
    }
}

let appState = new AppState();
export { appState };
