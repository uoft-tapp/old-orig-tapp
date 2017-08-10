import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

const ApplicantTable = props =>
    <div className={'table-container ' + (props.assigned ? 'assigned-table' : 'unassigned-table')}>
        <AutoSizer>
            {({ height, width }) =>
                <DynamicRowHeightTable {...props} height={height} width={width} />}
        </AutoSizer>
    </div>;

class DynamicRowHeightTable extends React.Component {
    constructor(props) {
        super(props);

        this._cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 28,
        });
    }

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

    componentWillReceiveProps(nextProps) {
        if (nextProps.width !== this.props.width) {
            this._cache.clearAll();
        }
    }

    render() {
        return (
            <Table
                deferredMeasurementCache={this._cache}
                rowHeight={this._cache.rowHeight}
                rowCount={this.applicants.length}
                width={this.props.width}
                height={this.props.height}
                headerHeight={28}
                rowStyle={({ index }) =>
                    index == -1
                        ? {
                              border: '1px solid #ddd',
                              borderBottom: '2px solid #ddd',
                              paddingTop: '3px',
                          }
                        : {
                              border: '1px solid #ddd',
                              borderTop: '0',
                          }}
                rowGetter={({ index }) =>
                    this.props.config.map(field =>
                        field.data({
                            applicantId: this.applicants[index][0],
                            applicant: this.applicants[index][1],
                        })
                    )}>
                {this.props.config.map((field, i) =>
                    <Column
                        key={'col-' + i}
                        label={field.header}
                        dataKey={i}
                        width={field.width * this.props.width}
                        cellRenderer={({ cellData, dataKey, parent, rowIndex }) =>
                            <CellMeasurer
                                cache={this._cache}
                                columnIndex={i}
                                key={dataKey}
                                parent={parent}
                                rowIndex={rowIndex}>
                                <div
                                    style={{
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                    }}>
                                    {cellData}
                                </div>
                            </CellMeasurer>}
                    />
                )}
            </Table>
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

            // style applied to cells in table column
            style: PropTypes.func,
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

    // function that returns a unique id for each applicant row
    rowId: PropTypes.func,
};

export { ApplicantTable };
