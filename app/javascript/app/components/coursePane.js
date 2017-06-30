import React from 'react'
import { Panel } from 'react-bootstrap'
import { ABCTableMenu } from './abcTableMenu.js'
import { ABCApplicantTable } from './abcApplicantTable.js'

class CoursePane extends React.Component {
    constructor(props) {
        super(props);

        // table/menu configuration
        this.fields = [
            {
                header: '',
                data: p => (
                        <input type='checkbox' defaultChecked={p.assigned} onClick={() => props.func.addAssignment(
                            p.applicantId, p.course, props.func.getCourseById(p.course).positionHours)}/>
                ),
            },
            {
                header: 'Last Name',
                data: p => p.applicant.lastName,
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
            },
            {
                header: 'Prog.',
                data: p => p.applicant.program,
                sortData: p => p.applicant.program,
            },
            {
                header: 'Year',
                data: p => p.applicant.year,
                sortData: p => p.applicant.year,
            },
            {
                header: 'Pref.',
                data: p => (props.func.getApplicationPreference(p.applicantId, p.course) ?
                            <i className='fa fa-check'/> : ''
                           ),
                sortData: p => (props.func.getApplicationPreference(p.applicantId, p.course)),
            },
            {
                header: 'Other',
                data: p => (
                    props.func.getAssignmentsByApplicant(p.applicantId).reduce(
                        (str, ass) => (ass.positionId == p.course) ?
                            str : str + props.func.getCourseCodeById(ass.positionId) + ', ',
                        '')
                ),
                sortData: p => (
                    props.func.getAssignmentsByApplicant(p.applicantId).reduce(
                        (str, ass) => (ass.positionId == p.course) ?
                            str : str + props.func.getCourseCodeById(ass.positionId),
                    '')
                ),
            }
        ];
    }
    
    render() {
        let course = this.props.func.getCourseById(this.props.course);
        if (!course)
            return null;

        let panelFields = this.props.func.getCoursePanelFieldsByCourse(this.props.course);

        return (
                <Panel style={{height: '100%', maxHeight: '88vh', overflow: 'auto'}}
            header={<span>{course.code}&emsp;{course.assignmentCount} /{course.estimatedPositions}
                    <i className="fa fa-close" style={{float: 'right'}} onClick={() => {
                        this.props.func.toggleSelectedCourse(this.props.course);
                        this.props.func.toggleCoursePanel(this.props.course);
                    }}></i>
                    </span>}>

                <ABCApplicantTable config={this.fields} assigned={true} {...panelFields} {...this.props}/>

                <ABCTableMenu config={this.fields} {...panelFields} {...this.props}/>

                <ABCApplicantTable config={this.fields} assigned={false} {...panelFields} {...this.props}/>
                </Panel>
        );
    }
}

export { CoursePane };
