import React from 'react'

const CollapsablePanel = props =>(
  {props.assignment_panels.map(panel => (
    <Panel header={panel.label}/>
  ))}
);

class AssignmentForm extends React.Component {
  render() {
      return (
        <CollapsablePanel {...this.props}/>
      );
  }
}

export { AssignmentForm };
