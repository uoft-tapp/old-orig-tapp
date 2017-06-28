import _ from 'underscore'
import Backbone from 'backbone'
import NestedModel from 'backbone-nested'
import React from 'react'
import ReactDOM from 'react-dom'

window.React = React;
window.ReactDOM = ReactDOM;

const initialState = {
    // navbar component
    nav: {
        role: "role",
        user: "user",

        selectedTab: null,
        selectedApplicant: null,
    },

    // course list component
    courseList: {
        selected: null,
    },

    // course menu component
    courseMenu: {
        selected: [],
    },
    
    // abc view
    abcView: {
        layout: [],
        // will be populated with mappings of active courses to their active sort and filter fields
        panelFields: {},
    },

    // assigned view
    assignedView: null,

    // unassigned view
    unassignedView: null,
    
    /** DB data **/
    
    applicants: { fetching: false, list: null, },
    applications: { fetching: false, list: null, },
    courses: { fetching: false, list: null, },
    assignments: { fetching: false, list: null, },
};

class AppState {
    constructor() {
        this._data = new Backbone.NestedModel(initialState);
    }

    // subscribe listener to change events on this model
    subscribe(listener) {
        this._data.on('change', listener);
    }

    toJSO() {
        return this._data.toJSON();
    }
    
    // select a navbar tab
    selectNavTab(eventKey, applicant) {
        this._data.set({'nav.selectedTab': eventKey,
                        'nav.selectedApplicant': applicant ? applicant : null});
    }
    
    // toggle the selected state of the course that is clicked
    toggleSelectedCourse(course) {
        let selected = this._data.get('courseMenu.selected');
        let i = selected.indexOf(course);

        if (i == -1) {
            if (selected.length < 4)
                this._data.add('courseMenu.selected', course);
        } else {
            this._data.remove('courseMenu.selected[' + i + ']');
        };
    }

    // check whether a course in the course menu is selected
    isCourseSelected(course) {
        return this._data.get('courseMenu.selected').includes(course);
    }

    // add a course panel to the ABC view
    addCoursePanel(course, activeCount) {
        let layout = this._data.get('abcView.layout');
        this._data.unset('abcView.layout', {silent: true});

        switch (activeCount) {
        case 1:
            // layout is now [ course ]
            layout = [course];
            break;

        case 2:
            // layout is now [ course1, course2 ]
            layout.push(course);
            break;

        case 3:
            if (layout.length == 2)
                // layout was [ course1, course2 ], is now [ course1, course2, course3 ]
                layout.push(course);

            else
                // layout was [ [course1, course2] ], is now [ course3, [course1, course2] ]
                layout = [course, layout];

            break;

        case 4:
            // layout is now [ [course1, course2], [course3, course4] ]
            let course1, course2, course3;

            if (layout.length == 3)
                // layout was [ course1, course2, course3 ]
                [course1, course2, course3] = layout;

            else if (layout.length == 1)
                // layout was [ [course1, course2, course3] ]
                [course1, course2, course3] = layout[0];

            else if (layout[0].length == 1)
                // layout was [ course1, [course2, course3] ]
                course1 = layout[0], [course2, course3] = layout[1];

            else if (layout[1].length == 1)
                // layout was [ [course1, course2], course3 ]
                [course1, course2] = layout[0], course3 = layout[1];

            else if (layout[0][0] == layout[1][0])
                // layout was [ [course1, course2] [course1, course3] ]
                [course1, course2] = layout[0], course3 = layout[1][1];

            else
                // layout was [ [course1, course2] [course3, course2] ]
                [course1, course2] = layout[0], course3 = layout[1][0];

            layout = [[course1, course2], [course3, course]];

            break;
        }

        return layout;
    }

