import _ from 'underscore'
import Backbone from 'backbone'
import NestedModel from 'backbone-nested'
import React from 'react'
import ReactDOM from 'react-dom'

window.React = React;
window.ReactDOM = ReactDOM;

let appState = new Backbone.NestedModel({
    
    // navbar component
    nav: {
	role: "role",
	user: "user",

	selectedTab: null,

	selectedApplicant: null,
	
	selectTab: (eventKey, applicant) => {
	    appState.set({'nav.selectedTab': eventKey,
			  'nav.selectedApplicant': applicant ? applicant : null});
	},
    },

    // course list component
    courseList: {
	selected: null,
    },
    
    // course menu component
    courseMenu: {
	selected: [],

	// toggle the selected state of the course that is clicked
	toggleSelected: courseCode => {
	    let selected = appState.get('courseMenu.selected');
	    let i = selected.indexOf(courseCode);
	    
	    if (i == -1) {
		if (selected.length < 4)
		    appState.add('courseMenu.selected', courseCode);	
	    } else {
		appState.remove('courseMenu.selected[' + i + ']');
	    }
	},

	isSelected: courseCode => appState.get('courseMenu.selected').includes(courseCode),
	
    },

    // abc view
    abcView: {
	layout: [],

	// will be populated with mappings of active courses to their active sort and filter fields
	panelFields: {},

	addCoursePanel: (courseCode, activeCount) => {
	    let layout = appState.get('abcView.layout');
	    appState.unset('abcView.layout', {silent: true});
	    
	    switch (activeCount) {
	    case 1:
		// layout is now [ course ]
		layout = [courseCode];
		break;

	    case 2:
		// layout is now [ course1, course2 ]
		layout.push(courseCode);
		break;

	    case 3:
		if (layout.length == 2)
		    // layout was [ course1, course2 ], is now [ course1, course2, course3 ]
		    layout.push(courseCode);
		
		else
		    // layout was [ [course1, course2] ], is now [ course3, [course1, course2] ]
		    layout = [courseCode, layout];

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

		layout = [[course1, course2], [course3, courseCode]];
		
		break;
	    }

	    return layout;
	},

	removeCoursePanel: (courseCode, activeCount) => {
	    let layout = appState.get('abcView.layout');
	    let layoutLen = layout.length;
	    appState.unset('abcView.layout', {silent: true});
	    
	    switch (activeCount) {
	    case 0:
		layout = [];
		break;

	    case 1: // layout is now [ course ]

		if (layoutLen == 2)
		    // layout was [ course1, course2 ]
		    layout = [(layout[0] == courseCode) ? layout[1] : layout[0]];
		else
		    // layout was [ [course1, course2] ]
		    layout = [(layout[0][0] == courseCode) ? layout[0][1] : layout[0][0]];

		break;

	    case 2: // layout is now [ course1, course2 ]
		
		if (layoutLen == 1) {
		    // layout was [ [course1, course2, course3] ]
		    layout[0].splice(layout.indexOf(courseCode), 1);
		    layout = layout[0];

		} else if (layoutLen == 2) {
		    layout = [].concat(layout[0]).concat(layout[1]);

		    if (layout.length == 3) {
			// layout was [ course1, [course2, course3] ] or [ [course1, course2], course3 ]
			layout.splice(layout.indexOf(courseCode), 1);

		    } else {
			// layout was [ [course1, course2], [course1, course3] ] or
			// [ [course1, course2], [course3, course2] ]
			layout.splice(layout.indexOf(courseCode), 1);

			let i = layout.indexOf(courseCode);
			if (i != -1)
			    layout.splice(i, 1);
		    }
		
		} else if (layoutLen == 3) {
		    // layout was [ course1, course2, course3 ]
		    layout.splice(layout.indexOf(courseCode), 1);
		}
			   
		break;
		
	    case 3: // layout is now [ course1, course2, course3 ]
		layout = layout[0].concat(layout[1]);
		layout.splice(layout.indexOf(courseCode), 1);
		break;
	    }

	    return layout;
	},
	
	toggleCoursePanel: (courseCode) => {
	    let active = appState.get('courseMenu.selected');
	    
	    let panelFields = appState.get('abcView.panelFields');

	    if (active.includes(courseCode)) {
		// add course to layout
		appState.set('abcView.layout', appState.get('abcView.addCoursePanel')(courseCode, active.length));

		// add panel to panel state tracker
		appState.set('abcView.panelFields['+courseCode+']', {activeSortFields: [], activeFilters: []});
		    
	    } else {
		// remove course from layout
		appState.set('abcView.layout', appState.get('abcView.removeCoursePanel')(courseCode, active.length));
	    }
	},

	filter: (courseCode, field) => {
	    if (!appState.get('abcView.panelFields['+courseCode+'].activeFilters').includes(field))
		appState.add('abcView.panelFields['+courseCode+'].activeFilters', field);
	},
	
	sort: (courseCode, field) => {
	    if (!appState.get('abcView.panelFields['+courseCode+'].activeSortFields').includes(field))
		// sorted up by default
		appState.add('abcView.panelFields['+courseCode+'].activeSortFields', field + '-up');
	},
    },

    assignedView: null,

    unassignedView: null,

    /** data setters **/
    
    setFetchingApplicantList: (fetching) => {
	appState.set('applicants.fetching', fetching);
    },

    setApplicantList: (list) => {
	appState.unset('applicants.list', {silent: true});
	appState.set('applicants.list', list);
    },

    setFetchingApplicationList: (fetching) => {
	appState.set('applications.fetching', fetching);
    },

    setApplicationList: (list) => {
	appState.unset('applications.list', {silent: true});
	appState.set('applications.list', list);
    },

    setApplicationRounds: (courses) => {
	let applications = appState.get('applications.list');
	
	// assumes that all courses in a single application will be part of the same round, and that all applicants
	// have applied to at least one course
	let applicant;
	for (applicant in applications) {
	    applications[applicant].forEach((app, index) => {
		applications[applicant][index].round = courses[app.prefs[0].positionId].round;
	    });
	}

	appState.get('setApplicationList')(applications);
    },

    setFetchingCourseList: (fetching) => {
	appState.set('courses.fetching', fetching);
    },

    setCourseList: (list) => {
	appState.unset('courses.list', {silent: true});
	appState.set('courses.list', list);
    },

    setCourseAssignmentCounts: (counts) => {
	let courses = appState.get('courses.list');

	let course;
	for (course in counts) {
	    courses[course].assignmentCount = counts[course];
	}
	
	appState.get('setCourseList')(courses);
    },

    setFetchingAssignmentList: (fetching) => {
	appState.set('assignments.fetching', fetching);
    },

    setAssignmentList: (list) => {
	appState.unset('assignment.list', {silent: true});
	appState.set('assignments.list', list);
    },    

    /** data **/
    
    // applicant data
    applicants: {
	fetching: false,	
	list: null,
    },

    // application data
    applications: {
	fetching: false,
	list: null,
    },

    // courses data
    courses: {
	fetching: false,
	list: null,
    },

    // assignments data
    assignments: {
	fetching: false,
	list: null,
    },
});


export {appState};
