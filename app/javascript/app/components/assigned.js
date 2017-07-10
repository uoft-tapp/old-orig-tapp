import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';

class Assigned extends React.Component {
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
            },
            {
                header: 'First Name',
                data: p => p.applicant.firstName,
                sortData: p => p.applicant.firstName,
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
            },
            {
                header: 'Year',
                data: p => p.applicant.year,
                sortData: p => p.applicant.year,
            },
            {
                header: 'Email',
                data: p => p.applicant.email,
                sortData: p => p.applicant.email,
            },
            {
                header: 'Course(s)',
                data: p =>
                    <ButtonToolbar>   
                    {props.func.getAssignmentsByApplicant(p.applicantId).map(ass =>
                                                                             <Button
                                bsSize="xsmall"
                                style={{ borderColor: '#555' }}
                                key={'button-' + p.applicantId + '-' + ass.positionId}
                                href={
                                    'applicantsbycourse#' +
                                        ass.positionId +
                                        '-' +
                                        p.applicantId +
                                        '-1'
                                }>
                                                                             {props.func.getCourseCodeById(ass.positionId)}&nbsp;&middot;&nbsp;{ass.hours}
                                                                              </Button>
                                                                             )}
                     </ButtonToolbar>,

                filterLabel: 'Course',
                filterCategories: props.func.getCourseCodes(),
                // for each course, filter out applicants who are not assigned to that course
                filterFuncs: Object.keys(props.func.getCoursesList()).map(
                    key => (
                        p => props.func
                            .getAssignmentsByApplicant(p.applicantId)
                            .some(pref => pref.positionId == key)
                    )),
            },
        ];          
    }

    render() {
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
}

export {Assigned};
