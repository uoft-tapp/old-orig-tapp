import React from 'react'
import { AssignmentForm } from './assignmentForm.js'
import { Panel } from 'react-bootstrap'

class Applicant extends React.Component {

    constructor(props){
      super(props);
    }

    selectThisTab() {
	this.props.func.selectNavTab(this.props.navKey, this.props.match.params.id);
    }

    componentDidMount() {
	     this.selectThisTab();
    }

    componentDidUpdate() {
	     this.selectThisTab();
    }
    setAddress(address){
      let parts = address.split("\r\n");
      return(
        parts.map(part=>(
          <p>{part}</p>
        ))
      )
    }

    setPrefs(pref, courses){
      let j = 0, columns=[],size = 4;
      for (let i = 0; i < Math.ceil(pref.length / size); i++) {
        columns[i] = pref.slice(j, j + size);
        j = j + size;
      }
      return (
        columns.map(column=>(
          <td>
            {column.map(item =>(
              <p>
                {courses[item.positionId].code}
                {item.preferred?<i className="fa fa-star-o" style={{color:'orange'}}></i>:''}
              </p>
            ))}
          </td>
        ))
      );
    }

    addPanelContent(index){
      if(!this.props.func.isFetching()){
        let id = this.props.match.params.id;
        let applicant = this.props.applicants.list[id];
        let application = this.props.applications.list[id][0];
        let courses = this.props.courses.list;
        switch(index){
          case 0:
            return (
              <table className="panel_table">
                <td>
                  <p><b>Last Name: </b>{applicant.lastName}</p>
                  <p><b>UTORIid: </b>{applicant.utorid}</p>
                  <p><b>Email address: </b>{applicant.email}</p>
                  <p><b>Phone Number: </b>{applicant.phone}</p>
                </td>
                <td>
                  <p><b>First Name: </b>{applicant.firstName}</p>
                  <p><b>Student ID: </b>{applicant.studentNumber}</p>
                </td>
                <td>
                  <p><b>Address: </b></p>
                </td>
                <td>
                  {this.setAddress(applicant.address)}
                </td>
              </table>
            );
          case 1:
            return (
              <table className="panel_table">
                <td>
                  <b>Enrolled as a U of T graduate student for the TA session? </b>
                  {application.academicAccess?"Yes":"No"}
                </td>
                <td>
                  <b>Completed a U of T TA training session? </b>
                  {application.taTraining?"Yes":"No"}
                </td>
              </table>
            );
          case 2:
            return (
              <table className="panel_table">
                <td><b>Department: </b>{applicant.dept}</td>
                <td><b>Program: </b>{applicant.program}</td>
                <td><b>Year: </b>{applicant.year}</td>
              </table>
            );
          case 3:
            return(
              <AssignmentForm {...this.props} />
            );
          case 4:
            return(
              <table className="panel_table">
                {this.setPrefs(application.prefs, courses)}
              </table>
            );
          case 5:
            return(<p>{application.exp}</p>);
          case 6:
            return(<p>{application.qual}</p>);
          case 7:
            return(<p>{application.skills}</p>);
          case 8:
            return(<p>{application.avail}</p>);
          case 9:
            return(<p>{application.other}</p>);
          case 10:
            return(<p>{application.special_needs}</p>);
          }
        }
    }
    render() {
      let panels = ["Personal Information", "Current Status",
        "Current Program Information", "Current Assignment Status",
        "Course Preferences", "Teaching Experiences", "Academic Qualifications",
        "Technical Skills", "Availability", "Other Information",
        "Special Need Issues"];
      this.props.func.createAssignmentForm(panels);
  	  return (
        <CollapsablePanel
          assignment_form={this.props.assignment_form}
          state={this.props}
          self={this}/>
      );
    }
}


const CollapsablePanel = props =>(
  <div className="container-fluid"
    style={{height: '90vh', width: '100vw', overflow: 'auto'}}>
    {props.assignment_form.panels.map((panel, index) => (
      <Panel style={{width: '98vw', float: 'left', margin: '0'}}
        collapsible expanded={panel.expanded}
        header={
          <div style={{width: '100%', height: '100%', margin: '0', cursor: "pointer"}}
            onClick={()=>(props.state.func.setExpanded(index))}>
            {panel.label}
          </div>}>
        {props.self.addPanelContent(index)}
      </Panel>
    ))}
  </div>
);


export { Applicant };
