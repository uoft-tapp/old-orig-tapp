import React from 'react'
import { Panel } from 'react-bootstrap'


const CollapsablePanel = props =>(
  <div className="container-fluid"
    style={{height: '88vh', width: '100vw', overflow: 'auto'}}>
    {props.panels.map(panel => (
      <Panel style={{width: '98vw', float: 'left', margin: '0'}}
        collapsible expanded={panel.expanded}
        header={
          <div style={{width: '100%', height: '100%', margin: '0', cursor: "pointer"}}
            onClick={()=>props.set_expanded(panel.index)}>
            {panel.label}
          </div>}>
        {props.content(props.applicant, panel.index)}
      </Panel>
    ))}
  </div>
);

class AssignmentForm extends React.Component {
  getApplicant(applicants, id){
    let applicant = {};
    for(let i=0; i < applicants.length; i++){
      if(applicants[i]["id"]==id){
        applicant = applicants[i];
      }
    }
    return applicant;
  }
  addPanelContent(data, index){
    switch(index){
      case 0:
        return (
          <table className="panel_table">
            <td>
              <p><b>Last Name: </b>{data.last_name}</p>
              <p><b>UTORIid: </b>{data.utorid}</p>
              <p><b>Email address: </b>{data.email}</p>
              <p><b>Phone Number: </b>{data.phone}</p>
            </td>
            <td>
              <p><b>First Name: </b>{data.first_name}</p>
              <p><b>Student ID: </b>{data.student_number}</p>
            </td>
            <td>
              <p><b>Address: </b>{data.address}</p>
            </td>
          </table>
        );
      case 1:
        return (
          <table className="panel_table">
            <td><b>Enrolled as a U of T graduate student for the TA session? </b>(Yes/No)</td>
            <td><b>Completed a U of T TA training session? </b>(Yes/No)</td>
          </table>
        );
      case 2:
        return (
          <table className="panel_table">
            <td><b>Department: </b>DCS</td>
            <td><b>Program: </b>MSc</td>
            <td><b>Year: </b>3</td>
          </table>
        );
      case 3:
        return(
          <div>
            <p><b>Application round: </b>110</p>
            <table className="panel_table">
            <tr>
              <td>Course</td>
              <td><input type="number" style={{width: '50px'}}/></td>
              <td><i className="fa fa-check-circle-o" style={{color: 'green', fontSize: '20px'}}></i></td>
              <td><i className="fa fa-times-circle-o" style={{color: 'red', fontSize: '20px'}}></i></td>
            </tr>
            <tr>
              <td>Course</td>
              <td><input type="number" style={{width: '50px'}}/></td>
              <td><i className="fa fa-check-circle-o" style={{color: 'green', fontSize: '20px'}}></i></td>
              <td><i className="fa fa-times-circle-o" style={{color: 'red', fontSize: '20px'}}></i></td>
            </tr>
            <tr>
              <td>Course</td>
              <td><input type="number" style={{width: '50px'}}/></td>
              <td><i className="fa fa-check-circle-o" style={{color: 'green', fontSize: '20px'}}></i></td>
              <td><i className="fa fa-times-circle-o" style={{color: 'red', fontSize: '20px'}}></i></td>
            </tr>
            </table>
            <p style={{marginTop: '10px'}}><b>Add assignment: </b><input type="text"/></p>
          </div>
        );
      case 4:
        return(
          <table className="panel_table">
            <td>
              <p>CSC108H1</p>
              <p>CSC165H1</p>
              <p>CSC148H1</p>
              <p>CSC209H1</p>
            </td>
            <td>
              <p><i className="fa fa-star-o"></i></p>
              <p></p>
              <p><i className="fa fa-star-o"></i></p>
              <p></p>
            </td>
            <td>
              <p>CSC108H1-A</p>
              <p>CSC165H1</p>
              <p></p>
              <p></p>
            </td>
          </table>
        );
      case 5:
        return(<p>Teaching Experience</p>);
      case 6:
        return(<p>Qualifications</p>);
      case 7:
        return(<p>Qualifications</p>);
      case 8:
        return(<p>Technical Skills</p>);
      case 9:
        return(<p>Availability</p>);
      case 10:
        return(<p>Special Need Issues</p>);
    }
  }
  render() {
    return (
      <CollapsablePanel id={this.props.match.params.id}
        panels={this.props.assignment_form.panels}
        applicant={this.getApplicant(this.props.applicants.list, this.props.match.params.id)}
        set_expanded={this.props.assignment_form.set_expanded}
        content={this.addPanelContent}/>
    );
  }
}

export { AssignmentForm };
