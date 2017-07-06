import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'

const THeader = props => (
	<thead><tr>
	{props.config.map((field, i) => <th key={'header-'+i}>{field.header}</th>)}
    </tr></thead>
);

const ApplicantRow = props => (
	<tr key={'applicant-'+props.applicantId+'-row'}>
	{props.config.map((field, i) => <td key={'applicant-'+props.applicantId+'-row-'+i}>{field.data(props)}</td>)}
	 </tr>
);

class ApplicantTable extends React.Component {
    constructor(props) {
	super(props);
	
	this.filterApplicants();
    }

    // acquire and process list of applicants
    filterApplicants() {
	this.applicants = this.props.getApplicants();

	if (!this.props.assigned) {
	    let activeFilters = this.props.getActiveFilters();
	    let activeSortFields = this.props.getActiveSortFields();
	    
	    // apply additional filtering to unassigned applicants
	    for (var field in activeFilters) {
		this.applicants = this.applicants.filter(
		    applicant =>
			// disjointly apply filters within the same field
			activeFilters[field].reduce(
			    (acc, category) =>
				acc || this.props.config[field].filterFuncs[category](
				    {applicantId: applicant[0], applicant: applicant[1], course: this.props.course}
				), false)
		);
	    }

	    // apply additional sorting to unassigned applicants
	    this.applicants.sort((a, b) => this.sortApplicants(a, b, activeSortFields));
	}
    }

    // sort applicants by the list of criteria, in order
    sortApplicants(a, b, criteria) {
	if (criteria.length == 0) {
	    return 0;
	}

	let dir = criteria[0] > 0 ? 1 : -1;
	let field = criteria[0] * dir;

	let aData = this.props.config[field].sortData(
	    {applicantId: a[0], applicant: a[1], course: this.props.course});
	let bData = this.props.config[field].sortData(
	    {applicantId: b[0], applicant: b[1], course: this.props.course});

	if (aData < bData) {
	    return -dir;
	}

	if (aData > bData) {
	    return dir;
	}

	// if the applicant values for this field are equal, apply the next sort criterion
	return this.sortApplicants(a, b, criteria.slice(1));
    }

    componentWillUpdate() {
	this.filterApplicants();
    }
    
    render() {
	if (!this.applicants) {
	    return null;
	}

	return (
		<Table striped bordered condensed hover>
		<THeader config={this.props.config}/>
		<tbody>
		{this.applicants.map(([key, val]) => (
			<ApplicantRow key={'applicant-'+key} applicantId={key} applicant={val}
		    course={this.props.course} config={this.props.config} assigned={this.props.assigned}/>
		))}
	    </tbody>
	    </Table>
	);
    }
}

ApplicantTable.propTypes = {
    config: PropTypes.arrayOf(
	PropTypes.shape({
	    header: PropTypes.string.isRequired,
	    data: PropTypes.func.isRequired,
	    
	    sortData: PropTypes.func,
	    filterLabel: PropTypes.string,
	    filterCategories: PropTypes.arrayOf(PropTypes.string),
	    filterFuncs: PropTypes.arrayOf(PropTypes.func),
	})
    ).isRequired,

    getApplicants: PropTypes.func.isRequired,
    getActiveSortFields: PropTypes.func,
    getActiveFilters: PropTypes.func,

    course: PropTypes.number.isRequired,
};


export { ApplicantTable };
