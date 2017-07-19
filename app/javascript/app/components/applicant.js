import React from 'react';
import { AssignmentForm } from './assignmentForm.js';
import { Panel, Button } from 'react-bootstrap';

class Applicant extends React.Component {
    constructor(props) {
        super(props);

        // applicant panels and their default expansion state
        this.defaultConfig = [
            { label: 'Personal Information', expanded: true },
            { label: 'Current Status', expanded: true },
            { label: 'Current Program Information', expanded: true },
            { label: 'Current Assignment Status', expanded: true },
            { label: 'Course Preferences', expanded: true },
            { label: 'Course Preferences (Raw Text)', expanded: false },
            { label: 'Teaching Experience', expanded: true },
            { label: 'Academic Qualifications', expanded: true },
            { label: 'Technical Skills', expanded: true },
            { label: 'Availability', expanded: true },
            { label: 'Other Information', expanded: true },
            { label: 'Special Needs Issues', expanded: true },
            { label: 'Notes', expanded: true },
        ];
    }

    addPanelContent(panel) {
        let application = this.props.func.getApplicationById(this.props.applicantId);

        switch (panel) {
            case 'Personal Information':
                return <PersonalInfo applicant={this.props.applicantId} {...this.props} />;

            case 'Current Status':
                return <Status applicant={this.props.applicantId} {...this.props} />;

            case 'Current Program Information':
                return <ProgramInfo applicant={this.props.applicantId} {...this.props} />;

            case 'Current Assignment Status':
                return <AssignmentForm {...this.props} />;

            case 'Course Preferences':
                return <Prefs applicant={this.props.applicantId} {...this.props} />;

            case 'Course Preferences (Raw Text)':
                return application.rawPrefs;

            case 'Teaching Experience':
                return application.exp;

            case 'Academic Qualifications':
                return application.qual;

            case 'Technical Skills':
                return application.skills;

            case 'Availability':
                return application.avail;

            case 'Other Information':
                return application.other;

            case 'Special Needs Issues':
                return application.specialNeeds;

            case 'Notes':
                return <NotesForm applicant={this.props.applicantId} {...this.props} />;

            default:
                return null;
        }
    }

    componentWillMount() {
        // initially, create an assignment form with the default panels and expansion state, unless the
        // expansion state is overridden by this.props.config
        // this.props.config should be of the form { <label> : <expanded?> }

        this.props.func.createAssignmentForm(
            this.defaultConfig.map(
                panel =>
                    this.props.config && panel.label in this.props.config
                        ? { label: panel.label, expanded: this.props.config[panel.label] }
                        : panel
            )
        );
    }

    render() {
        return (
            <div>
                {this.props.func.getAssignmentForm().panels.map((panel, index) =>
                    <Panel
                        collapsible
                        expanded={panel.expanded}
                        header={
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    margin: '0',
                                    cursor: 'pointer',
                                }}
                                onClick={() => this.props.func.togglePanelExpanded(index)}>
                                {panel.label}
                            </div>
                        }
                        key={'panel-' + index}>
                        {this.addPanelContent(panel.label)}
                    </Panel>
                )}
            </div>
        );
    }
}

const PersonalInfo = props => {
    let applicant = props.func.getApplicantById(props.applicant);

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
                            <b>UTORid: </b>
                            {applicant.utorid}
                        </p>
                        <p>
                            <b>Email Address: </b>
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
                        {applicant.address != null &&
                            applicant.address.split('\r\n').map((part, key) =>
                                <p key={key}>
                                    {part}
                                </p>
                            )}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

const Status = props => {
    let application = props.func.getApplicationById(props.applicant);

    return (
        <table className="panel_table">
            <tbody>
                <tr>
                    <td>
                        <b>Enrolled as a U of T graduate student for the TA session?&nbsp;</b>
                        {application.academicAccess ? 'Yes' : 'No'}
                    </td>
                    <td>
                        <b>Completed a U of T TA training session?&nbsp;</b>
                        {application.taTraining ? 'Yes' : 'No'}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

const ProgramInfo = props => {
    let applicant = props.func.getApplicantById(props.applicant);

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
};

const Prefs = props => {
    let prefs = props.func.getApplicationById(props.applicant).prefs;
    let courses = props.func.getCoursesList();

    let j = 0,
        columns = [],
        size = 4;
    for (let i = 0; i < Math.ceil(prefs.length / size); i++) {
        columns[i] = prefs.slice(j, j + size);
        j = j + size;
    }

    return (
        <table className="panel_table">
            <tbody>
                <tr>
                    {columns.map((column, key) =>
                        <td key={key}>
                            {column.map((item, key) =>
                                <p key={key}>
                                    {courses[item.positionId].code}
                                    &nbsp;{item.preferred
                                        ? <i className="fa fa-star-o" style={{ color: 'orange' }} />
                                        : ''}
                                </p>
                            )}
                        </td>
                    )}
                </tr>
            </tbody>
        </table>
    );
};

const NotesForm = props =>
    <div>
        <textarea
            id="applicant-notes"
            style={{ width: '100%' }}
            defaultValue={props.func.getApplicantById(props.applicant).notes}
        />
        <br />
        <Button
            bsSize="small"
            onClick={() =>
                props.func.noteApplicant(
                    props.applicant,
                    document.getElementById('applicant-notes').value
                )}>
            Save
        </Button>
    </div>;

export { Applicant };
