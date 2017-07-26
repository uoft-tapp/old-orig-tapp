import React from 'react';

class AssignmentForm extends React.Component {
    render() {
        let applicant = this.props.applicantId;
        let assignments = this.props.func.getAssignmentsByApplicant(applicant);
        let tempAssignments = this.props.func.getTempAssignments();
        let assignmentForm = this.props.func.getAssignmentForm();
        let courses = this.props.func.getCoursesList();

        return (
            <div>
                <table className="panel_table">
                    <tbody>
                        {(!assignments || assignments.length == 0) &&
                            (!tempAssignments || tempAssignments.length == 0) &&
                            <tr>
                                <td>
                                    <i>No Assignments</i>
                                </td>
                            </tr>}

                        {tempAssignments &&
                            tempAssignments.map((assignment, index) =>
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

                        <tr>
                            <td
                                style={{
                                    paddingRight: '25px',
                                    paddingTop: '10px',
                                    verticalAlign: 'middle',
                                }}>
                                <b>Add assignment:&nbsp;</b>
                            </td>
                            <td style={{ paddingTop: '10px' }}>
                                <AssignmentInput
                                    courses={courses}
                                    assignments={assignments}
                                    tempAssignments={tempAssignments}
                                    {...this.props}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const AssignmentRow = props =>
    <tr>
        <td style={{ verticalAlign: 'middle' }}>
            {props.course}
        </td>
        <td>
            <form
                onSubmit={event => {
                    let value = event.target.elements[0].value;
                    if (value != props.assignment.hours) {
                        props.func.updateAssignment(props.applicant, props.assignment.id, value);
                    }
                    event.preventDefault();
                }}>
                <input
                    type="number"
                    style={{ width: '50px' }}
                    min="0"
                    onBlur={event => {
                        if (event.target.value != props.assignment.hours) {
                            props.func.updateAssignment(
                                props.applicant,
                                props.assignment.id,
                                event.target.value
                            );
                        }
                    }}
                    defaultValue={props.assignment.hours}
                />
                &emsp;
                <X
                    click={() => props.func.deleteAssignment(props.applicant, props.assignment.id)}
                />
            </form>
        </td>
    </tr>;

const TempAssignmentRow = props =>
    <tr>
        <td style={{ verticalAlign: 'middle' }}>
            {props.course}
        </td>
        <td>
            <form
                onSubmit={event => {
                    let value = event.target.elements[0].value;
                    if (value != props.assignment.hours) {
                        props.func.setTempAssignmentHours(props.assignment.positionId, value);
                    }
                    event.preventDefault();
                }}>
                <input
                    type="number"
                    style={{ width: '50px' }}
                    min="0"
                    onBlur={event => {
                        if (event.target.value != props.assignment.hours) {
                            props.func.setTempAssignmentHours(
                                props.assignment.positionId,
                                event.target.value
                            );
                        }
                    }}
                    defaultValue={props.assignment.hours}
                />
                &emsp;
                <X click={() => props.func.removeTempAssignment(props.assignment.positionId)} />
                &emsp;
                <Check click={() => props.func.permAssignment(props.assignment.positionId)} />
            </form>
        </td>
    </tr>;

// green check icon/button
const Check = props =>
    <i
        className="fa fa-check-circle-o"
        style={{ color: 'green', fontSize: '20px', verticalAlign: 'middle' }}
        onClick={props.click}
    />;

// red x icon/button
const X = props =>
    <i
        className="fa fa-times-circle-o"
        style={{ color: 'red', fontSize: '20px', verticalAlign: 'middle' }}
        onClick={props.click}
    />;

class AssignmentInput extends React.Component {
    // check that the user input matches an existing course
    detectCourse(input, courses) {
        for (var course in courses) {
            if (courses[course].code == input) {
                return course;
            }
        }
        return false;
    }

    // check whether an assignment or temporary assignment to this course already exists
    existingAssignment(positionId, assignments, tempAssignments) {
        for (var assignment in assignments) {
            if (assignments[assignment].positionId == positionId) {
                return true;
            }
        }
        for (var assignment in tempAssignments) {
            if (tempAssignments[assignment].positionId == positionId) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <form
                onSubmit={event => {
                    let input = event.target.elements[0];
                    let course = this.detectCourse(input.value, this.props.courses);

                    if (course) {
                        if (
                            this.existingAssignment(
                                course,
                                this.props.assignments,
                                this.props.tempAssignments
                            )
                        ) {
                            this.props.func.alert(
                                'Assignment to ' + input.value + ' already exists.'
                            );
                        } else {
                            this.props.func.addTempAssignment(
                                course,
                                this.props.courses[course].positionHours
                            );
                        }

                        input.value = '';
                    } else {
                        this.props.func.alert('Course code ' + input.value + ' does not exist.');
                    }

                    event.preventDefault();
                }}>
                <input list="courses" />
                <datalist id="courses">
                    {Object.entries(this.props.courses).map(([key, value]) =>
                        <option value={value.code} key={key} />
                    )}
                </datalist>
            </form>
        );
    }
}

export { AssignmentForm };
