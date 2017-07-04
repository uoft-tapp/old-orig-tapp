import Backbone from "backbone";
import NestedModel from "backbone-nested";

const initialState = {
  // navbar component
  nav: {
    role: "role",
    user: "user",

    selectedTab: null,
    selectedApplicant: null
  },

  // course list component
  courseList: {
    selected: null
  },

  // course menu component
  courseMenu: {
    selected: []
  },

  // abc view
  abcView: {
    layout: [],
    // will be populated with mappings of active courses to their active sort and filter fields
    panelFields: {}
  },

  // assigned view
  assignedView: null,

  // unassigned view
  unassignedView: null,

  // assignment form used by applicant view
  assignmentForm: {
    panels: [],
    tempAssignments: {},
    assignmentInput: ""
  },

  /** DB data **/

  applicants: { fetching: false, list: null },
  applications: { fetching: false, list: null },
  assignments: { fetching: false, list: null },
  courses: { fetching: false, list: null },
  instructors: { fetching: false, list: null }
};

class AppState {
  constructor() {
    // container for application state
    this._data = new Backbone.NestedModel(initialState);
  }

  // subscribe listener to change events on this model
  subscribe(listener) {
    this._data.on("change", listener);
  }

  toJSO() {
    return this._data.toJSON();
  }

  /************************************
     ** view state getters and setters **
     ************************************/

  // add a course panel to the ABC view
  addCoursePanel(course, activeCount) {
    let layout = this._data.get("abcView.layout");
    this._data.unset("abcView.layout", { silent: true });

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
          (course1 = layout[0]), ([course2, course3] = layout[1]);
        else if (layout[1].length == 1)
          // layout was [ [course1, course2], course3 ]
          ([course1, course2] = layout[0]), (course3 = layout[1]);
        else if (layout[0][0] == layout[1][0])
          // layout was [ [course1, course2] [course1, course3] ]
          ([course1, course2] = layout[0]), (course3 = layout[1][1]);
        else
          // layout was [ [course1, course2] [course3, course2] ]
          ([course1, course2] = layout[0]), (course3 = layout[1][0]);

        layout = [[course1, course2], [course3, course]];

        break;
    }

