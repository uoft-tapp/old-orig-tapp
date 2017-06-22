import React from 'react'
import { Table } from 'react-bootstrap'

const THeader = props => (
	<thead><tr>
	{props.fields.map((field, i) => <th key={"header"+i}>{field}</th>)}
    </tr></thead>
);

const ApplicantRow = props => (
	<tr key={props.id}>
	{props.fields.map(field => (
		<td key={props.id+field}>
		{field == 'assigned' ? <input type="checkbox" defaultChecked={props.assigned}/> : props.applicant[field]}
	    </td>
	))}
	</tr>
);

class AssignedApplicantTable extends React.Component {
    render() {
	      return (
		<Table striped bordered condensed hover>
		<THeader fields={this.props.tableHeaders}/>
		<tbody>
		{this.props.applicants.map((applicant, i) => (
			<ApplicantRow key={"applicant"+i} applicant={applicant} id={i} assigned={this.props.assigned}
		    fields={this.props.tableFields}/>
		))}
	    </tbody>
	    </Table>
	);
    }
}

export { AssignedApplicantTable };
