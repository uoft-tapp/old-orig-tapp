import React from 'react';

class AssignmentForm extends React.Component {
    detectCourse(evt, id, courses, assignments, temp_assignments) {
        this.props.func.setInput(evt.target.value);
        for (let course in courses) {
            if (courses[course].code == evt.target.value) {
                if (!this.existingAssignment(course, assignments, temp_assignments)) {
                    this.props.func.addTempAssignment(course, courses[course].positionHours);
                    this.props.func.setInput('');
                } else {
                    this.props.func.setInput('');
                    this.props.func.alert(courses[course].code + ' has already been assigned.');
                }
            }
        }
    }

    existingAssignment(positionId, assignments, temp_assignments) {
        for (let assignment in assignments) {
            if (assignments[assignment].positionId == positionId) {
                return true;
            }
        }
        for (let assignment in temp_assignments) {
            if (temp_assignments[assignment].positionId == positionId) {
                return true;
            }
        }
        return false;
    }

    setCourses(courses) {
        return Object.entries(courses).map((key, index) =>
            <option value={key[1].code} key={index} />
        );
    }

    render() {
        let applicant = this.props.applicantId;
        let assignments = this.props.func.getAssignmentsByApplicant(applicant);
        let temp_assignments = this.props.func.getTempAssignments();
        let assignmentForm = this.props.func.getAssignmentForm();
        let courses = this.props.func.getCoursesList();

        return (
            <div>
                <table className="panel_table">
                    <tbody>
                        {(!assignments || assignments.length == 0) &&
                            (!temp_assignments || temp_assignments.length == 0) &&
                            <tr>
                                <td>
                                    <i>No Assignments</i>
                                </td>
                            </tr>}

                        {temp_assignments &&
                            temp_assignments.map((assignment, index) =>
                                <TempAssignmentRow
                                    assignment={assignment}
                                    key={index}
                                    course={courses[assignment.positionId].code}
                                    {...this.props}
                                />
                            )}

                        {assignments &&
                            assignments.map((assignment, index) =>
                                <AssignmentRow
                                    assignment={assignment}
                                    key={index}
                                    course={courses[assignment.positionId].code}
                                    applicant={applicant}
                                    {...this.props}
                                />
                            )}
                    </tbody>
                </table>

                <p style={{ marginTop: '10px' }}>
                    <b>Add assignment: </b>
                    <input
                        type="text"
                        list="courses"
                        value={assignmentForm.assignmentInput}
                        onChange={eventKey =>
                            this.detectCourse(
                                eventKey,
                                applicant,
                                courses,
                                assignments,
                                temp_assignments
                            )}
                    />
                </p>
                <datalist id="courses">
                    {this.setCourses(courses)}
                </datalist>
            </div>
        );
    }
}

const AssignmentRow = props =>
    <tr>
        <td>
            {props.course}
        </td>
        <td>
            <input
                type="number"
                style={{ width: '50px' }}
                min="0"
                onBlur={eventKey => {
                    if (eventKey.target.value != props.assignment.hours) {
                        props.func.updateAssignment(
                            props.applicant,
                            props.assignment.id,
                            eventKey.target.value
                        );
                    }
                }}
                defaultValue={props.assignment.hours}
            />
        </td>
        <td>
            <X click={() => props.func.deleteAssignment(props.applicant, props.assignment.id)} />
        </td>
    </tr>;

const TempAssignmentRow = props =>
    <tr>
        <td>
            {props.course}
        </td>
        <td>
            <input
                type="number"
                style={{ width: '50px' }}
                min="0"
                onBlur={eventKey => {
                    if (eventKey.target.value != props.assignment.hours) {
                        props.func.setTempAssignmentHours(
                            props.assignment.positionId,
                            eventKey.target.value
                        );
                    }
                }}
                defaultValue={props.assignment.hours}
            />
        </td>
        <td>
            <Check click={() => props.func.permAssignment(props.assignment.positionId)} />
        </td>
        <td>
            <X click={() => props.func.removeTempAssignment(props.assignment.positionId)} />
        </td>
    </tr>;

const Check = props =>
    <i
        className="fa fa-check-circle-o"
        style={{ color: 'green', fontSize: '20px' }}
        onClick={props.click}
    />;

const X = props =>
    <i
        className="fa fa-times-circle-o"
        style={{ color: 'red', fontSize: '20px' }}
        onClick={props.click}
    />;

export { AssignmentForm };
