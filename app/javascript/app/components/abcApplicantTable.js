import React from 'react'
import { Table } from 'react-bootstrap'

const THeader = props => (
	<thead><tr>
	{props.config.map((field, i) => <th key={'header-'+i}>{field.header}</th>)}
    </tr></thead>
);

const ApplicantRow = props => (
	<tr key={'applicant-'+props.id+'-row'}>
	{props.config.map((field, i) => <td key={'applicant-'+props.id+'-row-'+i}>{field.data(props)}</td>)}
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
		<THeader config={this.props.config}/>
		<tbody>
		{this.applicants.map(([key, val]) => (
			<ApplicantRow key={'applicant-'+key} applicantId={key} applicant={val} {...this.props}/>
		))}
	    </tbody>
	    </Table>
	);
    }
}

export { ABCApplicantTable };
