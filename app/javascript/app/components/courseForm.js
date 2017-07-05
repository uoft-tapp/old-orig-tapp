import React from 'react'
import { Panel, ListGroup, ListGroupItem, Badge } from 'react-bootstrap'

class CourseForm extends React.Component {
  constructor(props){
    super(props);
  }

  setForms(){
    if(!this.props.func.anyFetching()){
      let courses = this.props.func.getCoursesList();
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
                    <InstructorForm list={"instructor_"+key}
                      course={course[0]}
                      input={course[1].instructor_input}
                      instructors={course[1].instructors}
                      state={this.props.func}
                      self={this}
                      {...this.props}/>
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

  isInstructor(eventKey, course, instructors){
    let input = eventKey.target.value;
    let span = document.getElementById("input_"+course);
    for(let i in instructor_data){
      if(instructor_data[i]==input){
        if(!this.alreadyAddedInstructor(i, instructors)){
          this.props.func.addInstructor(course, i);
        }
        else{
          alert("You've already added this instructor.");
        }
        input="";
        span.innerHTML="";
      }
    }
    this.props.func.updateInstructorInput(course, input);
  }

  alreadyAddedInstructor(id, instructors){
    for(let i in instructors){
      if(instructors[i] == id)
        return true;
    }
    return false;
  }

  updateInputField(eventKey, courseId){
    let input = eventKey.target.innerHTML;
    let hidden_input = document.getElementById("hidden_input_"+courseId);
    this.props.func.updateInstructorInput(courseId, input);
    hidden_input.focus();
  }

  render(){
    return(
      <Panel style={{width: 'calc(100% - 12em)', float: 'left',
        margin: '0', height: '88vh', overflow: 'auto'}}>
        <ListGroup fill>
        {this.setForms()}
        </ListGroup>
      </Panel>
    );
  }

}

const InstructorForm = props =>(
  <div className="instructor_form">
    <div>
      {props.instructors.map((instructor, key)=>(
        <Badge key={key}>
          {instructor_data[instructor]}
          <button onClick={()=>props.state.removeInstructor(props.course, key)}>
            <i className="fa fa-close"></i>
          </button>
        </Badge>
      ))}
      <span contentEditable='true' id={"input_"+props.course}
        onInput={(eventKey)=>props.self.updateInputField(eventKey, props.course)}></span>
    </div>
    <input type="text" list={props.list} value={props.input} autoComplete="on"
      id={"hidden_input_"+props.course}
      onInput={(eventKey)=>props.self.isInstructor(eventKey, props.course, props.instructors)}/>
    <datalist id={props.list}>
      {Object.entries(instructor_data).map((instructor, key)=>(
        <option key={key} value={instructor[1]}></option>
      ))}
    </datalist>
  </div>
);

const instructor_data = {
    1: "Gary Baumgartner",
    2: "Tom Fairgrieve",
    3: "Paul Gries",
    4: "Radford Neal",
    5: "Bogdan Simion",
    6: "Danny Heap",
    7: "Jacqueline Smith",
    8: "David Liu",
    9: "Toniann Pitassi",
    10: "Karen Reid",
    11: "Faith Ellen",
    12: "Sajad Shirali-Shahreza",
    13: "Steve Engels",
    14: "Francois Pitt",
    15: "Sam Toueg",
    16: "Sasa Milic",
    17: "Lindsey Shorser",
    18: "Joey Freund",
    19: "Mat Zeleski",
    20: "Amir Chinaei",
    21: "Velian Pandeliev",
    22: "Kyros Kutulakos",
    23: "Roger Grosse",
    24: "Christina Christara",
    25: "Diane Horton",
    26: "Peter Marbach",
    27: "Allan Jepson",
    28: "Sheila McIlraith",
    29: "Frank Rudzicz",
    30: "Michael Guerzhoy",
    31: "David Duvenaud",
    32: "David Levin",
    33: "Edy Garfinkiel",
    34: "David Holman",
    35: "Marina Barsky",
    36: "Ken Jackson",
    37: "Mario Grech",
    38: "Steve Cook",
    39: "Aleksandar Nikolov",
    40: "Steven Shapiro",
    41: "Helen Kontozopoulos",
    42: "Narges Norouzi",
};

export { CourseForm };
