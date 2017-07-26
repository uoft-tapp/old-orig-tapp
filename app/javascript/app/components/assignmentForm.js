import React from 'react';
import { Panel } from 'react-bootstrap';

const check = 'fa fa-check-circle-o';
const cross = 'fa fa-times-circle-o';

class AssignmentForm extends React.Component {
    setAssignments(applicant, assignments, temp_assignments, courses) {
        // no assignments or temporary assignments
        if ((!assignments || assignments.length == 0) &&
            (!temp_assignments || temp_assignments.length == 0)) {
            return (
                <tr>
                    <td><i>No Assignments</i></td>
                </tr>
            );
        }

        if (assignments !== undefined) {
            return assignments.map((assignment, index) =>
                <AssignmentRow
                    assignment={assignment}
                    key={index}
                    applicant={applicant}
                    courses={courses}
                    temp={false}
                    input_func={eventKey =>
                        this.props.func.updateAssignment(
                            applicant,
                            assignment.id,
                            eventKey.target.value
                        )}
                    self={this}
                    state={this.props.func}
                    {...this}
                />
            );
        }
    }

    setTempAssignments(id, assignments, temp_assignments, courses) {
        if (temp_assignments !== undefined) {
            return temp_assignments.map((assignment, index) =>
                <AssignmentRow
                    assignment={assignment}
                    key={index}
                    courses={courses}
                    temp={true}
                    self={this}
                    {...this}
                    input_func={eventKey =>
                        this.props.func.setTempAssignmentHours(
                            assignment.positionId,
                            eventKey.target.value
                        )}
                />
            );
        }
    }

    setAssignmentCheckButton(temp, applicant, course, self) {
        if (temp) {
            return (
                <AssignmentButton
                    click_func={() => this.props.func.permAssignment(course)}
                    id={applicant}
                    className={check}
                    color="green"
                    {...this}
                />
            );
        }
    }

    setAssignmentCrossButton(temp, applicant, assignment, self) {
        if (temp) {
            return (
                <AssignmentButton
                    click_func={() => this.props.func.removeTempAssignment(assignment.positionId)}
                    id={applicant}
                    className={cross}
                    color="red"
                    {...this}
                />
            );
        } else {
            return (
                <AssignmentButton
                    click_func={() => this.props.func.deleteAssignment(applicant, assignment.id)}
                    id={applicant}
                    className={cross}
                    color="red"
                    {...this}
                />
            );
        }
    }

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
        let assignmentForm = this.props.func.getAssignmentForm();
        let temp_assignments = this.props.func.getTempAssignments();
        let courses = this.props.func.getCoursesList();
        let application = this.props.func.getApplicationById(applicant);

        return (
            <div>
                <p>
                    <b>Application round: </b>
                    {application.round}
                </p>
                <table className="panel_table">
                    <tbody>
                        {this.setAssignments(applicant, assignments, temp_assignments, courses)}
                        {this.setTempAssignments(applicant, assignments, temp_assignments, courses)}
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
            {props.courses[props.assignment.positionId].code}
        </td>
        <td>
            <input
                type="number"
                style={{ width: '50px' }}
                min="0"
                onChange={props.input_func}
                value={props.assignment.hours}
            />
        </td>
        <td>
            {props.self.setAssignmentCheckButton(
                props.temp,
                props.applicant,
                props.assignment.positionId,
                props.self
            )}
        </td>
        <td>
            {props.self.setAssignmentCrossButton(
                props.temp,
                props.applicant,
                props.assignment,
                props.self
            )}
        </td>
    </tr>;

const AssignmentButton = props =>
    <button onClick={props.click_func} style={{ border: 'none', background: 'none' }}>
        <i className={props.className} style={{ color: props.color, fontSize: '20px' }} />
    </button>;

export { AssignmentForm };
