//import _ from 'underscore'
import Backbone from 'backbone'
import NestedModel from 'backbone-nested'

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
    unassignedView: {
      selected: [],
    },

    /** DB data **/

    applicants: { fetching: false, list: null, },
    applications: { fetching: false, list: null, },
    courses: { fetching: false, list: null, },
    assignments: { fetching: false, list: null, },

    assignment_form: {panels: [], temp_assignments: {}, assignment_input: ""}
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
    selectNavTab(eventKey, applicant_id) {
      if(!this.isFetching()){
        let applicant = this._data.get('applicants.list['+applicant_id+']');
        let applicant_name = applicant.firstName+' '+applicant.lastName;
  	    this._data.set({'nav.selectedTab': eventKey,
  			    'nav.selectedApplicant': applicant_id ? applicant_name : null});
      }
      else {
        this._data.set({'nav.selectedTab': eventKey,
  			    'nav.selectedApplicant': applicant_id ? '-' : null});
      }
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

    // toggle a filter on the applicant table
    toggleFilter(course, field) {
	    let i = this._data.get('abcView.panelFields['+course+'].activeFilters').indexOf(field);

      if (i != -1)
        this._data.remove('abcView.panelFields['+course+'].activeFilters['+i+']');
      else
        this._data.add('abcView.panelFields['+course+'].activeFilters', field);
    }

    // check whether a filter is active on the applicant table
    isFilterActive(course, field) {
	     return this._data.get('abcView.panelFields['+course+'].activeFilters').includes(field);
    }

    // check whether any of the given filters are active on the applicant table
    anyFilterActive(course, fields) {
	     return fields.some((field) => this.isFilterActive(course, field));
    }

    // remove all active filters on the applicant table
    clearFilters(course) {
	     this._data.set('abcView.panelFields['+course+'].activeFilters', []);
    }

    // apply a sort to the applicant table (sorted up initially)
    addSort(course, field) {
	     if (!this._data.get('abcView.panelFields['+course+'].activeSortFields').includes(field + '-up'))
            this._data.add('abcView.panelFields['+course+'].activeSortFields', field + '-up');
    }

    // toggle the sort direction of the sort currently applied to the applicant table
    toggleSortDir(course, field) {
	     let [name, dir] = field.split('-');
	     let newSort = name + '-' + (dir == 'up' ? 'down' : 'up');

	     const sortFields = this._data.get('abcView.panelFields['+course+'].activeSortFields');

	      if (!sortFields.includes(newSort)) {
	         this._data.unset('abcView.panelFields['+course+'].activeSortFields', {silent: true});
	         sortFields[sortFields.indexOf(field)] = newSort;
	         this._data.set('abcView.panelFields['+course+'].activeSortFields', sortFields);
	        }
    }

    // remove a sort from the applicant table
    clearSort(course, field) {
	     let i = this._data.get('abcView.panelFields['+course+'].activeSortFields').indexOf(field);
        this._data.remove('abcView.panelFields['+course+'].activeSortFields['+i+']');
    }

    // Add a sorting field to the assignment/unassignment pages
    addAssignmentSortFilters(field) {
      let attribute = 'unassignedView.selected';
      if(!this._data.get(attribute).includes(field))
        this._data.add(attribute, field);
    }

    clearAssignmentSortFilters(field) {
      let i = this._data.get(attribute).indexOf(field);
      this._data.remove(attribute[field]);
    }

    /** data getters and setters **/

    // create a new assignment (faked - doesn't propagate to db for now)
    addAssignment(applicant, course, hours) {
    	let assignments = this.getAssignmentsList();

    	if (assignments[applicant])
    	    assignments[applicant].push({ positionId: course, hours: hours });
    	else
    	    assignments[applicant] = [{ positionId: course, hours: hours }];

    	this.setAssignmentList(assignments);
    	this.incrementCourseAssignmentCount(course);
    }

    decrementCourseAssignmentCount(course) {
    	let courses = this.getCoursesList();
    	courses[course].assignmentCount--;

      this.setCourseList(courses);
    }

    getApplicationById(applicant) {
	     return this.getApplicationsList()[applicant][0];
    }

    // get applicants who are assigned to course
    getApplicantsAssignedToCourse(course) {
    	let assignments = this.getAssignmentsList(), applicants = this.getApplicantsList(), filteredApplicants = [];

    	let applicant;
    	for (applicant in assignments) {
    	    if (assignments[applicant].some(ass => ass.positionId == course))
    		filteredApplicants.push([applicant, applicants[applicant]]);
	     }

	    return filteredApplicants;
    }

    getApplicantsList() {
	     return this._data.get('applicants.list');
    }

    // get applicants who have applied to course; returns a list of [applicantID, applicantData]
    getApplicantsToCourse(course) {
	     let applications = Object.entries(this.getApplicationsList()).filter(
	    ([key, val]) => val[0].prefs.some(pref => pref.positionId == course));

	     let applicants = this.getApplicantsList(), filteredApplicants = [];

	     applications.forEach(
	         ([key, val]) => filteredApplicants.push([key, applicants[key]]));

	     return filteredApplicants;
    }

    // get applicants to course who are not assigned to it
    getApplicantsToCourseUnassigned(course) {
	     let applicants = this.getApplicantsToCourse(course);
	     let assignments = this.getAssignmentsList();

	     return applicants.filter(
	    ([key, val]) => !assignments[key] || !(assignments[key].some(ass => ass.positionId == course)));
    }

    // check whether this course is a preference for this applicant
    getApplicationPreference(applicant, course) {
	     let prefs = this.getApplicationById(applicant).prefs;

	     return prefs.some(pref => (pref.positionId == course) && pref.preferred);
    }

    getApplicationsList() {
	     return this._data.get('applications.list');
    }

    /** data setters **/

    setFetchingApplicantList(fetching) {
	    this._data.set('applicants.fetching', fetching);
    }

    getAssignmentsByApplicant(applicant) {
    	let assignments = this.getAssignmentsList()[applicant];

    	if (assignments)
    	    return assignments;
    	else
    	    return [];
    }

    getAssignmentsList() {
	     return this._data.get('assignments.list');
    }

    getUnassignedApplicantsList() {
      let assignments = this.getAssignmentsList();
      let applicants = Object.entries(this.getApplicantsList());
      return applicants.filter(
        ([key, val]) => !assignments[key]);
    }

    getCoursesList() {
	     return this._data.get('courses.list');
    }

    getCourseById(course) {
	     return this.getCoursesList()[course];
    }

    getCourseCodeById(course) {
	     return this.getCourseById(course).code;
    }

    incrementCourseAssignmentCount(course) {
    	let courses = this.getCoursesList();
    	courses[course].assignmentCount++;

      this.setCourseList(courses);
    }

    // remove an assignment (faked - doesn't propagate to db for now)
    removeAssignment(applicant, course) {
    	let assignments = this.getAssignmentsList();

    	let i = assignments[applicant].findIndex(ass => ass.positionId == course);
    	assignments[applicant].splice(i, 1);

    	this.setAssignmentList(assignments);
    	this.decrementCourseAssignmentCount(course);
    }

    setApplicantList(list) {
        this._data.unset('applicants.list', {silent: true});
        this._data.set('applicants.list', list);
    }

    setApplicationList(list) {
        this._data.unset('applications.list', {silent: true});
        this._data.set('applications.list', list);
    }

    setApplicationRounds(courses) {
      let applications = this.getApplicationsList();

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

    setAssignmentList(list) {
        this._data.unset('assignments.list', {silent: true});
        this._data.set('assignments.list', list);
    }

    setCoursesAssignmentCount(counts) {
        let courses = this.getCoursesList();

        let course;
        for (course in counts) {
            courses[course].assignmentCount = counts[course];
        }

        this.setCourseList(courses);
    }

    setCourseList(list) {
        this._data.unset('courses.list', {silent: true});
        this._data.set('courses.list', list);
    }

    setFetchingApplicantList(fetching) {
        this._data.set('applicants.fetching', fetching);
    }

    setFetchingApplicationList(fetching) {
        this._data.set('applications.fetching', fetching);
    }

    setFetchingAssignmentList(fetching) {
        this._data.set('assignments.fetching', fetching);
    }

    setFetchingCourseList(fetching) {
        this._data.set('courses.fetching', fetching);
    }

    setAssignmentList(list) {
      this._data.unset('assignment.list', {silent: true});
      this._data.set('assignments.list', list);
    }


    isAssignmentFetching() {
      let assignment_fetch = this._data.get('assignments.fetching');
      return assignment_fetch

    }

    /*For Assignment Form*/
    isFetching(){
      let course_fetch = this._data.get('courses.fetching');
      let applicant_fetch = this._data.get('applicants.fetching');
      let application_fetch = this._data.get('applications.fetching');
      let assignment_fetch = this._data.get('assignments.fetching');
      return course_fetch || applicant_fetch || application_fetch || assignment_fetch;
    }

    jsonToURI(json){
      let i = 0;
      let uri = '';
      for(let key in json){
        if(i!=0)
          uri+='&';
        uri+=key+"="+encodeURIComponent(json[key]);
        i++;
      }
      return uri;
    }

    routeAction(url, method, body, msg, func){
      fetch(url,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: method,
        body: this.jsonToURI(body)
      }).then(function(response) {
          if(response.status==404||response.status==422){
            alert("Action Failed: "+msg);
            return null;
          }
          else if (response.status==204)
            return {};
          else
            return response.json();
      }).then(function(response) {
          if(response!=null)
            func(response);
      });
    }

    createAssignmentForm(panels){
      if(this._data.get('assignment_form.panels').length==0){
        for(let i=0; i< panels.length; i++){
          this._data.set('assignment_form.panels['+i+']', {label: panels[i], expanded: true});
        }
      }
    }
    setInput(value){
      this._data.set('assignment_form.assignment_input', value)
    }
    setExpanded(index){
      this._data.set('assignment_form.panels['+index+'].expanded',
        !this._data.get('assignment_form.panels['+index+'].expanded'));
    }
    addTempAssignment(applicantId, positionId, hours){
      if(this._data.get('assignment_form.temp_assignments['+applicantId+']')===undefined)
        this._data.set('assignment_form.temp_assignments['+applicantId+']', []);

      this._data.get('assignment_form.temp_assignments['+applicantId+']').push(
          {positionId: positionId, hours: hours});
      this._data.set('assignment_form.temp_assignments['+applicantId+']',
        this._data.get('assignment_form.temp_assignments['+applicantId+']'));
    }
    deleteTempAssignment(applicantId, index){
      this._data.remove('assignment_form.temp_assignments['+applicantId+']['+index+']')
    }
    updateTempAssignment(applicantId, index, hours){
      this._data.set('assignment_form.temp_assignments['+applicantId+']['+index+'].hours', hours)
    }
    addAssignment(applicantId, index){
      if(this._data.get('assignments.list['+applicantId+']')===undefined)
        this._data.set('assignments.list['+applicantId+']', []);

      let temp_assignment = this._data.get('assignment_form.temp_assignments['
        +applicantId+']['+index+']');

      this.routeAction('/applicants/'+applicantId+'/assignments', 'post',
        {position_id: temp_assignment.positionId, hours: temp_assignment.hours},
          "could not add Assignment", (res)=>{

          temp_assignment["id"]= res.id;
          this._data.get('assignments.list['+applicantId+']').push(temp_assignment);
          this._data.remove('assignment_form.temp_assignments['+applicantId+']['+index+']');
        });

    }
    deleteAssignment(applicantId, index){
      let assignment = this._data.get('assignments.list['+applicantId+']['+index+']');
      this.routeAction('/applicants/'+applicantId+'/assignments/'+assignment.id, 'delete',
        {}, "could not delete Assignment", (res)=>{

        this._data.remove('assignments.list['+applicantId+']['+index+']');
      });
    }
    updateAssignment(applicantId, index, hours) {
      let assignment = this._data.get('assignments.list['+applicantId+']['+index+']');
      this.routeAction('/applicants/'+applicantId+'/assignments/'+assignment.id, 'put',
        {hours: hours}, "could not update Assignment hours", (res)=>{

          this._data.set('assignments.list['+applicantId+']['+index+'].hours', hours)
      });
    }

}

let appState = new AppState();
export {appState};
