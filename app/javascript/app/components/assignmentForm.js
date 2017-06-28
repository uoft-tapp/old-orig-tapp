import React from 'react'
import { Panel } from 'react-bootstrap'

const CollapsablePanel = props =>(
  <div className="container-fluid"
    style={{height: '90vh', width: '100vw', overflow: 'auto'}}>
    {props.assignment_form.panels.map((panel, index) => (
      <Panel style={{width: '98vw', float: 'left', margin: '0'}}
        collapsible expanded={panel.expanded}
        header={
          <div style={{width: '100%', height: '100%', margin: '0', cursor: "pointer"}}
            onClick={()=>(props.state.setExpanded(index))}>
            {panel.label}
          </div>}>
        {props.self.addPanelContent(index, props)}
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
      Object.entries(courses).map(key => (
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
                    props.self.detectAssigmentHour(eventKey, index, props)
                  )}
                  value={assignment.hour}/>
              </td>
              <td></td>
              <td>
                <button onClick={()=>props.state.deleteAssignment(props.id, index)}
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
                  props.self.detectTempAssigmentHour(eventKey, index, props)
                )}
                value={assignment.hour}/>
            </td>
            <td>
              <button onClick={()=>props.state.addAssignment(props.id, index)}
                style={{border: 'none', background: 'none'}}>
                <i className="fa fa-check-circle-o" style={{color: 'green', fontSize: '20px'}}>
                </i>
              </button>
            </td>
            <td>
              <button onClick={()=>props.state.deleteTempAssignment(props.id, index)}
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
    props.state.setInput(evt.target.value);
    for(let course in props.courses){
      if(props.courses[course].code==evt.target.value){
        if(!this.existingAssignment(props, course)){
          props.state.addTempAssignment(props.id, course, props.courses[course].positionHours);
          props.state.setInput("");
        }
        else{
          props.state.setInput("");
          alert(props.courses[course].code+" has already been assigned.");
        }
      }
    }
  }

  detectAssigmentHour(evt, index, props){
    props.state.updateAssignment(props.id, index, evt.target.value);
  }

  detectTempAssigmentHour(evt, index, props){
    props.state.updateTempAssignment(props.id, index, evt.target.value);
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
    if(!props.state.isFetching()){
      let applicant = props.applicant;
      let application = props.application;
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
                {props.self.setAddress(applicant.address)}
              </td>
            </table>
          );
        case 1:
          return (
            <table className="panel_table">
              <td>
                <b>Enrolled as a U of T graduate student for the TA session? </b>
                {application.academicAccess?"Yes":"No"}
              </td>
              <td>
                <b>Completed a U of T TA training session? </b>
                {application.taTraining?"Yes":"No"}
              </td>
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
              <tbody>
              {props.self.setAssignments(props)}
              {props.self.setTempAssignments(props)}
              </tbody>
              </table>
              <p style={{marginTop: '10px'}}><b>Add assignment: </b>
                <input type="text" list="courses" value={props.assignment_form.assignment_input}
                  onChange={(eventKey)=>(props.self.detectCourse(eventKey,props))}/>
              </p>
              <datalist id="courses">
              {props.self.setCourses(props.courses)}
              </datalist>
            </div>
          );
        case 4:
          return(
            <table className="panel_table">
              {props.self.setPrefs(application.prefs, props.courses)}
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
  }
  render() {
    return (
      <CollapsablePanel id={this.props.match.params.id}
        applicant={!this.props.func.isFetching()?this.props.applicants.list[this.props.match.params.id]:{}}
        application={!this.props.func.isFetching()?this.props.applications.list[this.props.match.params.id][0]:{}}
        courses={!this.props.func.isFetching()?this.props.courses.list:[]}
        assignments={!this.props.func.isFetching()?this.props.assignments.list[this.props.match.params.id]:[]}
        temp_assignments={this.props.assignment_form.temp_assignments[this.props.match.params.id]}
        assignment_form={this.props.assignment_form}
        state={this.props.func}
        self={this}/>
    );
  }
}

export { AssignmentForm };
