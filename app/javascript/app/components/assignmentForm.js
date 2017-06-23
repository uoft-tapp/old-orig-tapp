import React from 'react'
import { Panel } from 'react-bootstrap'

const CollapsablePanel = props =>(
  <div className="container-fluid">
    {props.panels.map(panel => (
      <Panel style={{width: '98vw', float: 'left'}}
        header={panel.label}>
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
    console.log(JSON.stringify(this.props))
    return (
      <CollapsablePanel id={this.props.match.params.id} panels={this.props.assignment_form.panels}/>
    );
  }
}

export { AssignmentForm };
