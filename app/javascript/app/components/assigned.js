import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';
import { routeConfig } from '../routeConfig.js';

class Assigned extends React.Component {
    render() {
        let nullCheck = this.props.func.anyNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.func.anyFetching();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        // table/menu configuration
        this.config = [
            {
                header: 'Last Name',
                data: p =>
                    <span
                        className="highlightOnHover"
                        onClick={() => this.props.func.selectApplicant(p.applicantId)}>
                        {p.applicant.lastName}
                    </span>,
                sortData: p => p.applicant.lastName,

                style: () => ({ width: '10%' }),
            },
            {
                header: 'First Name',
                data: p => p.applicant.firstName,
                sortData: p => p.applicant.firstName,

                style: () => ({ width: '10%' }),
            },
            {
                header: 'Dept.',
                data: p => p.applicant.dept,
                sortData: p => p.applicant.dept,

                filterLabel: 'Dept.',
                filterCategories: ['DCS', 'Other'],
                filterFuncs: [
                    p => p.applicant.dept == 'Computer Science',
                    p => p.applicant.dept != 'Computer Science',
                ],

                style: () => ({ width: '13%' }),
            },
            {
                header: 'Prog.',
                data: p => p.applicant.program,
                sortData: p => p.applicant.program,

                filterLabel: 'Prog.',
                filterCategories: ['PostDoc', 'PhD', 'Masters', 'UG'],
                filterFuncs: [
                    p => p.applicant.program == 'PostDoc',
                    p => p.applicant.program == 'PhD',
                    p => ['MSc', 'MASc', 'MScAC', 'MEng', 'OG'].includes(p.applicant.program),
                    p => p.applicant.program == 'UG',
                ],

                style: () => ({ width: '5%' }),
            },
            {
                header: 'Year',
                data: p => p.applicant.year,
                sortData: p => p.applicant.year,

                style: () => ({ width: '2%' }),
            },
            {
                header: 'Email',
                data: p => p.applicant.email,
                sortData: p => p.applicant.email,

                style: () => ({ width: '20%' }),
            },
            {
                header: 'Course(s)',
                data: p =>
                    <ButtonToolbar>
                        {this.props.func.getAssignmentsByApplicant(p.applicantId).map(ass =>
                            <Link
                                to={
                                    routeConfig.abc.route +
                                    '#' +
                                    ass.positionId +
                                    '-' +
                                    p.applicantId +
                                    '-1'
                                }
                                key={'link-' + p.applicantId + '-' + ass.positionId}>
                                <Button
                                    bsSize="xsmall"
                                    style={{ borderColor: '#555' }}
                                    onClick={() =>
                                        this.props.func.setSelectedCourses([ass.positionId])}>
                                    {this.props.func.getCourseCodeById(
                                        ass.positionId
                                    )}&nbsp;&middot;&nbsp;{ass.hours}
                                </Button>
                            </Link>
                        )}
                    </ButtonToolbar>,

                filterLabel: 'Course',
                filterCategories: this.props.func.getCourseCodes(),
                // for each course, filter out applicants who are not assigned to that course
                filterFuncs: Object.keys(this.props.func.getCoursesList()).map(key => p =>
                    this.props.func
                        .getAssignmentsByApplicant(p.applicantId)
                        .some(pref => pref.positionId == key)
                ),
            },
        ];

        return (
            <Grid fluid id="assigned-grid">
                <ApplicantTableMenu
                    config={this.config}
                    getSelectedSortFields={() => this.props.func.getSorts()}
                    anyFilterSelected={field => this.props.func.anyFilterSelected(field)}
                    isFilterSelected={(field, category) =>
                        this.props.func.isFilterSelected(field, category)}
                    toggleFilter={(field, category) =>
                        this.props.func.toggleFilter(field, category)}
                    clearFilters={() => this.props.func.clearFilters()}
                    addSort={field => this.props.func.addSort(field)}
                    removeSort={field => this.props.func.removeSort(field)}
                    toggleSortDir={field => this.props.func.toggleSortDir(field)}
                />

                <ApplicantTable
                    config={this.config}
                    getApplicants={() => this.props.func.getAssignedApplicants()}
                    rowId={p => 'unassigned-' + p.applicantId}
                    getSelectedSortFields={() => this.props.func.getSorts()}
                    getSelectedFilters={() => this.props.func.getFilters()}
                />
            </Grid>
        );
    }

    selectThisTab() {
        this.props.func.selectNavTab(this.props.navKey);
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }
}

export { Assigned };
