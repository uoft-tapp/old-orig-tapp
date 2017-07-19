import Backbone from 'backbone';
import React from 'react';
import NestedModel from 'backbone-nested';

import * as fetch from './fetch.js';
import { routeConfig } from './routeConfig.js';

const initialState = {
    // navbar component
    nav: {
        role: 'role',
        user: 'user',

        selectedTab: null,

        // list of unread notifications (can be text or HTML/JSX)
        notifications: [],
    },

    // list of UI alerts (can be text or HTML/JSX)
    alerts: [],

    // applicant to display in applicant view
    selectedApplicant: null,

    // course list component used by courses view
    courseList: {
        selected: null,
    },

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
        assignmentInput: '',
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
        this._data = new Backbone.NestedModel(initialState);
    }

    // subscribe listener to change events on this model
    subscribe(listener) {
        this._data.on('change', listener);
    }

    toJSO() {
        return this._data.toJSON();
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
            this._data.add('abcView.panelFields[' + course + '].selectedSortFields', [field, 1]);
        } else {
            this.alert(
                <span>
                    <b>Applicant Table</b>&ensp;Cannot apply the same sort more than once.
                </span>
            );
        }
    }

    // apply a sort to the applicant table in a single-applicant-table view (sorted up initially)
    // note that we do not allow multiple sorts on the same field (incl. in different directions)
    addSort(field) {
        let view = this.getSelectedViewStateComponent();

        if (!this.getSorts().some(([f, _]) => f == field)) {
            this._data.add(view + '.selectedSortFields', [field, 1]);
        } else {
            this.alert(
                <span>
                    <b>Applicant Table</b>&ensp;Cannot apply the same sort more than once.
                </span>
            );
        }
    }

    // add a temporary assignment through the assignment form of the applicant view
    addTempAssignment(positionId, hours) {
        this._data.add('assignmentForm.tempAssignments', { positionId: positionId, hours: hours });
    }

    // add an alert to the list of active alerts
    alert(text) {
        let alerts = this.getAlerts();
        // give it an id that is 1 larger than the largest id in the array, or 0 if the array is empty
        this._data.add('alerts', {
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
        this._data.unset('abcView.panelFields[' + course + '].selectedFilters', { silent: true });
        this._data.set('abcView.panelFields[' + course + '].selectedFilters', {});
    }

    // remove all selected filters on the applicant table in a single-applicant-table view
    clearFilters() {
        let view = this.getSelectedViewStateComponent();

        this._data.unset(view + '.selectedFilters', { silent: true });
        this._data.set(view + '.selectedFilters', {});
    }

    createAssignmentForm(panels) {
        if (this.getAssignmentForm().panels.length == 0) {
            this._data.set('assignmentForm.panels', panels);
        }
    }

    dismissAlert(id) {
        let alerts = this.getAlerts();
        let i = alerts.findIndex(alert => alert.id == id);

        if (i != -1) {
            this._data.remove('alerts[' + i + ']');
        }
    }

    // return the name of the appState component that corresponds to the currently selected view
    getSelectedViewStateComponent() {
        switch (this.getSelectedNavTab()) {
            case routeConfig.abc.key:
                return 'abcView';
            case routeConfig.assigned.key:
                return 'assignedView';
            case routeConfig.unassigned.key:
                return 'unassignedView';
            default:
                return null;
        }
    }

    getAlerts() {
        return this._data.get('alerts');
    }

    getAssignmentForm() {
        return this._data.get('assignmentForm');
    }

    getCoursePanelFields() {
        return this._data.get('abcView.panelFields');
    }

    getCoursePanelFieldsByCourse(course) {
        return this.getCoursePanelFields()[course];
    }

    getCoursePanelFiltersByCourse(course) {
        return this.getCoursePanelFieldsByCourse(course).selectedFilters;
    }

    getCoursePanelLayout() {
        return this._data.get('abcView.panelLayout');
    }

    getCoursePanelSortsByCourse(course) {
        return this.getCoursePanelFieldsByCourse(course).selectedSortFields;
    }

    getCurrentUserName() {
        return this._data.get('nav.user');
    }

    getCurrentUserRole() {
        return this._data.get('nav.role');
    }

    getFilters() {
        return this.getTableFields().selectedFilters;
    }

    getSelectedCourses() {
        return this._data.get('abcView.selectedCourses');
    }

    getSelectedNavTab() {
        return this._data.get('nav.selectedTab');
    }

    getSelectedApplicant() {
        return this._data.get('selectedApplicant');
    }

    getSorts() {
        return this.getTableFields().selectedSortFields;
    }

    getTableFields() {
        let view = this.getSelectedViewStateComponent();
        return this._data.get(view);
    }

    getTempAssignments() {
        return this._data.get('assignmentForm.tempAssignments');
    }

    getUnreadNotifications() {
        return this._data.get('nav.notifications');
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
        return this._data.get('assignmentForm.panels[' + index + '].expanded');
    }

    // check whether a sort is selected on the applicant table in a single-applicant-table view
    isSortSelected(field, dir) {
        return this.getSorts().some(([f, d]) => f == field && d == dir);
    }

    // add a notification to the list of unread notifications
    notify(text) {
        this._data.add('nav.notifications', text);
    }

    // clear the list of unread notifications
    readNotifications() {
        this._data.set('nav.notifications', []);
    }

    // remove a sort from the applicant table in a course panel
    removeCoursePanelSort(course, field) {
        let i = this.getCoursePanelSortsByCourse(course).findIndex(([f, _]) => f == field);
        this._data.remove('abcView.panelFields[' + course + '].selectedSortFields[' + i + ']');
    }

    // remove a sort from the applicant table in a single-applicant-table view
    removeSort(field) {
        let view = this.getSelectedViewStateComponent();

        let i = this.getSorts().findIndex(([f, _]) => f == field);
        this._data.remove(view + '.selectedSortFields[' + i + ']');
    }

    // remove a temporary assignment from the assignment form of the applicant view
    removeTempAssignment(course) {
        let i = this.getTempAssignments().findIndex(ass => ass.positionId == course);
        this._data.remove('assignmentForm.tempAssignments[' + i + ']');
    }

    // select an applicant to display in the applicant view
    selectApplicant(applicant) {
        this._data.set('selectedApplicant', applicant);
    }

    // select a navbar tab
    selectNavTab(eventKey) {
        this._data.set('nav.selectedTab', eventKey);
    }

    setInput(value) {
        this._data.set('assignmentForm.assignmentInput', value);
    }

    // set the course panel layout in the ABC view
    setCoursePanelLayout(layout) {
        let selected = this.getSelectedCourses();
        let panelFields = this.getCoursePanelFields();

        // check that panel state trackers exist for exactly the current courses
        if (selected != Object.keys(panelFields)) {
            for (var course in panelFields) {
                // if a tracker is missing, create it (the course was just selected)
                if (!selected.includes(course)) {
                    delete panelFields[course];
                }
            }

            for (var course = 0; course < selected.length; course++) {
                // if a tracker is extra, remove it (the course was just unselected)
                if (!(selected[course] in panelFields)) {
                    panelFields[selected[course]] = {
                        selectedSortFields: [],
                        selectedFilters: {},
                    };
                }
            }

            this._data.unset('abcView.panelFields', { silent: true });
            this._data.set({ 'abcView.panelLayout': layout, 'abcView.panelFields': panelFields });
        } else {
            this._data.set('abcView.panelLayout', layout);
        }
    }

    setSelectedCourses(courses) {
        this._data.unset('abcView.selectedCourses', { silent: true });
        this._data.set('abcView.selectedCourses', courses);
    }

    // change the number of hours of a temporary assignment
    setTempAssignmentHours(id, hours) {
        let i = this.getTempAssignments().findIndex(ass => ass.positionId == id);
        this._data.set('assignmentForm.tempAssignments[' + i + '].hours', hours);
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
        this._data.unset('abcView.panelFields[' + course + '].selectedFilters', { silent: true });

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

        this._data.set('abcView.panelFields[' + course + '].selectedFilters', filters);
    }

    // toggle the sort direction of the sort currently applied to the applicant table in a course panel
    toggleCoursePanelSortDir(course, field) {
        const sortFields = this.getCoursePanelSortsByCourse(course);
        let i = sortFields.findIndex(([f, _]) => f == field);

        if (i != -1) {
            this._data.unset('abcView.panelFields[' + course + '].selectedSortFields', {
                silent: true,
            });

            sortFields[i][1] = -sortFields[i][1];
            this._data.set('abcView.panelFields[' + course + '].selectedSortFields', sortFields);
        }
    }

    // toggle a filter on the applicant table in a single-applicant-table view
    toggleFilter(field, category) {
        let view = this.getSelectedViewStateComponent();

        let filters = this.getFilters();
        this._data.unset(view + '.selectedFilters', { silent: true });

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

        this._data.set(view + '.selectedFilters', filters);
    }

    // toggle the expanded state of a panel in the applicant assignment form component
    togglePanelExpanded(index) {
        this._data.set(
            'assignmentForm.panels[' + index + '].expanded',
            !this.isPanelExpanded(index)
        );
    }

    // toggle the selected state of the course that is clicked
    // note that we only allow up to 4 courses to be selected in the ABC view
    toggleSelectedCourse(course) {
        let selected = this.getSelectedCourses();
        let i = selected.indexOf(course);

        if (i == -1) {
            if (selected.length < 4) {
                this._data.add('abcView.selectedCourses', course);
            } else {
                this.alert(
                    <span>
                        <b>Courses Menu</b>&ensp;Cannot select more than 4 courses.
                    </span>
                );
            }
        } else {
            this._data.remove('abcView.selectedCourses[' + i + ']');
        }
    }

    // toggle the sort direction of the sort currently applied to the applicant table in a single-applicant-table view
    toggleSortDir(field) {
        let view = this.getSelectedViewStateComponent();

        const sortFields = this.getSorts();
        let i = sortFields.findIndex(([f, _]) => f == field);

        if (i != -1) {
            this._data.unset(view + '.selectedSortFields', { silent: true });

            sortFields[i][1] = -sortFields[i][1];
            this._data.set(view + '.selectedSortFields', sortFields);
        }
    }

    // unselect the applicant displayed in the applicant view
    unselectApplicant() {
        this._data.unset('selectedApplicant');
    }

    /******************************
     ** data getters and setters **
     ******************************/

    addInstructor(courseId, instructorId) {
        let val = this._data.get('courses.list[' + courseId + '].instructors');
        val.push(parseInt(instructorId));
        fetch.updateCourse(courseId, { instructors: val }, val, 'instructors');
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
        return this._data.get('applicants.fetching') > 0;
    }

    // check if applications are being fetched
    fetchingApplications() {
        return this._data.get('applications.fetching') > 0;
    }

    // check if assignments are being fetched
    fetchingAssignments() {
        return this._data.get('assignments.fetching') > 0;
    }

    // check if courses are being fetched
    fetchingCourses() {
        return this._data.get('courses.fetching') > 0;
    }

    // check if instructors are being fetched
    fetchingInstructors() {
        return this._data.get('instructors.fetching') > 0;
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
        return this._data.get('applicants.list');
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
        return this._data.get('applications.list');
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
        return this._data.get('assignments.list');
    }

    getCoursesList() {
        return this._data.get('courses.list');
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
        return this._data.get('instructors.list');
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
        let val = this._data.get('courses.list[' + courseId + '].instructors');
        val.splice(index, 1);
        fetch.updateCourse(courseId, { instructors: val }, val, 'instructors');
    }

    setApplicantsList(list) {
        this._data.unset('applicants.list', { silent: true });
        this._data.set('applicants.list', list);
    }

    setApplicationsList(list) {
        this._data.unset('applications.list', { silent: true });
        this._data.set('applications.list', list);
    }

    setApplicationRounds(applications, courses) {
        // assumes that all courses in a single application will be part of the same round
        for (var applicant in applications) {
            applications[applicant].forEach((app, index) => {
                if (app.prefs && app.prefs.length > 0) {
                    applications[applicant][index].round = courses[app.prefs[0].positionId].round;
                }
            });
        }

        this.setApplicationsList(applications);
    }

    setAssignmentsList(list) {
        this._data.unset('assignments.list', { silent: true });
        this._data.set('assignments.list', list);
    }

    setCoursesAssignmentCount(courses, counts) {
        for (var course in counts) {
            courses[course].assignmentCount = counts[course];
        }

        this.setCoursesList(courses);
    }

    setCoursesList(list) {
        this._data.unset('courses.list', { silent: true });
        this._data.set('courses.list', list);
    }

    setFetchingApplicantsList(fetching) {
        let init = this._data.get('applicants.fetching');
        if (fetching) {
            this.notify(<i>Fetching applicants...</i>);
            this._data.set('applicants.fetching', init + 1);
        } else {
            this.notify('Finished fetching applicants.');
            this._data.set('applicants.fetching', init - 1);
        }
    }

    setFetchingApplicationsList(fetching) {
        if (this.fetchingApplications() && !fetching) {
            this.notify('Finished fetching applications.');
        } else if (!this.fetchingApplications() && fetching) {
            this.notify(<i>Fetching applications...</i>);
        }

        let init = this._data.get('applications.fetching');
        if (fetching) {
            this._data.set('applications.fetching', init + 1);
        } else {
            this._data.set('applications.fetching', init - 1);
        }
    }

    setFetchingAssignmentsList(fetching) {
        let init = this._data.get('assignments.fetching');
        if (fetching) {
            this.notify(<i>Fetching assignments...</i>);
            this._data.set('assignments.fetching', init + 1);
        } else {
            this.notify('Finished fetching assignments.');
            this._data.set('assignments.fetching', init - 1);
        }
    }

    setFetchingCoursesList(fetching) {
        let init = this._data.get('courses.fetching');
        if (fetching) {
            this.notify(<i>Fetching courses...</i>);
            this._data.set('courses.fetching', init + 1);
        } else {
            this.notify('Finished fetching courses.');
            this._data.set('courses.fetching', init - 1);
        }
    }

    setFetchingInstructorsList(fetching) {
        let init = this._data.get('instructors.fetching');
        if (fetching) {
            this.notify(<i>Fetching instructors...</i>);
            this._data.set('instructors.fetching', init + 1);
        } else {
            this.notify('Finished fetching instructors.');
            this._data.set('instructors.fetching', init - 1);
        }
    }

    setInstructorsList(list) {
        this._data.unset('instructors.list', { silent: true });
        this._data.set('instructors.list', list);
    }

    updateAssignment(applicant, assignment, hours) {
        fetch.updateAssignmentHours(applicant, assignment, hours);
    }

    updateCourse(courseId, val, props) {
        let data = {};
        switch (props) {
            case 'estimatedPositions':
                data['estimated_count'] = val;
            case 'positionHours':
                data['hours'] = val;
            case 'estimatedEnrol':
                data['estimated_enrolment'] = val;
            case 'qual':
                data['qualifications'] = val;
            case 'resp':
                data['duties'] = val;
        }
        fetch.updateCourse(courseId, data, val, props);
    }

    updateInstructorInput(courseId, input) {
        if (input === undefined) {
            input = '';
        }
        this._data.set('courses.list[' + courseId + '].instructor_input', input);
        let visible_input = document.getElementById('input_' + courseId);
        visible_input.innerHTML = input;
    }
}

let appState = new AppState();
export { appState };