    return layout;
  }

  // apply a sort to the applicant table (sorted up initially)
  addSort(course, field) {
    if (!this.getCoursePanelSortsByCourse(course).includes(field))
      this._data.add(
        "abcView.panelFields[" + course + "].activeSortFields",
        field
      );
  }

  // add a temporary assignment through the assignment form of the applicant view
  addTempAssignment(positionId, hours) {
    let applicantId = this.getSelectedApplicant();
    let tempAssignments = this.getTempAssignments();

    if (!tempAssignments) tempAssignments = { applicantId: [] };

    tempAssignments[applicantId].push({ positionId: positionId, hours: hours });

    this._data.unset("assignmentForm.tempAssignments");
    this._data.set("assignmentForm.tempAssignments", tempAssignments);
  }

  // check whether any of the given filters are active on the applicant table
  anyFilterActive(course, fields) {
    return fields.some(field => this.isFilterActive(course, field));
  }

  // remove all active filters on the applicant table
  clearFilters(course) {
    this._data.set("abcView.panelFields[" + course + "].activeFilters", []);
  }

  createAssignmentForm(panels) {
    if (this.getAssignmentForm().panels.length == 0)
      this._data.set(
        "assignmentForm.panels",
        panels.map(panel => ({ label: panel, expanded: true }))
      );
  }

  getAssignmentForm() {
    return this._data.get("assignmentForm");
  }

  getCoursePanelFields() {
    return this._data.get("abcView.panelFields");
  }

  getCoursePanelFieldsByCourse(course) {
    return this.getCoursePanelFields()[course];
  }

  getCoursePanelFiltersByCourse(course) {
    return this.getCoursePanelFieldsByCourse(course).activeFilters;
  }

  getCoursePanelLayout() {
    return this._data.get("abcView.layout");
  }

  getCoursePanelSortsByCourse(course) {
    return this.getCoursePanelFieldsByCourse(course).activeSortFields;
  }

  getCurrentUserName() {
    return this._data.get("nav.user");
  }

  getCurrentUserRole() {
    return this._data.get("nav.role");
  }

  getSelectedCourses() {
    return this._data.get("courseMenu.selected");
  }

  getSelectedNavTab() {
    return this._data.get("nav.selectedTab");
  }

  getSelectedApplicant() {
    return this._data.get("nav.selectedApplicant");
  }

  getTempAssignments() {
    return this._data.get(
      "assignmentForm.tempAssignments[" + this.getSelectedApplicant() + "]"
    );
  }

  // check whether a course in the course menu is selected
  isCourseSelected(course) {
    return this.getSelectedCourses().includes(course);
  }

  // check whether a filter is active on the applicant table
  isFilterActive(course, field) {
    return this.getCoursePanelFiltersByCourse(course).includes(field);
  }

  // check whether a panel is expanded in the applicant view
  isPanelExpanded(index) {
    return this._data.get("assignmentForm.panels[" + index + "].expanded");
  }

  // check whether a sort is active on the applicant table
  isSortActive(course, field) {
    return this.getCoursePanelSortsByCourse(course).includes(field);
  }

  // remove a course panel from the ABC view
  removeCoursePanel(course, activeCount) {
    let layout = this._data.get("abcView.layout");
    let layoutLen = layout.length;
    this._data.unset("abcView.layout", { silent: true });

    switch (activeCount) {
      case 0:
        layout = [];
        break;

      case 1: // layout is now [ course ]
        if (layoutLen == 2)
          // layout was [ course1, course2 ]
          layout = [layout[0] == course ? layout[1] : layout[0]];
        else
          // layout was [ [course1, course2] ]
          layout = [layout[0][0] == course ? layout[0][1] : layout[0][0]];

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
            if (i != -1) layout.splice(i, 1);
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

  // remove a sort from the applicant table
  removeSort(course, field) {
    let i = this.getCoursePanelSortsByCourse(course).indexOf(field);
    this._data.remove(
      "abcView.panelFields[" + course + "].activeSortFields[" + i + "]"
    );
  }

  // remove a temporary assignment from the assignment form of the applicant view
  removeTempAssignment(index) {
    this._data.remove(
      "assignmentForm.tempAssignments[" +
        this.getSelectedApplicant() +
        "][" +
        index +
        "]"
    );
  }

  setInput(value) {
    this._data.set("assignmentForm.assignmentInput", value);
  }

  // select a navbar tab
  selectNavTab(eventKey, applicant) {
    this._data.set({
      "nav.selectedTab": eventKey,
      "nav.selectedApplicant": applicant ? applicant : null
    });
  }

  // change the number of hours of a temporary assignment
  setTempAssignmentHours(index, hours) {
    this._data.set(
      "assignmentForm.tempAssignments[" +
        this.getSelectedApplicant() +
        "][" +
        index +
        "].hours",
      hours
    );
  }

  // toggle the visibility of a course panel in the ABC view
  toggleCoursePanel(course) {
    let active = this.getSelectedCourses();

    let panelFields = this.getCoursePanelFields();

    if (active.includes(course)) {
      // add course to layout
      this._data.set(
        "abcView.layout",
        this.addCoursePanel(course, active.length)
      );

      // add panel to panel state tracker
      this._data.set("abcView.panelFields[" + course + "]", {
        activeSortFields: [],
        activeFilters: []
      });
    } else {
      // remove course from layout
      this._data.set(
        "abcView.layout",
        this.removeCoursePanel(course, active.length)
      );
    }
  }

  // toggle the expanded state of a panel in the applicant assignment form component
  togglePanelExpanded(index) {
    this._data.set(
      "assignmentForm.panels[" + index + "].expanded",
      !this.isPanelExpanded(index)
    );
  }

  // toggle a filter on the applicant table
  toggleFilter(course, field) {
    let i = this.getCoursePanelFiltersByCourse(course).indexOf(field);

    if (i != -1)
      this._data.remove(
        "abcView.panelFields[" + course + "].activeFilters[" + i + "]"
      );
    else
      this._data.add(
        "abcView.panelFields[" + course + "].activeFilters",
        field
      );
  }

  // toggle the selected state of the course that is clicked
  toggleSelectedCourse(course) {
    let selected = this._data.get("courseMenu.selected");
    let i = selected.indexOf(course);

    if (i == -1) {
      if (selected.length < 4) this._data.add("courseMenu.selected", course);
    } else {
      this._data.remove("courseMenu.selected[" + i + "]");
    }
  }

  // toggle the sort direction of the sort currently applied to the applicant table
  toggleSortDir(course, field) {
    const sortFields = this.getCoursePanelSortsByCourse(course);

    if (!sortFields.includes(-field)) {
      this._data.unset("abcView.panelFields[" + course + "].activeSortFields", {
        silent: true
      });

      sortFields[sortFields.indexOf(field)] = -field;
      this._data.set(
        "abcView.panelFields[" + course + "].activeSortFields",
        sortFields
      );
    }
  }

  /******************************
     ** data getters and setters **
     ******************************/

  // create a new assignment (faked - doesn't propagate to db for now)
  fakeAssignment(applicant, course, hours) {
    let assignments = this.getAssignmentsList();

    if (assignments[applicant])
      assignments[applicant].push({ positionId: course, hours: hours });
    else assignments[applicant] = [{ positionId: course, hours: hours }];

    this.setAssignmentList(assignments);
    this.incrementCourseAssignmentCount(course);
  }

  // create a new assignment
  addAssignment(applicant, course, hours) {}

  // check if any data is still being fetched
  anyFetching() {
    return [
      this.getCoursesList() == null,
      this.fetchingCourses(),
      this.getInstructorsList() == null,
      this.fetchingInstructors(),
      this.getApplicantsList() == null,
      this.fetchingApplicants(),
      this.getApplicationsList() == null,
      this.fetchingApplications(),
      this.getAssignmentsList() == null,
      this.fetchingAssignments()
    ].some(val => val);
  }

  decrementCourseAssignmentCount(course) {
    let courses = this.getCoursesList();
    courses[course].assignmentCount--;

    this.setCourseList(courses);
  }

  // check if applicants are being fetched
  fetchingApplicants() {
    return this._data.get("applicants.fetching");
  }

  // check if applications are being fetched
  fetchingApplications() {
    return this._data.get("applications.fetching");
  }

  // check if assignments are being fetched
  fetchingAssignments() {
    return this._data.get("assignments.fetching");
  }

  // check if courses are being fetched
  fetchingCourses() {
    return this._data.get("courses.fetching");
  }

  // check if instructors are being fetched
  fetchingInstructors() {
    return this._data.get("instructors.fetching");
  }

  // get applicants who are assigned to course
  getApplicantsAssignedToCourse(course) {
    let assignments = this.getAssignmentsList(),
      applicants = this.getApplicantsList(),
      filteredApplicants = [];

    let applicant;
    for (applicant in assignments) {
      if (assignments[applicant].some(ass => ass.positionId == course))
        filteredApplicants.push([applicant, applicants[applicant]]);
    }

    return filteredApplicants;
  }

  getApplicantById(applicant) {
    return this.getApplicantsList()[applicant];
  }

  getApplicantsList() {
    return this._data.get("applicants.list");
  }

  // get applicants who have applied to course; returns a list of [applicantID, applicantData]
  getApplicantsToCourse(course) {
    let applications = Object.entries(
      this.getApplicationsList()
    ).filter(([key, val]) =>
      val[0].prefs.some(pref => pref.positionId == course)
    );

    let applicants = this.getApplicantsList(),
      filteredApplicants = [];

    applications.forEach(([key, val]) =>
      filteredApplicants.push([key, applicants[key]])
    );

    return filteredApplicants;
  }

  // get applicants to course who are not assigned to it
  getApplicantsToCourseUnassigned(course) {
    let applicants = this.getApplicantsToCourse(course);
    let assignments = this.getAssignmentsList();

    return applicants.filter(
      ([key, val]) =>
        !assignments[key] ||
        !assignments[key].some(ass => ass.positionId == course)
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
    return this._data.get("applications.list");
  }

  getAssignmentsByApplicant(applicant) {
    let assignments = this.getAssignmentsList()[applicant];

    if (assignments) return assignments;
    else return [];
  }

  getAssignmentsList() {
    return this._data.get("assignments.list");
  }

  getCoursesList() {
    return this._data.get("courses.list");
  }

  getCourseById(course) {
    return this.getCoursesList()[course];
  }

  getCourseCodeById(course) {
    return this.getCourseById(course).code;
  }

  getInstructorsList() {
    return this._data.get("instructors.list");
  }

  incrementCourseAssignmentCount(course) {
    let courses = this.getCoursesList();
    courses[course].assignmentCount++;

    this.setCourseList(courses);
  }

  // persist a temporary assignment to the database
  permAssignment(index) {
    let assignments = this.getAssignmentsByApplicant(applicant);
    let tempAssignment = this.getTempAssignments()[index];

    this.routeAction(
      "/applicants/" + applicantId + "/assignments",
      "post",
      { position_id: tempAssignment.positionId, hours: tempAssignment.hours },
      "could not add Assignment",
      res => {
        tempAssignment["id"] = res.id;
        this._data
          .get("assignments.list[" + applicantId + "]")
          .push(tempAssignment);
        this._data.remove(
          "assignmentForm.tempAssignments[" + applicantId + "][" + index + "]"
        );
      }
    );
  }

  // remove an assignment (faked - doesn't propagate to db for now)
  removeAssignment(applicant, course) {
    let assignments = this.getAssignmentsList();

    let i = assignments[applicant].findIndex(ass => ass.positionId == course);
    assignments[applicant].splice(i, 1);

    this.setAssignmentList(assignments);
    this.decrementCourseAssignmentCount(course);
  }

  setApplicantsList(list) {
    this._data.unset("applicants.list", { silent: true });
    this._data.set("applicants.list", list);
  }

  setApplicationsList(list) {
    this._data.unset("applications.list", { silent: true });
    this._data.set("applications.list", list);
  }

  setApplicationRounds(courses) {
    let applications = this.getApplicationsList();

    // assumes that all courses in a single application will be part of the same round, and that all applicants
    // have applied to at least one course
    let applicant;
    for (applicant in applications) {
      applications[applicant].forEach((app, index) => {
        applications[applicant][index].round =
          courses[app.prefs[0].positionId].round;
      });
    }

    this.setApplicationsList(applications);
  }

  setAssignmentsList(list) {
    this._data.unset("assignments.list", { silent: true });
    this._data.set("assignments.list", list);
  }

  setCoursesAssignmentCount(counts) {
    let courses = this.getCoursesList();

    let course;
    for (course in counts) {
      courses[course].assignmentCount = counts[course];
    }

    this.setCoursesList(courses);
  }

  setCoursesList(list) {
    this._data.unset("courses.list", { silent: true });
    this._data.set("courses.list", list);
  }

  setFetchingApplicantsList(fetching) {
    this._data.set("applicants.fetching", fetching);
  }

  setFetchingApplicationsList(fetching) {
    this._data.set("applications.fetching", fetching);
  }

  setFetchingAssignmentsList(fetching) {
    this._data.set("assignments.fetching", fetching);
  }

  setFetchingCoursesList(fetching) {
    this._data.set("courses.fetching", fetching);
  }

  setFetchingInstructorsList(fetching) {
    this._data.set("instructors.fetching", fetching);
  }

  setInstructorsList(list) {
    this._data.unset("instructors.list", { silent: true });
    this._data.set("instructors.list", list);
  }

  /*For Assignment Form*/

  jsonToURI(json) {
    let i = 0;
    let uri = "";
    for (let key in json) {
      if (i != 0) uri += "&";
      uri += key + "=" + encodeURIComponent(json[key]);
      i++;
    }
    return uri;
  }

  routeAction(url, method, body, msg, func) {
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      method: method,
      body: this.jsonToURI(body)
    })
      .then(function(response) {
        if (response.status == 404 || response.status == 422) {
          alert("Action Failed: " + msg);
          return null;
        } else if (response.status == 204) return {};
        else return response.json();
      })
      .then(function(response) {
        if (response != null) func(response);
      });
  }

  deleteAssignment(applicantId, index) {
    let assignment = this._data.get(
      "assignments.list[" + applicantId + "][" + index + "]"
    );
    this.routeAction(
      "/applicants/" + applicantId + "/assignments/" + assignment.id,
      "delete",
      {},
      "could not delete Assignment",
      res => {
        this._data.remove(
          "assignments.list[" + applicantId + "][" + index + "]"
        );
      }
    );
  }
  updateAssignment(applicantId, index, hours) {
    let assignment = this._data.get(
      "assignments.list[" + applicantId + "][" + index + "]"
    );
    this.routeAction(
      "/applicants/" + applicantId + "/assignments/" + assignment.id,
      "put",
      { hours: hours },
      "could not update Assignment hours",
      res => {
        this._data.set(
          "assignments.list[" + applicantId + "][" + index + "].hours",
          hours
        );
      }
    );
  }
}

let appState = new AppState();
export { appState };
