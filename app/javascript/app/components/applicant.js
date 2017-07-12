import React from 'react';
import { AssignmentForm } from './assignmentForm.js';
import { Panel } from 'react-bootstrap';

class Applicant extends React.Component {
    selectThisTab() {
        this.props.func.selectNavTab(this.props.navKey, this.props.match.params.id);
    }

    componentDidMount() {
        this.selectThisTab();
    }

    componentDidUpdate() {
        this.selectThisTab();
    }

    setAddress(address) {
        let parts = address.split('\r\n');
        return parts.map((part, key) =>
            <p key={key}>
                {part}
            </p>
        );
    }

    setPrefs(pref, courses) {
        let j = 0,
            columns = [],
            size = 4;
        for (let i = 0; i < Math.ceil(pref.length / size); i++) {
            columns[i] = pref.slice(j, j + size);
            j = j + size;
        }
        return columns.map((column, key) =>
            <td key={key}>
                {column.map((item, key) =>
                    <p key={key}>
                        {courses[item.positionId].code}
                        {item.preferred
                            ? <i className="fa fa-star-o" style={{ color: 'orange' }} />
                            : ''}
                    </p>
                )}
            </td>
        );
    }

    addPanelContent(index) {
        if (!this.props.func.anyFetching()) {
            let id = this.props.match.params.id;
            let applicant = this.props.func.getApplicantById(id);
            let application = this.props.func.getApplicationById(id);
            let courses = this.props.func.getCoursesList();

            switch (index) {
                case 0:
                    return (
                        <table className="panel_table">
                            <tbody>
                                <tr>
                                    <td>
                                        <p>
                                            <b>Last Name: </b>
                                            {applicant.lastName}
                                        </p>
                                        <p>
                                            <b>UTORIid: </b>
                                            {applicant.utorid}
                                        </p>
                                        <p>
                                            <b>Email address: </b>
                                            {applicant.email}
                                        </p>
                                        <p>
                                            <b>Phone Number: </b>
                                            {applicant.phone}
                                        </p>
                                    </td>
                                    <td>
                                        <p>
                                            <b>First Name: </b>
                                            {applicant.firstName}
                                        </p>
                                        <p>
                                            <b>Student ID: </b>
                                            {applicant.studentNumber}
                                        </p>
                                    </td>
                                    <td>
                                        <p>
                                            <b>Address: </b>
                                        </p>
                                    </td>
                                    <td>
                                        {this.setAddress(applicant.address)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    );
                case 1:
                    return (
                        <table className="panel_table">
                            <tbody>
                                <tr>
                                    <td>
                                        <b>
                                            Enrolled as a U of T graduate student for the TA
                                            session?{' '}
                                        </b>
                                        {application.academicAccess ? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        <b>Completed a U of T TA training session? </b>
                                        {application.taTraining ? 'Yes' : 'No'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    );
                case 2:
                    return (
                        <table className="panel_table">
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Department: </b>
                                        {applicant.dept}
                                    </td>
                                    <td>
                                        <b>Program: </b>
                                        {applicant.program}
                                    </td>
                                    <td>
                                        <b>Year: </b>
                                        {applicant.year}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    );
                case 3:
                    return <AssignmentForm {...this.props} />;
                case 4:
                    return (
                        <table className="panel_table">
                            <tbody>
                                <tr>
                                    {this.setPrefs(application.prefs, courses)}
                                </tr>
                            </tbody>
                        </table>
                    );
                case 5:
                    return (
                        <p>
                            {application.rawPrefs}
                        </p>
                    );
                case 6:
                    return (
                        <p>
                            {application.exp}
                        </p>
                    );
                case 7:
                    return (
                        <p>
                            {application.qual}
                        </p>
                    );
                case 8:
                    return (
                        <p>
                            {application.skills}
                        </p>
                    );
                case 9:
                    return (
                        <p>
                            {application.avail}
                        </p>
                    );
                case 10:
                    return (
                        <p>
                            {application.other}
                        </p>
                    );
                case 11:
                    return (
                        <p>
                            {application.specialNeeds}
                        </p>
                    );
            }
        }
    }

    render() {
        let panels = [
            'Personal Information',
            'Current Status',
            'Current Program Information',
            'Current Assignment Status',
            'Course Preferences',
            'Course Preferences (Raw)',
            'Teaching Experience',
            'Academic Qualifications',
            'Technical Skills',
            'Availability',
            'Other Information',
            'Special Needs Issues',
        ];
        this.props.func.createAssignmentForm(panels);
        return (
            <CollapsiblePanel
                assignmentForm={this.props.func.getAssignmentForm()}
                state={this.props}
                self={this}
            />
        );
    }
}

const CollapsiblePanel = props =>
    <div className="container-fluid" style={{ height: '90vh', width: '100vw', overflow: 'auto' }}>
        {props.assignmentForm.panels.map((panel, index) =>
            <Panel
                style={{ width: '98vw', float: 'left', margin: '0' }}
                key={index}
                collapsible
                expanded={props.state.func.isPanelExpanded(index)}
                header={
                    <div
                        style={{ width: '100%', height: '100%', margin: '0', cursor: 'pointer' }}
                        onClick={() => props.state.func.togglePanelExpanded(index)}>
                        {panel.label}
                    </div>
                }
                key={'panel' + index}>
                {props.self.addPanelContent(index)}
            </Panel>
        )}
    </div>;

export { Applicant };
