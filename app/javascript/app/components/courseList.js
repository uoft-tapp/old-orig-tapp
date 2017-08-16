import React from 'react';
import { Panel, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';

class CourseList extends React.Component {
    // acquire and sort courses in order of course code
    sortCourses() {
        this.courses = Object.entries(this.props.getCoursesList());
        this.courses.sort(([A, valA], [B, valB]) => (valA.code < valB.code ? -1 : 1));
    }

    componentWillMount() {
        this.sortCourses();
    }

    componentWillUpdate() {
        this.sortCourses();
    }

    render() {
        return (
            <Panel className="course-list-panel" header="Courses">
                <ListGroup className="course-list-group" fill>
                    {this.courses.map(([key, course]) =>
                        <ListGroupItem key={key} href={'#' + key}>
                            {course.code}
                            <Badge className={'round-' + course.round}>
                                {course.round}
                            </Badge>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </Panel>
        );
    }
}

export { CourseList };
