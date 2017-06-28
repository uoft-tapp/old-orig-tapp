import React from 'react'
import { Panel } from 'react-bootstrap'


class AssignmentForm extends React.Component {

  constructor(props){
    super(props);
  }

  setAssignments(id, assignments, temp_assignments, courses){

    if((assignments===undefined)&&(temp_assignments===undefined))
      return (<td><p>No Assignments</p></td>);
    else{
      if(assignments!==undefined){
        return(
          assignments.map((assignment,index)=>(
            <tr>
              <td>{courses[assignment.positionId].code}</td>
              <td>
                <input type="number" style={{width: '50px'}}
                  onChange={(eventKey)=>(
                    this.detectAssigmentHour(eventKey, index, id)
                  )}
                  value={assignment.hours}/>
              </td>
              <td></td>
              <td>
                <button onClick={()=>this.props.func.deleteAssignment(id, index)}
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

  setTempAssignments(id, assignments, temp_assignments, courses){
    if(temp_assignments!==undefined){
      return(
        temp_assignments.map((assignment,index)=>(
          <tr>
            <td>{courses[assignment.positionId].code}</td>
            <td>
              <input type="number" style={{width: '50px'}}
                onChange={(eventKey)=>(
                  this.detectTempAssigmentHour(eventKey, index, id)
                )}
                value={assignment.hours}/>
            </td>
            <td>
              <button onClick={()=>this.props.func.addAssignment(id, index)}
                style={{border: 'none', background: 'none'}}>
                <i className="fa fa-check-circle-o" style={{color: 'green', fontSize: '20px'}}>
                </i>
              </button>
            </td>
            <td>
              <button onClick={()=>this.props.func.deleteTempAssignment(id, index)}
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

  detectCourse(evt, id, courses, assignments, temp_assignments){
    this.props.func.setInput(evt.target.value);
    for(let course in courses){
      if(courses[course].code==evt.target.value){
        if(!this.existingAssignment(course, assignments, temp_assignments)){
          this.props.func.addTempAssignment(id, course, courses[course].positionHours);
          this.props.func.setInput("");
        }
        else{
          this.props.func.setInput("");
          alert(courses[course].code+" has already been assigned.");
        }
      }
    }
  }

  detectAssigmentHour(evt, index, id){
    this.props.func.updateAssignment(id, index, evt.target.value);
  }

  detectTempAssigmentHour(evt, index, id){
    this.props.func.updateTempAssignment(id, index, evt.target.value);
  }

  existingAssignment(positionId, assignments, temp_assignments){
    for(let assignment in assignments){
      if(assignments[assignment].positionId==positionId)
        return true;
    }
    for(let assignment in temp_assignments){
      if(temp_assignments[assignment].positionId==positionId)
        return true;
    }
    return false;
  }

  setCourses(courses){
    return(
      Object.entries(courses).map(key => (
        <option value={key[1].code}></option>
      ))
    );
  }

  render() {
    let id = this.props.match.params.id;
    let assignments = this.props.assignments.list[id];
    let temp_assignments=this.props.assignment_form.temp_assignments[id];
    let courses = this.props.courses.list;

    return (
      <div>
        <p><b>Application round: </b>110</p>
        <table className="panel_table">
          <tbody>
            {this.setAssignments(id, assignments, temp_assignments, courses)}
            {this.setTempAssignments(id, assignments, temp_assignments, courses)}
          </tbody>
        </table>
        <p style={{marginTop: '10px'}}><b>Add assignment: </b>
          <input type="text" list="courses" value={this.props.assignment_form.assignment_input}
              onChange={(eventKey)=>(this.detectCourse(eventKey, id, courses, assignments, temp_assignments))}/>
        </p>
        <datalist id="courses">
          {this.setCourses(courses)}
        </datalist>
      </div>
    );
  }
}

export { AssignmentForm };
