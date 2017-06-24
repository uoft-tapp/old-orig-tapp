import React from 'react'
import { Panel } from 'react-bootstrap'


const CollapsablePanel = props =>(
  <div className="container-fluid">
    {props.panels.map(panel => (
      <Panel style={{width: '98vw', float: 'left'}}
        collapsible expanded={panel.expanded}
        header={
          <div style={{width: '100%', height: '100%', margin: '0', cursor: "pointer"}}
            onClick={()=>props.set_expanded(panel.index)}>
            {panel.label}
          </div>}>
        Test {props.id}
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
          <p>{JSON.stringify(data)}</p>
        );
      case 1:
        return (
          <p>hello 1</p>
        );
      case 2:
        return (
          <p>hello 2</p>
        );
      default:
        return (
          <p>hello</p>
        );
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
