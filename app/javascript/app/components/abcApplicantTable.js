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

    // acquire and process list of applicants
    filterApplicants() {
	// filter applicants by assignment status
	if (this.props.assigned) {
	    this.applicants = this.props.func.getApplicantsAssignedToCourse(this.props.course);

	} else {
	    this.applicants = this.props.func.getApplicantsToCourseUnassigned(this.props.course);

	    // apply additional filtering and sorting to unassigned applicants
	    let panelFields = this.props.func.getCoursePanelFieldsByCourse(this.props.course);

	    this.applicants.sort((a, b) => this.sortApplicants(a, b, panelFields.activeSortFields));
	}
    }

    // sort applicants by the list of criteria, in order
    sortApplicants(a, b, criteria) {
	if (criteria.length == 0)
	    return 0;

	let dir = criteria[0] > 0 ? 1 : -1;
	let field = criteria[0] * dir;

	let aData = this.props.config[field].sortData(
	    {applicantId: a[0], applicant: a[1], course: this.props.course});
	let bData = this.props.config[field].sortData(
	    {applicantId: b[0], applicant: b[1], course: this.props.course});

	if (aData < bData)
	    return -dir;

	if (aData > bData)
	    return dir;

	// if the applicant values for this field are equal, apply the next sort criterion
	return this.sortApplicants(a, b, criteria.slice(1));
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
