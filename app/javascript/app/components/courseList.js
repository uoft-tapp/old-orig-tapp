import React from 'react'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'

class CourseList extends React.Component {
  constructor(props){
    super(props);
  }

  setCourseList(){
    if(!this.props.func.anyFetching()){
      let courses = this.props.func.getCoursesList();
      return(
        Object.entries(courses).map((course, key) =>(
            <ListGroupItem key={key}
               href={"#"+course[0]}>
               {course[1].code}
            </ListGroupItem>
        ))
      );
    }
  }

  render(){
      return(
	      <Panel className='course-list-panel' header="Courses">
              <ListGroup className='course-list-group' fill>
              {this.setCourseList()}
          </ListGroup>
	      </Panel>
      );
  }
}

export { CourseList };
