import React from 'react';
import { Panel } from 'react-bootstrap';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';

class CoursePane extends React.Component {
    constructor(props) {
        super(props);

        // table/menu configuration
        this.fields = [
            {
                header: '',
                data: p =>
                    <input
                        type="checkbox"
                        defaultChecked={p.assigned}
                        onClick={() => {
                            if (p.assigned) {
                                props.func.deleteAssignment(
                                    p.applicantId,
                                    props.func.getAssignmentByApplicant(p.applicantId, p.course).id
                                );
                            } else {
                                props.func.createAssignment(
                                    p.applicantId,
                                    p.course,
                                    props.func.getCourseById(p.course).positionHours
                                );
                            }
                        }}
                    />,
            },
            {
                header: 'Last Name',
                data: p => (<a href={'applicant/' + p.applicantId}>{p.applicant.lastName}</a>),
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
                header: 'Pref.',
                data: p =>
                    props.func.getApplicationPreference(p.applicantId, p.course)
                        ? <i className="fa fa-check" />
                        : '',

                sortData: p => props.func.getApplicationPreference(p.applicantId, p.course),
            },
            {
                header: 'Other',
                data: p =>
                    props.func
                        .getAssignmentsByApplicant(p.applicantId)
                        .reduce(
                            (str, ass) =>
                                ass.positionId == p.course
                                    ? str
                                    : str + props.func.getCourseCodeById(ass.positionId) + ', ',
                            ''
                        ),

                sortData: p =>
                    props.func
                        .getAssignmentsByApplicant(p.applicantId)
                        .reduce(
                            (str, ass) =>
                                ass.positionId == p.course
                                    ? str
                                    : str + props.func.getCourseCodeById(ass.positionId),
                            ''
                        ),

                filterLabel: 'Status',
                filterCategories: ['Assigned elsewhere', 'Unassigned'],
                filterFuncs: [
                    // filter corresponding to 'assigned elsewhere'
                    p => props.func.getAssignmentsByApplicant(p.applicantId).length > 0,

                    // filter corresponding to 'unassigned'
                    p => props.func.getAssignmentsByApplicant(p.applicantId).length == 0,
                ],
            },
        ];
    }

    render() {
        let course = this.props.func.getCourseById(this.props.course);
        if (!course) {
            return null;
        }

        return (
            <Panel
                style={{ height: '100%', maxHeight: '88vh', overflow: 'auto' }}
                header={
                    <span>
                        {course.code}&emsp;{course.assignmentCount} /{course.estimatedPositions}
                        <i
                            className="fa fa-close"
                            style={{ float: 'right' }}
                            onClick={() => {
                                this.props.func.toggleSelectedCourse(this.props.course);
                                this.props.func.toggleCoursePanel(this.props.course);
                            }}
                        />
                    </span>
                }>
                <ApplicantTable
                    config={this.fields}
                    assigned={true}
                    course={this.props.course}
                    getApplicants={() =>
                        this.props.func.getApplicantsAssignedToCourse(this.props.course)}
                />

                <ApplicantTableMenu
                    config={this.fields}
                    getActiveSortFields={() =>
                        this.props.func.getCoursePanelSortsByCourse(this.props.course)}
                    anyFilterActive={field =>
                        this.props.func.anyFilterActive(this.props.course, field)}
                    isFilterActive={(field, category) =>
                        this.props.func.isFilterActive(this.props.course, field, category)}
                    toggleFilter={(field, category) =>
                        this.props.func.toggleFilter(this.props.course, field, category)}
                    clearFilters={() => this.props.func.clearFilters(this.props.course)}
                    addSort={field => this.props.func.addSort(this.props.course, field)}
                    removeSort={field => this.props.func.removeSort(this.props.course, field)}
                    toggleSortDir={field => this.props.func.toggleSortDir(this.props.course, field)}
                />

                <ApplicantTable
                    config={this.fields}
                    assigned={false}
                    course={this.props.course}
                    getApplicants={() =>
                        this.props.func.getApplicantsToCourseUnassigned(this.props.course)}
                    getActiveSortFields={() =>
                        this.props.func.getCoursePanelSortsByCourse(this.props.course)}
                    getActiveFilters={() =>
                        this.props.func.getCoursePanelFiltersByCourse(this.props.course)}
                />
            </Panel>
        );
    }
}

export { CoursePane };
