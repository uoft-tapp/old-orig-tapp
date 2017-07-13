import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';

class Unassigned extends React.Component {
    constructor(props) {
        super(props);

        // table/menu configuration
        this.config = [
            {
                header: 'Last Name',
                data: p =>
                    <a href={'applicant/' + p.applicantId}>
                        {p.applicant.lastName}
                    </a>,
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
                header: 'Course Preferences',
                data: p =>
                    <ButtonToolbar>
                        {props.func.getApplicationById(p.applicantId).prefs.map(pref =>
                            <Button
                                bsSize="xsmall"
                                style={{ borderColor: '#555' }}
                                key={'button-' + p.applicantId + '-' + pref.positionId}
                                href={
                                    'applicantsbycourse#' +
                                    pref.positionId +
                                    '-' +
                                    p.applicantId +
                                    '-0'
                                }>
                                {props.func.getCourseCodeById(pref.positionId)}
                            </Button>
                        )}
                    </ButtonToolbar>,

                filterLabel: 'Course',
                filterCategories: props.func.getCourseCodes(),
                // for each course, filter out applicants who did not apply to that course
                filterFuncs: Object.keys(props.func.getCoursesList()).map(key => p =>
                    props.func
                        .getApplicationById(p.applicantId)
                        .prefs.some(pref => pref.positionId == key)
                ),
            },
        ];
    }

    render() {
        return (
            <Grid fluid id="unassigned-grid">
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
                    getApplicants={() => this.props.func.getUnassignedApplicants()}
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

    componentDidMount() {
        this.selectThisTab();
    }

    componentDidUpdate() {
        this.selectThisTab();
    }
}

export { Unassigned };
