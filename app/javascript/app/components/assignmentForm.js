import React from 'react'
import { Panel } from 'react-bootstrap'

const check = "fa fa-check-circle-o";
const cross = "fa fa-times-circle-o";


class AssignmentForm extends React.Component {

    setAssignments(id, assignments, temp_assignments, courses){
	if(this.noAssignments(assignments, temp_assignments))
	    return (<tr><td>No Assignments</td></tr>);
	if(assignments!==undefined){
	    return(
		assignments.map((assignment,index)=>(
			<AssignmentRow assignment={assignment}
		    id={id} index={index} courses={courses} temp={false}
		    input_func={this.detectAssignmentHour} self={this}
		    {...this}/>
		))
	    );
	}
    }

    noAssignments(assignments, temp_assignments){
	if(assignments===undefined&&temp_assignments===undefined)
	    return true;
	else if(assignments===undefined){
	    if(temp_assignments!==undefined){
		if(temp_assignments.length==0)
		    return true;
		else { return false; }
	    }
	    else { return false; }
	}
	else if(temp_assignments===undefined){
	    if(assignments!==undefined){
		if(assignments.length==0)
		    return true;
		else { return false; }
	    }
	    else { return false; }
	}
	else if(assignments!==undefined&&temp_assignments!==undefined){
	    if(assignments.length==0&&temp_assignments==0)
		return true;
	    else { return false; }
	}
	else{ return false; }
    }

    setTempAssignments(id, assignments, temp_assignments, courses){
	if(temp_assignments!==undefined){
	    return(
		temp_assignments.map((assignment,index)=>(
			<AssignmentRow assignment={assignment}
		    id={id} index={index} courses={courses} temp={true}
		    input_func={this.detectTempAssignmentHour} self={this}
		    {...this}/>
		))
	    );
	}
    }

    setAssignmentCheckButton(temp, id, index, self){
	if(temp){
	    return(
		    <AssignmentButton
		click_func={()=>this.props.func.addAssignment(id, index)}
		id={id} index={index}
		className="fa fa-check-circle-o" color="green" {...this}/>
	    );
	}
    }

    setAssignmentCrossButton(temp, id, index, self){
	let className="fa fa-times-circle-o";
	if(temp){
	    return(
		    <AssignmentButton
		click_func={()=>this.props.func.removeTempAssignment(index)}
		id={id} index={index} className={className} color="red" {...this}/>
	    );
	}
	else{
	    return(
		    <AssignmentButton
		click_func={()=>this.props.func.deleteAssignment(id, index)}
		id={id} index={index} className={className} color="red" {...this}/>
	    );
	}
    }

    detectCourse(evt, id, courses, assignments, temp_assignments){
	this.props.func.setInput(evt.target.value);
	for(let course in courses){
	    if(courses[course].code==evt.target.value){
		if(!this.existingAssignment(course, assignments, temp_assignments)){
		    this.props.func.addTempAssignment(course, courses[course].positionHours);
		    this.props.func.setInput("");
		}
		else{
		    this.props.func.setInput("");
		    alert(courses[course].code+" has already been assigned.");
		}
	    }
	}
    }

    detectAssignmentHour(evt, index, id){
	this.props.func.updateAssignment(id, index, evt.target.value);
    }

    detectTempAssignmentHour(evt, index, id){
	this.props.func.setTempAssignmentHours(index, evt.target.value);
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
	let assignments = this.props.func.getAssignmentsByApplicant(id);
	let assignmentForm = this.props.func.getAssignmentForm();
	let temp_assignments = this.props.func.getTempAssignments();
	let courses = this.props.func.getCoursesList();
	let application = this.props.func.getApplicationById(id);

	return (
		<div>
		<p><b>Application round: </b>{application.round}</p>
		<table className="panel_table">
		<tbody>
		{this.setAssignments(id, assignments, temp_assignments, courses)}
            {this.setTempAssignments(id, assignments, temp_assignments, courses)}
            </tbody>
		</table>
		<p style={{marginTop: '10px'}}><b>Add assignment: </b>
		<input type="text" list="courses" value={assignmentForm.assignmentInput}
            onChange={(eventKey)=>(this.detectCourse(eventKey, id, courses, assignments, temp_assignments))}/>
		</p>
		<datalist id="courses">
		{this.setCourses(courses)}
            </datalist>
		</div>
	);
    }
}

const AssignmentRow = props =>(
	<tr>
	<td>{props.courses[props.assignment.positionId].code}</td>
	<td>
	<input type="number" style={{width: '50px'}} min="0"
    onChange={(eventKey)=>(props.input_func(eventKey, props.index, props.id))}
    value={props.assignment.hours}/>
	</td>
	<td>
	{props.self.setAssignmentCheckButton(props.temp, props.id, props.index, props.self)}
    </td>
	<td>
	{props.self.setAssignmentCrossButton(props.temp, props.id, props.index, props.self)}
    </td>
	</tr>

);

const AssignmentButton = props =>(
	<button onClick={props.click_func}
    style={{border: 'none', background: 'none'}}>
	<i className={props.className} style={{color: props.color, fontSize: '20px'}}>
	</i>
	</button>
);

export { AssignmentForm };