    // remove a course panel from the ABC view
    removeCoursePanel(course, activeCount) {
        let layout = this._data.get('abcView.layout');
        let layoutLen = layout.length;
        this._data.unset('abcView.layout', {silent: true});

        switch (activeCount) {
        case 0:
            layout = [];
            break;

        case 1: // layout is now [ course ]

            if (layoutLen == 2)
                // layout was [ course1, course2 ]
                layout = [(layout[0] == course) ? layout[1] : layout[0]];
            else
                // layout was [ [course1, course2] ]
                layout = [(layout[0][0] == course) ? layout[0][1] : layout[0][0]];

            break;

        case 2: // layout is now [ course1, course2 ]

            if (layoutLen == 1) {
                // layout was [ [course1, course2, course3] ]
                layout[0].splice(layout.indexOf(course), 1);
                layout = layout[0];

            } else if (layoutLen == 2) {
                layout = [].concat(layout[0]).concat(layout[1]);

                if (layout.length == 3) {
                    // layout was [ course1, [course2, course3] ] or [ [course1, course2], course3 ]
                    layout.splice(layout.indexOf(course), 1);

                } else {
                    // layout was [ [course1, course2], [course1, course3] ] or
                    // [ [course1, course2], [course3, course2] ]
                    layout.splice(layout.indexOf(course), 1);

                    let i = layout.indexOf(course);
                    if (i != -1)
                        layout.splice(i, 1);
                }

            } else if (layoutLen == 3) {
                // layout was [ course1, course2, course3 ]
                layout.splice(layout.indexOf(course), 1);
            }

            break;

        case 3: // layout is now [ course1, course2, course3 ]
            layout = layout[0].concat(layout[1]);
            layout.splice(layout.indexOf(course), 1);
            break;
        }

        return layout;
    }

    // toggle the visibility of a course panel in the ABC view
    toggleCoursePanel(course) {
        let active = this._data.get('courseMenu.selected');

        let panelFields = this._data.get('abcView.panelFields');

        if (active.includes(course)) {
            // add course to layout
            this._data.set('abcView.layout', this.addCoursePanel(course, active.length));

            // add panel to panel state tracker
            this._data.set('abcView.panelFields['+course+']', {activeSortFields: [], activeFilters: []});

        } else {
            // remove course from layout
            this._data.set('abcView.layout', this.removeCoursePanel(course, active.length));
        }
    }

    // apply a filter to the applicant table
    filterApplicants(courseCode, field) {
        if (!this._data.get('abcView.panelFields['+courseCode+'].activeFilters').includes(field))
            this._data.add('abcView.panelFields['+courseCode+'].activeFilters', field);
    }

    // apply a sort to the applicant table
    sortApplicants(courseCode, field) {
        if (!this._data.get('abcView.panelFields['+courseCode+'].activeSortFields').includes(field))
            // sorted up by default
            this._data.add('abcView.panelFields['+courseCode+'].activeSortFields', field + '-up');
    }

    /** data setters **/
    
    setFetchingApplicantList(fetching) {
        this._data.set('applicants.fetching', fetching);
    }

    setApplicantList(list) {
        this._data.unset('applicants.list', {silent: true});
        this._data.set('applicants.list', list);
    }

    setFetchingApplicationList(fetching) {
        this._data.set('applications.fetching', fetching);
    }

    setApplicationList(list) {
        this._data.unset('applications.list', {silent: true});
        this._data.set('applications.list', list);
    }

    setApplicationRounds(courses) {
        let applications = this._data.get('applications.list');
        
        // assumes that all courses in a single application will be part of the same round, and that all applicants
        // have applied to at least one course
        let applicant;
        for (applicant in applications) {
            applications[applicant].forEach((app, index) => {
                applications[applicant][index].round = courses[app.prefs[0].positionId].round;
            });
        }

        this.setApplicationList(applications);
    }

    setFetchingCourseList(fetching) {
        this._data.set('courses.fetching', fetching);
    }

    setCourseList(list) {
        this._data.unset('courses.list', {silent: true});
        this._data.set('courses.list', list);
    }

    setCourseAssignmentCounts(counts) {
        let courses = this._data.get('courses.list');

        let course;
        for (course in counts) {
            courses[course].assignmentCount = counts[course];
        }

        this.setCourseList(courses);
    }

    setFetchingAssignmentList(fetching) {
        this._data.set('assignments.fetching', fetching);
    }

    setAssignmentList(list) {
        this._data.unset('assignment.list', {silent: true});
        this._data.set('assignments.list', list);
    }    
}

let appState = new AppState();
export {appState};
