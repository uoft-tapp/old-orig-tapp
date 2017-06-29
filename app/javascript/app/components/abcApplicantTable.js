import React from 'react'
import { Table } from 'react-bootstrap'

const THeader = props => (
	<thead><tr>
	<th></th>
	{props.fields.map((field, i) => <th key={'header-'+i}>{field}</th>)}
    </tr></thead>
);

const UnassignedApplicantRow = props => (
	<tr key={'applicant-'+props.id+'-row'}>
	<td><input type='checkbox' defaultChecked={false}
    onClick={() => props.func.addAssignment(props.id, props.course,
					    props.func.getCourseById(props.course).positionHours)}/></td>
	
    {props.fields.map(field => <td key={'applicant-'+props.id+field}>{props.applicant[field]}</td>)}

	<td key='applicant-pref'>
	{props.func.getApplicationPreference(props.id, props.course) && <i className='fa fa-check'/>}
    </td>

    <td key='applicant-other'>
	{props.func.getAssignmentsByApplicant(props.id).map(
	    ass => (ass.positionId == props.course) ? '' : props.func.getCourseCodeById(ass.positionId)
	).join(' ')}
    </td>    
    </tr>
);

const AssignedApplicantRow = props => (
	<tr key={'applicant-'+props.id+'-row'}>
	<td><input type='checkbox' defaultChecked={true}
    onClick={() => props.func.removeAssignment(props.id, props.course)}/></td>

    {props.fields.map(field => <td key={'applicant-'+props.id+field}>{props.applicant[field]}</td>)}

    	<td key='applicant-pref'>
	{props.func.getApplicationPreference(props.id, props.course) && <i className='fa fa-check'/>}
    </td>

    <td key='applicant-other'>
	{props.func.getAssignmentsByApplicant(props.id).map(
	    ass => (ass.positionId == props.course) ? '' : props.func.getCourseCodeById(ass.positionId)
	).join(' ')}
    </td>
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

//	this.props.func.applyApplicantFilters(
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
			    <AssignedApplicantRow key={'applicant-'+key} id={key} applicant={val}
			fields={this.props.tableFields} {...this.props}/> :
			    <UnassignedApplicantRow key={'applicant-'+key} id={key} applicant={val}
			fields={this.props.tableFields} {...this.props}/>

		    ))}
	    </tbody>
	    </Table>
	);
    }
}

export { ABCApplicantTable };
