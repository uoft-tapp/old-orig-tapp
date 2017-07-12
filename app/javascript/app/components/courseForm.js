import React from 'react';
import { Panel, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';

class CourseForm extends React.Component {
    constructor(props) {
        super(props);
    }

    setForms() {
        if (!this.props.func.anyFetching()) {
            let courses = this.props.func.getCoursesList();
            let instructors = this.props.func.getInstructorsList();
            return Object.entries(courses).map((course, key) =>
                <ListGroupItem key={key}>
                    <a name={course[0]} />
                    <table className="form_table">
                        <tbody>
                            <tr>
                                <td>
                                    <p>
                                        <input
                                            type="text"
                                            value={course[1].code}
                                            className="course"
                                            readOnly
                                            disabled
                                        />
                                    </p>
                                    <p>
                                        <input
                                            type="text"
                                            value={course[1].name}
                                            readOnly
                                            disabled
                                        />
                                    </p>
                                    <p>
                                        <input
                                            type="text"
                                            value={course[1].campus}
                                            readOnly
                                            disabled
                                        />
                                    </p>
                                </td>
                                <td>
                                    <p>
                                        <b>Positions: </b>
                                    </p>
                                    <p>
                                        <b>Hours/Position: </b>
                                    </p>
                                    <p>
                                        <b>Estimated Enrollment: </b>
                                    </p>
                                </td>
                                <td>
                                    <p>
                                        <input
                                            type="number"
                                            value={course[1].estimatedPositions
                                                  ? course[1].estimatedPositions
                                                  : 0
                                            }
                                            min="0"
                                            onChange={event =>
                                                this.props.func.updateCourse(
                                                    course[0],
                                                    event.target.value,
                                                    "estimatedPositions"
                                                )}
                                        />
                                    </p>
                                    <p>
                                        <input
                                            type="number"
                                            value={course[1].positionHours
                                                  ? course[1].positionHours
                                                  : 0
                                            }
                                            min="0"
                                            onChange={event =>
                                                this.props.func.updateCourse(
                                                    course[0],
                                                    event.target.value,
                                                    'positionHours'
                                                )}
                                        />
                                    </p>
                                    <p>
                                        <input
                                            type="number"
                                            value={
                                                course[1].estimatedEnrol
                                                    ? course[1].estimatedEnrol
                                                    : 0
                                            }
                                            min="0"
                                            onChange={event =>
                                                this.props.func.updateCourse(
                                                    course[0],
                                                    event.target.value,
                                                    "estimatedEnrol"
                                                )}
                                        />
                                    </p>
                                </td>
                                <td>
                                    <p>
                                        <b>Instructors: </b>
                                    </p>
                                    <InstructorForm
                                        list={'instructor_' + key}
                                        course={course[0]}
                                        input={course[1].instructor_input}
                                        instructors={course[1].instructors}
                                        instructor_data={instructors}
                                        state={this.props.func}
                                        self={this}
                                        {...this.props}
                                    />
                                </td>
                                <td>
                                    <p>
                                        <b>Qualifications: </b>
                                    </p>
                                    <textarea
                                        onChange={event =>
                                            this.props.func.updateCourse(
                                              course[0],
                                              event.target.value,
                                              "qual"
                                            )}
                                        value={course[1].qual}
                                    />
                                </td>
                                <td>
                                    <p>
                                        <b>Responsibilities: </b>
                                    </p>
                                    <textarea
                                        onChange={event =>
                                            this.props.func.updateCourse(
                                              course[0],
                                              event.target.value,
                                              "resp"
                                            )}
                                        value={course[1].resp}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ListGroupItem>
            );
        }
    }

    isInstructor(input, course, instructors, instructor_data) {
        let span = document.getElementById('input_' + course);
        for (let i in instructor_data) {
            if (instructor_data[i] == input) {
                if (!this.alreadyAddedInstructor(i, instructors)) {
                    this.props.func.addInstructor(course, i);
                } else {
                    alert("You've already added this instructor.");
                }
                input = '';
                span.innerHTML = '';
            }
        }
        this.props.func.updateInstructorInput(course, input);
    }

    alreadyAddedInstructor(id, instructors) {
        for (let i in instructors) {
            if (instructors[i] == id) {
                return true;
            }
        }
        return false;
    }

    updateInputField(courseId) {
        let visible_input = document.getElementById('input_' + courseId);
        let hidden_input = document.getElementById('hidden_input_' + courseId);
        this.props.func.updateInstructorInput(courseId, visible_input.innerHTML);
        hidden_input.focus();
    }

    render() {
        return (
            <Panel
                style={{
                    width: 'calc(100% - 12em)',
                    float: 'left',
                    margin: '0',
                    height: '88vh',
                    overflow: 'auto',
                }}>
                <ListGroup fill>
                    {this.setForms()}
                </ListGroup>
            </Panel>
        );
    }
}

const InstructorForm = props =>
    <div className="instructor_form">
        <div>
            {props.instructors.map((instructor, key) =>
                <Badge key={key}>
                    {props.instructor_data[instructor]}
                    <button onClick={() => props.state.removeInstructor(props.course, key)}>
                        <i className="fa fa-close" />
                    </button>
                </Badge>
            )}
            <span
                contentEditable="true"
                id={'input_' + props.course}
                onInput={() => props.self.updateInputField(props.course)}
            />
        </div>
        <input
            type="text"
            list={props.list}
            value={props.input}
            autoComplete="on"
            id={'hidden_input_' + props.course}
            onInput={event =>
                props.self.isInstructor(
                    event.target.value,
                    props.course,
                    props.instructors,
                    props.instructor_data
                )}
        />
        <datalist id={props.list}>
            {Object.entries(props.instructor_data).map((instructor, key) =>
                <option key={key} value={instructor[1]} />
            )}
        </datalist>
    </div>;

export { CourseForm };
