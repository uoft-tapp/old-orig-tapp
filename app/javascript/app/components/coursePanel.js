import React from 'react';
import { Panel } from 'react-bootstrap';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';

class CoursePanel extends React.Component {
    constructor(props) {
        super(props);

        // table/menu configuration
        this.config = [
            {
                header: '',
                // checkbox that is checked if the applicant is currently assigned, unchecked if not
                data: p =>
                    <input
                        type="checkbox"
                        defaultChecked={p.assigned}
                        onClick={() => {
                            if (p.assigned) {
                                props.deleteAssignment(
                                    p.applicantId,
                                    props.getAssignmentByApplicant(p.applicantId, p.course).id
                                );
                            } else {
                                props.createAssignment(
                                    p.applicantId,
                                    p.course,
                                    props.getCourseById(p.course).positionHours
                                );
                            }
                        }}
                    />,

                style: () => ({ width: '2%' }),
            },
            {
                header: 'Last Name',
                // last name generates a modal of the applicant's individual page
                data: p =>
                    <span
                        className="highlightOnHover"
                        onClick={() => props.selectApplicant(p.applicantId)}>
                        {p.applicant.lastName}
                    </span>,
                sortData: p => p.applicant.lastName,

                style: () => ({ width: '15%' }),
            },
            {
                header: 'First Name',
                data: p => p.applicant.firstName,
                sortData: p => p.applicant.firstName,

                style: () => ({ width: '15%' }),
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

                style: () => ({ width: '25%' }),
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
                    // group masters programs together
                    p => ['MSc', 'MASc', 'MScAC', 'MEng', 'OG'].includes(p.applicant.program),
                    p => p.applicant.program == 'UG',
                ],

                style: () => ({ width: '10%' }),
            },
            {
                header: 'Year',
                data: p => p.applicant.year,
                sortData: p => p.applicant.year,

                style: () => ({ width: '5%' }),
            },
            {
                header: 'Pref.',
                // checkmark if the applicant has a special preference for this course, nothing otherwise
                data: p =>
                    props.getApplicationPreference(p.applicantId, p.course)
                        ? <i className="fa fa-check" />
                        : '',

                sortData: p => props.getApplicationPreference(p.applicantId, p.course),

                style: () => ({ width: '5%' }),
            },
            {
                header: 'Other',
                // comma-separated list of the codes for the (other) courses to which this applicant is assigned
                data: p =>
                    props
                        .getAssignmentsByApplicant(p.applicantId)
                        .reduce(
                            (str, ass) =>
                                ass.positionId == p.course
                                    ? str
                                    : str + props.getCourseCodeById(ass.positionId) + ', ',
                            ''
                        ),

                // unseparated string of the codes for the (other) courses to which this applicant is assigned
                sortData: p =>
                    props
                        .getAssignmentsByApplicant(p.applicantId)
                        .reduce(
                            (str, ass) =>
                                ass.positionId == p.course
                                    ? str
                                    : str + props.getCourseCodeById(ass.positionId),
                            ''
                        ),

                filterLabel: 'Status',
                filterCategories: ['Assigned elsewhere', 'Unassigned'],
                filterFuncs: [
                    // filter corresponding to 'assigned elsewhere'
                    p => props.getAssignmentsByApplicant(p.applicantId).length > 0,

                    // filter corresponding to 'unassigned'
                    p => props.getAssignmentsByApplicant(p.applicantId).length == 0,
                ],

                style: () => ({}),
            },
        ];
    }

    render() {
        let course = this.props.getCourseById(this.props.course);

        return (
            <Panel
                className="course-panel"
                style={this.props.panelStyle}
                header={
                    <span>
                        {course.code}&emsp;{this.props.getCourseAssignmentCount(
                            this.props.course
                        )}&nbsp;/
                        {course.estimatedPositions}
                        <i
                            className="fa fa-close"
                            style={{ float: 'right' }}
                            onClick={() => this.props.toggleSelectedCourse(this.props.course)}
                        />
                    </span>
                }
                draggable={true}
                onDragStart={e => {
                    // send this course ID to an element that this panel is dragged over
                    e.dataTransfer.setData('text', this.props.course);
                }}
                onDragOver={e => {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                }}
                onDrop={e => {
                    if (e.stopPropagation) {
                        e.stopPropagation(); // stops the browser from redirecting.
                    }

                    // swap this course with the course that was dragged over it
                    let swap = parseInt(e.dataTransfer.getData('text'));
                    if (swap != this.props.course) {
                        this.props.swapCoursesInLayout(swap, this.props.course);
                    }
                }}>
                <ApplicantTable
                    config={this.config}
                    assigned={true}
                    course={parseInt(this.props.course)}
                    getApplicants={() =>
                        this.props.getApplicantsAssignedToCourse(this.props.course)}
                    rowId={p => p.course + '-' + p.applicantId + '-1'}
                />

                <ApplicantTableMenu
                    config={this.config}
                    getSelectedSortFields={() =>
                        this.props.getCoursePanelSortsByCourse(this.props.course)}
                    anyFilterSelected={field =>
                        this.props.anyCoursePanelFilterSelected(this.props.course, field)}
                    isFilterSelected={(field, category) =>
                        this.props.isCoursePanelFilterSelected(this.props.course, field, category)}
                    toggleFilter={(field, category) =>
                        this.props.toggleCoursePanelFilter(this.props.course, field, category)}
                    clearFilters={() => this.props.clearCoursePanelFilters(this.props.course)}
                    addSort={field => this.props.addCoursePanelSort(this.props.course, field)}
                    removeSort={field => this.props.removeCoursePanelSort(this.props.course, field)}
                    toggleSortDir={field =>
                        this.props.toggleCoursePanelSortDir(this.props.course, field)}
                />

                <ApplicantTable
                    config={this.config}
                    assigned={false}
                    course={parseInt(this.props.course)}
                    getApplicants={() =>
                        this.props.getApplicantsToCourseUnassigned(this.props.course)}
                    getSelectedSortFields={() =>
                        this.props.getCoursePanelSortsByCourse(this.props.course)}
                    getSelectedFilters={() =>
                        this.props.getCoursePanelFiltersByCourse(this.props.course)}
                    rowId={p => p.course + '-' + p.applicantId + '-0'}
                />
            </Panel>
        );
    }
}

export { CoursePanel };
