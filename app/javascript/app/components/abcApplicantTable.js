import React from 'react'
import { Table } from 'react-bootstrap'

const THeader = props => (
	<thead><tr>
	<th key='header-assigned'></th>
	{props.fields.map((field, i) => <th key={'header-'+i}>{field}</th>)}
    </tr></thead>
);

const UnassignedApplicantRow = props => (
	<tr key={props.id+'-row'}>
	<td><input type='checkbox' defaultChecked={false}
    onClick={() => props.func.addAssignment(props.id.split('-')[1], props.course,
					    props.func.getCourseById(props.course).positionHours)}/></td>
	
    {props.fields.map(field => <td key={props.id+field}>{props.applicant[field]}</td>)}
    </tr>
);

const AssignedApplicantRow = props => (
	<tr key={props.id+'-row'}>
	<td><input type='checkbox' defaultChecked={true}
    onClick={() => props.func.removeAssignment(props.id.split('-')[1], props.course)}/></td>

    {props.fields.map(field => <td key={props.id+field}>{props.applicant[field]}</td>)}
    </tr>
);

class ABCApplicantTable extends React.Component {
    constructor(props) {
	super(props);

	this.filterApplicants();
    }

    // acquire list of applicants
    filterApplicants() {
	if (this.props.assigned)
	    this.applicants = this.props.func.getApplicantsAssignedToCourse(this.props.course);
	else
	    this.applicants = this.props.func.getApplicantsToCourseUnassigned(this.props.course);
    }

    componentWillUpdate() {
	this.filterApplicants();
    }
    
    render() {
	if (!this.applicants)
	    return null;

	return (
		<Table striped bordered condensed hover>
		<THeader fields={this.props.tableHeaders}/>
		<tbody>
		{this.applicants.map(
		    ([key, val]) => (
			this.props.assigned ?
			    <AssignedApplicantRow key={'applicant-'+key} id={'applicant-'+key} applicant={val}
			fields={this.props.tableFields} {...this.props}/> :
			    <UnassignedApplicantRow key={'applicant-'+key} id={'applicant-'+key} applicant={val}
			fields={this.props.tableFields} {...this.props}/>

		    ))}
	    </tbody>
	    </Table>
	);
    }
}

export { ABCApplicantTable };
