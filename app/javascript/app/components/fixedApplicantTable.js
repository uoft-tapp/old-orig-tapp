import React from 'react';
import PropTypes from 'prop-types';
import { Table, Column, Cell } from 'fixed-data-table';
import { AutoSizer } from 'react-virtualized';

class ApplicantTable extends React.Component {
    // acquire and process list of applicants
    filterApplicants() {
        this.applicants = this.props.getApplicants();

        if (!this.props.assigned) {
            let selectedFilters = this.props.getSelectedFilters();
            let selectedSortFields = this.props.getSelectedSortFields();

            // apply additional filtering to unassigned applicants
            for (var field in selectedFilters) {
                this.applicants = this.applicants.filter(applicant =>
                    // disjointly apply filters within the same field
                    selectedFilters[field].reduce(
                        (acc, category) =>
                            acc ||
                            this.props.config[field].filterFuncs[category](
                                Object.assign(
                                    { applicantId: applicant[0], applicant: applicant[1] },
                                    this.props
                                )
                            ),
                        false
                    )
                );
            }

            // apply additional sorting to unassigned applicants
            this.applicants.sort((a, b) => this.sortApplicants(a, b, selectedSortFields));
        }
    }

    // sort applicants by the list of criteria, in order
    // in accordance with Array.sort, returns -1 if a sorts first, 1 if b sorts first, or 0 otherwise
    sortApplicants(a, b, criteria) {
        if (criteria.length == 0) {
            return 0;
        }

        let [field, dir] = criteria[0];

        let aData = this.props.config[field].sortData(
            Object.assign({ applicantId: a[0], applicant: a[1] }, this.props)
        );
        let bData = this.props.config[field].sortData(
            Object.assign({ applicantId: b[0], applicant: b[1] }, this.props)
        );

        if (aData < bData) {
            return -dir;
        }

        if (aData > bData) {
            return dir;
        }

        // if the applicant values for this field are equal, apply the next sort criterion
        return this.sortApplicants(a, b, criteria.slice(1));
    }

    componentWillMount() {
        this.filterApplicants();
    }

    componentWillUpdate() {
        this.filterApplicants();
    }

    render() {
        return (
            <div
                className={
                    'table-container ' +
                    (this.props.assigned ? 'assigned-table' : 'unassigned-table')
                }>
                <AutoSizer>
                    {({ height, width }) =>
                        <Table
                            rowHeight={28}
                            rowsCount={this.applicants.length}
                            width={width}
                            maxHeight={height}
                            headerHeight={28}>
                            {this.props.config.map((field, i) =>
                                <Column
                                    key={'col-' + i}
                                    header={field.header}
                                    cell={({ rowIndex }) =>
                                        <Cell>
                                            {field.data({
                                                applicantId: this.applicants[rowIndex][0],
                                                applicant: this.applicants[rowIndex][1],
                                            })}
                                        </Cell>}
                                    width={field.width * width}
                                />
                            )}
                        </Table>}
                </AutoSizer>
            </div>
        );
    }
}

ApplicantTable.propTypes = {
    config: PropTypes.arrayOf(
        PropTypes.shape({
            // label for table column, used in table header
            header: PropTypes.string.isRequired,
            // function that produces the data needed for this column, for each row
            data: PropTypes.func.isRequired,

            // function that produces the data by which rows in this column will be sorted
            // eg. sortData might produce a string, for native (lexicographic) string sorting
            sortData: PropTypes.func,

            // label for filter corresponding to this column
            filterLabel: PropTypes.string,
            // categories for filtering on this column
            // eg. for the column containing the applicant's program, categories might include: PostDoc, PhD, etc.
            filterCategories: PropTypes.arrayOf(PropTypes.string),
            // functions corresponding to the filter categories for this column; a function should return false
            // on a row that should *not* be displayed when filtering by its corresponding category
            filterFuncs: PropTypes.arrayOf(PropTypes.func),

            // width of cells in table column
            width: PropTypes.number.isRequired,
        })
    ).isRequired,

    // function that returns the applicants for this table
    getApplicants: PropTypes.func.isRequired,
    // function that returns the currently selected sort fields for this table
    getSelectedSortFields: PropTypes.func,
    // function that returns the currently selected filter fields+categories for this table
    getSelectedFilters: PropTypes.func,

    // course id of the course to which these applicants have applied (for the ABC view)
    course: PropTypes.string,
    // whether the applicants in this table have been assigned to this course (for the ABC view)
    assigned: PropTypes.bool,
};

export { ApplicantTable };
