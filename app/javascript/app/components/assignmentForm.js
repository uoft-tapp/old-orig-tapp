import React from 'react'
import { Panel } from 'react-bootstrap'

const CollapsablePanel = props =>(
  <div className="container-fluid">
    {props.panels.map(panel => (
      <Panel style={{width: '98vw', float: 'left'}}
        collapsible expanded={panel.expanded}
        header={
          <div style={{width: '100%', height: '100%', margin: '0'}}
            onClick={()=>props.set_expanded(panel.index)}>
            {panel.label}
          </div>}>
        Test {props.id}
      </Panel>
    ))}
  </div>
);

class AssignmentForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <CollapsablePanel id={this.props.match.params.id}
        panels={this.props.assignment_form.panels}
        applicants={this.props.list}
        set_expanded={this.props.assignment_form.set_expanded}/>
    );
  }
}

export { AssignmentForm };
