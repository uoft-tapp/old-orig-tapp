import React from 'react'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'

class CourseForm extends React.Component {
  constructor(props){
    super(props);
  }

  setForms(){
    if(!this.props.func.isFetching()){
      let courses = this.props.courses.list;
      return(
        Object.entries(courses).map((course, key) =>(
          <ListGroupItem key={key}>
            <a name={course[0]}></a>
            <table className="form_table">
              <tbody>
                <tr>
                  <td>
                    <p><input type="text" value={course[1].code} className="course" readOnly disabled/></p>
                    <p><input type="text" value={course[1].name} readOnly disabled/></p>
                    <p><input type="text" value={course[1].campus} readOnly disabled/></p>
                  </td>
                  <td>
                    <p><b>Positions: </b></p>
                    <p><b>Hours/Position: </b></p>
                    <p><b>Estimated Enrollment: </b></p>
                  </td>
                  <td>
                    <p>
                      <input type="number" value={course[1].estimatedPositions} min="0"
                        onChange={(eventKey)=>this.props.func.updateCoursePosition(course[0], eventKey)}/>
                    </p>
                    <p>
                      <input type="number" value={course[1].positionHours} min="0"
                        onChange={(eventKey)=>this.props.func.updateCourseHours(course[0], eventKey)}/>
                    </p>
                    <p>
                      <input type="number" value={course[1].estimatedEnrol?course[1].estimatedEnrol:0} min="0"
                        onChange={(eventKey)=>this.props.func.updateCourseEnrol(course[0], eventKey)}/>
                    </p>
                  </td>
                  <td>
                  <p><b>Instructors: </b></p>
                    <textarea value={JSON.stringify(course[1].instructors)} readOnly></textarea>
                  </td>
                  <td>
                    <p><b>Qualifications: </b></p>
                    <textarea
                      onChange={(eventKey)=>this.props.func.updateCourseQual(course[0], eventKey)}
                      value={course[1].qual}></textarea>
                  </td>
                  <td>
                    <p><b>Responsibilities: </b></p>
                    <textarea
                      onChange={(eventKey)=>this.props.func.updateCourseResp(course[0], eventKey)}
                      value={course[1].resp}></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </ListGroupItem>
        ))
      );
    }
  }

  render(){
    return(
      <Panel style={{width: 'calc(100% - 12em)', float: 'left', margin: '0', height: '88vh', overflow: 'auto'}}>
        <ListGroup fill>
        {this.setForms()}
        </ListGroup>
      </Panel>
    );
  }

}

export { CourseForm };
