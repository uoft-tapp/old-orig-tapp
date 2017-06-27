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
    code: 'CSC108H1',
    hour: 54
  },
  2:{
    code: 'CSC165H1',
    hour: 55
  },
  3:{
    code: 'CSC148H1',
    hour: 56
  },
  4:{
    code: 'CSC209H1',
    hour: 57
  },
  5:{
    code: 'CSC108H1-A',
    hour: 58
  },
  6:{
    code: 'CSC207H1',
    hour: 59
  },
}

const CollapsablePanel = props =>(
  <div className="container-fluid"
    style={{height: '90vh', width: '100vw', overflow: 'auto'}}>
    {props.state.panels.map(panel => (
      <Panel style={{width: '98vw', float: 'left', margin: '0'}}
        collapsible expanded={panel.expanded}
        header={
          <div style={{width: '100%', height: '100%', margin: '0', cursor: "pointer"}}
            onClick={()=>(props.state.set_expanded(panel.index))}>
            {panel.label}
          </div>}>
        {props.assignment_form.addPanelContent(panel.index, props)}
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

  setAssignments(props){
    if((props.assignments===undefined)&&(props.temp_assignments===undefined))
      return (<td><p>No Assignments</p></td>);
    else{
      if(props.assignments!==undefined){
        return(
          props.assignments.map((assignment,index)=>(
            <tr>
              <td>{props.courses[assignment.positionId].code}</td>
              <td>
                <input type="number" style={{width: '50px'}}
                  onChange={(eventKey)=>(
                    props.assignment_form.detectAssigmentHour(eventKey, index, props)
                  )}
                  value={assignment.hour}/>
              </td>
              <td></td>
              <td>
                <button onClick={()=>props.state.delete_assignment(props.id, index)}
                  style={{border: 'none', background: 'none'}}>
                  <i className="fa fa-times-circle-o" style={{color: 'red', fontSize: '20px'}}>
                  </i>
                </button>
              </td>
            </tr>
          ))
        );
      }
    }
  }

  setTempAssignments(props){
    if(props.temp_assignments!==undefined){
      return(
        props.temp_assignments.map((assignment,index)=>(
          <tr>
            <td>{props.courses[assignment.positionId].code}</td>
            <td>
              <input type="number" style={{width: '50px'}}
                onChange={(eventKey)=>(
                  props.assignment_form.detectTempAssigmentHour(eventKey, index, props)
                )}
                value={assignment.hour}/>
            </td>
            <td>
              <button onClick={()=>props.state.add_assignment(props.id, index)}
                style={{border: 'none', background: 'none'}}>
                <i className="fa fa-check-circle-o" style={{color: 'green', fontSize: '20px'}}>
                </i>
              </button>
            </td>
            <td>
              <button onClick={()=>props.state.delete_temp_assignment(props.id, index)}
                style={{border: 'none', background: 'none'}}>
                <i className="fa fa-times-circle-o" style={{color: 'red', fontSize: '20px'}}>
                </i>
              </button>
            </td>
          </tr>
        ))
      );
    }
  }

  setPrefs(pref, courses){
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
              {courses[item.positionId].code}
              {item.preferred?<i className="fa fa-star-o" style={{color:'orange'}}></i>:''}
            </p>
          ))}
        </td>
      ))
    );
  }

  detectCourse(evt, props){
    props.state.set_input(evt.target.value);
    for(let course in props.courses){
      if(props.courses[course].code==evt.target.value){
        if(!this.existingAssignment(props, course)){
          props.state.add_temp_assignment(props.id, course, props.courses[course].hour);
          props.state.set_input("");
        }
        else{
          props.state.set_input("");
          alert(props.courses[course].code+" has already been assigned.");
        }
      }
    }
  }

  detectAssigmentHour(evt, index, props){
    props.state.update_assignment(props.id, index, evt.target.value);
  }

  detectTempAssigmentHour(evt, index, props){
    props.state.update_temp_assignment(props.id, index, evt.target.value);
  }

  existingAssignment(props, positionId){
    for(let assignment in props.assignments){
      if(props.assignments[assignment].positionId==positionId)
        return true;
    }
    for(let assignment in props.temp_assignments){
      if(props.temp_assignments[assignment].positionId==positionId)
        return true;
    }
    return false;
  }

  addPanelContent(index, props){
    switch(index){
      case 0:
        return (
          <table className="panel_table">
            <td>
              <p><b>Last Name: </b>{props.applicant.lastName}</p>
              <p><b>UTORIid: </b>{props.applicant.utorid}</p>
              <p><b>Email address: </b>{props.applicant.email}</p>
              <p><b>Phone Number: </b>{props.applicant.phone}</p>
            </td>
            <td>
              <p><b>First Name: </b>{props.applicant.firstName}</p>
              <p><b>Student ID: </b>{props.applicant.studentNumber}</p>
            </td>
            <td>
              <p><b>Address: </b></p>
            </td>
            <td>
              {props.assignment_form.setAddress(props.applicant.address)}
            </td>
          </table>
        );
      case 1:
        return (
          <table className="panel_table">
            <td>
              <b>Enrolled as a U of T graduate student for the TA session? </b>
              {props.application.academicAccess?"Yes":"No"}
            </td>
            <td>
              <b>Completed a U of T TA training session? </b>
              {props.application.taTraining?"Yes":"No"}
            </td>
          </table>
        );
      case 2:
        return (
          <table className="panel_table">
            <td><b>Department: </b>{props.applicant.dept}</td>
            <td><b>Program: </b>{props.applicant.program}</td>
            <td><b>Year: </b>{props.applicant.year}</td>
          </table>
        );
      case 3:
        return(
          <div>
            <p><b>Application round: </b>110</p>
            <table className="panel_table">
            <tbody>
            {props.assignment_form.setAssignments(props)}
            {props.assignment_form.setTempAssignments(props)}
            </tbody>
            </table>
            <p style={{marginTop: '10px'}}><b>Add assignment: </b>
              <input type="text" list="courses" value={props.state.assignment_input}
                onChange={(eventKey)=>(props.assignment_form.detectCourse(eventKey,props))}/>
            </p>
            <datalist id="courses">
            {props.assignment_form.setCourses(props.courses)}
            </datalist>
          </div>
        );
      case 4:
        return(
          <table className="panel_table">
            {props.assignment_form.setPrefs(props.application.prefs, props.courses)}
          </table>
        );
      case 5:
        return(<p>{props.application.exp}</p>);
      case 6:
        return(<p>{props.application.qual}</p>);
      case 7:
        return(<p>{props.application.skills}</p>);
      case 8:
        return(<p>{props.application.avail}</p>);
      case 9:
        return(<p>{props.application.other}</p>);
      case 10:
        return(<p>{props.application.special_needs}</p>);
      }
    }
  render() {
    return (
      <CollapsablePanel id={this.props.match.params.id}
        applicant={applicant_data}
        application={application_data}
        courses={course_data}
        assignments={this.props.assignment_form.assignments[this.props.match.params.id]}
        temp_assignments={this.props.assignment_form.temp_assignments[this.props.match.params.id]}
        state={this.props.assignment_form}
        assignment_form={this}/>
    );
  }
}

export { AssignmentForm };
