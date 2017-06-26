import React from 'react'
import { Panel } from 'react-bootstrap'

const applicant_data = {
  lastName: 'Last Name',
  firstName: 'First Name',
  utorid: 'applicant utorid',
  email: 'example@mail.utoronto.ca',
  phone: '647-XXX-XXX',
  studentNumber: 'XXXXXXXXXX',
  address: '123 Random Street\r\nToronto, ON\r\nZIP CODE',
  dept: 'Computer Science',
  program: 'MSc',
  year: '3'
};

const application_data = {
  taTraining: true,
  academicAccess: true,
  round: '110',
  prefs: [
    {
      positionId: 1,
      preferred: true
    },
    {
      positionId: 2,
      preferred: false
    },
    {
      positionId: 3,
      preferred: true
    },
    {
      positionId: 4,
      preferred: false
    },
    {
      positionId: 5,
      preferred: false
    },
    {
      positionId: 6,
      preferred: false
    },
  ],
  exp: 'Teaching Experience',
  qual: 'Academic Qualifications',
  skills: 'Technical Skills',
  avail: 'Availability',
  other: 'Other Information',
  special_needs: 'Special Needs'
}

const course_data = {
  1:{
    code: 'CSC108H1'
  },
  2:{
    code: 'CSC165H1'
  },
  3:{
    code: 'CSC148H1'
  },
  4:{
    code: 'CSC209H1'
  },
  5:{
    code: 'CSC108H1-A'
  },
  6:{
    code: 'CSC207H1'
  },
}

const CollapsablePanel = props =>(
  <div className="container-fluid"
    style={{height: '90vh', width: '100vw', overflow: 'auto'}}>
    {props.panels.map(panel => (
      <Panel style={{width: '98vw', float: 'left', margin: '0'}}
        collapsible expanded={panel.expanded}
        header={
          <div style={{width: '100%', height: '100%', margin: '0', cursor: "pointer"}}
            onClick={()=>props.set_expanded(panel.index)}>
            {panel.label}
          </div>}>
        {props.assignment_form.addPanelContent(props.id, props.applicant, props.application, props.course,
          props.assignments, props.temp_assignments, panel.index, props.assignment_form)}
      </Panel>
    ))}
  </div>
);

class AssignmentForm extends React.Component {

  setAddress(address){
    let parts = address.split("\r\n");
    return(
      parts.map(part=>(
        <p>{part}</p>
      ))
    )
  }

  setCourses(courses){
    return(
      Object.entries(courses).map((key, val) => (
        <option value={key[1].code}></option>
      ))
    );
  }

  setAssignments(assignments,courses){
    if(assignments.length==0)
      return (<td><p>No Assignments</p></td>);
    else
      return(
        assignments.map(assignment=>(
          <tr>
            <td>{courses[assignment.positionId].code}</td>
            <td><input type="number" style={{width: '50px'}} value={assignment.hour}/></td>
            <td></td>
            <td>
              <button onClick={()=>alert("Delete assignment with positionId "+assignment.positionId)}
                style={{border: 'none', background: 'none'}}>
                <i className="fa fa-times-circle-o" style={{color: 'red', fontSize: '20px'}}>
                </i>
              </button>
            </td>
          </tr>
        ))
      );
  }

  setTempAssignments(temp_assignments,courses){
    return(
      temp_assignments.map(assignment=>(
        <tr>
          <td>{courses[assignment.positionId].code}</td>
          <td><input type="number" style={{width: '50px'}} value={assignment.hour}/></td>
          <td>
            <button onClick={()=>alert("Add assignment with positionId "+assignment.positionId)}
              style={{border: 'none', background: 'none'}}>
              <i className="fa fa-check-circle-o" style={{color: 'green', fontSize: '20px'}}>
              </i>
            </button>
          </td>
          <td>
            <button onClick={()=>alert("Delete assignment with positionId "+assignment.positionId)}
              style={{border: 'none', background: 'none'}}>
              <i className="fa fa-times-circle-o" style={{color: 'red', fontSize: '20px'}}>
              </i>
            </button>
          </td>
        </tr>
      ))
    );
  }

  setPrefs(pref, course){
    let j = 0, columns=[],size = 4;
    for (let i = 0; i < Math.ceil(pref.length / size); i++) {
      columns[i] = pref.slice(j, j + size);
      j = j + size;
    }
    return (
      columns.map(column=>(
        <td>
          {column.map(item =>(
            <p>
              {course[item.positionId].code}
              {item.preferred?<i className="fa fa-star-o" style={{color:'orange'}}></i>:''}
            </p>
          ))}
        </td>
      ))
    );
  }
  addPanelContent(id, applicant, application, courses, assignments, temp_assignments, index, assignment_form){
    switch(index){
      case 0:
        return (
          <table className="panel_table">
            <td>
              <p><b>Last Name: </b>{applicant.lastName}</p>
              <p><b>UTORIid: </b>{applicant.utorid}</p>
              <p><b>Email address: </b>{applicant.email}</p>
              <p><b>Phone Number: </b>{applicant.phone}</p>
            </td>
            <td>
              <p><b>First Name: </b>{applicant.firstName}</p>
              <p><b>Student ID: </b>{applicant.studentNumber}</p>
            </td>
            <td>
              <p><b>Address: </b></p>
            </td>
            <td>
              {assignment_form.setAddress(applicant.address)}
            </td>
          </table>
        );
      case 1:
        return (
          <table className="panel_table">
            <td><b>Enrolled as a U of T graduate student for the TA session? </b>{application.academicAccess?"Yes":"No"}</td>
            <td><b>Completed a U of T TA training session? </b>{application.taTraining?"Yes":"No"}</td>
          </table>
        );
      case 2:
        return (
          <table className="panel_table">
            <td><b>Department: </b>{applicant.dept}</td>
            <td><b>Program: </b>{applicant.program}</td>
            <td><b>Year: </b>{applicant.year}</td>
          </table>
        );
      case 3:
        return(
          <div>
            <p><b>Application round: </b>110</p>
            <table className="panel_table">
            {assignment_form.setAssignments(assignments, courses)}
            {assignment_form.setTempAssignments(temp_assignments, courses)}
            </table>
            <p style={{marginTop: '10px'}}><b>Add assignment: </b>
              <input type="text" list="courses"/>
            </p>
            <datalist id="courses">
            {assignment_form.setCourses(courses)}
            </datalist>
          </div>
        );
      case 4:
        return(
          <table className="panel_table">
            {assignment_form.setPrefs(application.prefs, courses)}
          </table>
        );
      case 5:
        return(<p>{application.exp}</p>);
      case 6:
        return(<p>{application.qual}</p>);
      case 7:
        return(<p>{application.skills}</p>);
      case 8:
        return(<p>{application.avail}</p>);
      case 9:
        return(<p>{application.other}</p>);
      case 10:
        return(<p>{application.special_needs}</p>);
    }
  }
  render() {
    return (
      <CollapsablePanel id={this.props.match.params.id}
        panels={this.props.assignment_form.panels}
        applicant={applicant_data}
        application={application_data}
        course={course_data}
        assignments={this.props.assignment_form.assignments[this.props.match.params.id]}
        temp_assignments={this.props.assignment_form.temp_assignments[this.props.match.params.id]}
        set_expanded={this.props.assignment_form.set_expanded}
        assignment_form={this}/>
    );
  }
}

export { AssignmentForm };
