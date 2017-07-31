import React from 'react';
import {
    Grid,
    Panel,
    PanelGroup,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Button,
    Well,
    Table,
} from 'react-bootstrap';

class Summary extends React.Component {
    render() {
        let nullCheck = this.props.func.anyNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.func.anyFetching();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <Grid fluid id="summary-grid" style={cursorStyle}>
                <PanelGroup>
                    <Utilities {...this.props} />
                    <Stats {...this.props} />
                </PanelGroup>
            </Grid>
        );
    }

    selectThisTab() {
        if (this.props.func.getSelectedNavTab() != this.props.navKey) {
            this.props.func.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }
}

const Utilities = props => {
    return (
        <Panel header="Utilities" id="utils">
            <ImportForm {...props} />
            <ExportForm {...props} />
            <ReleaseForm {...props} />
        </Panel>
    );
};

// form for importing data from a file and persisting it to the database
class ImportForm extends React.Component {
    render() {
        return (
            <Form inline id="import">
                <FormControl.Static style={{ verticalAlign: 'middle' }}>
                    <i className="fa fa-upload" style={{ fontSize: '20px', color: 'blue' }} />&emsp;
                </FormControl.Static>
                <FormGroup id="import">
                    <ControlLabel>Import from file:</ControlLabel>
                    <FormControl id="import" type="file" accept="application/json" />
                </FormGroup>
            </Form>
        );
    }
}

// form for exporting app data to a file
class ExportForm extends React.Component {
    exportData(data, format) {
        if (data == 'offers') {
            // export offers
            let route;
            if (format == 'csv') {
                // export offers in CSV format
                route = '/export/' + data;
            } else {
                // export offers in JSON format
                // this will be non-functional until round IDs are incorporated!
                route = '/export/chass/' + props.func.getSelectedRound();
            }

            if (
                confirm(
                    'This will lock all exported assignments.\nAre you sure you want to proceed?'
                )
            ) {
                window.open(route);
            }
        } else {
            // export other data in CSV format
            if (format == 'csv') {
                window.open('/export/' + data);
            } else {
                props.func.alert(
                    <span>
                        <b>Export JSON</b> This functionality is not currently supported.
                    </span>
                );
            }
        }
    }

    render() {
        return (
            <Form inline id="export">
                <FormGroup id="data">
                    <ControlLabel>Export&ensp;</ControlLabel>
                    <FormControl
                        id="data"
                        componentClass="select"
                        inputRef={ref => {
                            this.data = ref;
                        }}>
                        <option value="offers">Offers</option>
                        <option value="cdf-info">CDF info</option>
                        <option value="transcript-access">
                            Undergraduate applicants granting access to academic history
                        </option>
                    </FormControl>
                </FormGroup>

                <FormGroup id="format">
                    <ControlLabel>&ensp;to&ensp;</ControlLabel>
                    <FormControl
                        id="format"
                        componentClass="select"
                        inputRef={ref => {
                            this.format = ref;
                        }}>
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                    </FormControl>
                </FormGroup>
                <FormControl.Static style={{ verticalAlign: 'middle' }}>
                    &emsp;<i
                        className="fa fa-download"
                        style={{ fontSize: '20px', color: 'blue' }}
                        onClick={() => this.exportData(this.data.value, this.format.value)}
                    />
                </FormControl.Static>
            </Form>
        );
    }
}

// form for releasing tentative assignments to instructors
const ReleaseForm = props =>
    <Form id="release">
        <Button
            bsStyle="success"
            onClick={() =>
                props.func.alert(
                    <span>
                        <b>Release assignments</b> This functionality is not currently supported.
                    </span>
                )}>
            Release assignments
        </Button>
    </Form>;

const Stats = props => {
    let applicants = props.func.idEntries(props.func.getApplicantsList());
    let gradApplicants = applicants.filter(([_, app]) =>
        ['MSc', 'MASc', 'MScAC', 'MEng', 'OG', 'PhD'].includes(app.program)
    );
    let dcsGradApplicants = gradApplicants.filter(([_, app]) => app.dept == 'Computer Science');

    let assignments = props.func.getAssignmentsList();
    let unassGradApplicants = gradApplicants.filter(([id, _]) => !assignments[id]);
    let unassDcsGradApplicants = dcsGradApplicants.filter(([id, _]) => !assignments[id]);

    let courses = props.func.getCoursesList();
    let orderedCourses = props.func.idEntries(courses);
    orderedCourses.sort(([A, valA], [B, valB]) => (valA.code < valB.code ? -1 : 1));

    let assignmentsList = props.func.idEntries(assignments);
    let applicationsList = props.func.idEntries(props.func.getApplicationsList());

    return (
        <Panel header="Assignment Statistics" id="stats">
            <Well id="gen-stats">
                <span className="stat">
                    <h2>{applicants.length}</h2> applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{gradApplicants.length}</h2> graduate applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{unassGradApplicants.length}</h2> unassigned graduate applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{dcsGradApplicants.length}</h2> DCS graduate applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{unassDcsGradApplicants.length}</h2> unassigned DCS graduate applicants
                </span>
            </Well>

            <Table striped hover condensed id="per-course">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Est. enrolment</th>
                        <th>Applicants</th>
                        <th>Assignments</th>
                        <th>Assigned hours</th>
                        <th>Density</th>
                    </tr>
                </thead>
                <tbody>
                    {orderedCourses.map(([id, course]) =>
                        <PerCourseStats
                            key={id + '-stats'}
                            course={id}
                            courses={courses}
                            applications={applicationsList}
                            assignments={assignmentsList}
                        />
                    )}
                </tbody>
            </Table>
        </Panel>
    );
};

const PerCourseStats = props => {
    // applications to course
    let applications = props.applications.filter(([_, app]) =>
        app[0].prefs.some(pref => pref.positionId == props.course)
    );

    // assignments to course
    let assignments = props.assignments
        .map(([_, app]) => app.find(ass => ass.positionId == props.course))
        .filter(ass => ass != undefined);

    // total hours assigned to course
    let taHours = assignments.reduce((total, ass) => total + ass.hours, 0);

    return (
        <tr>
            <td>
                {props.courses[props.course].code}
            </td>
            <td>
                {props.courses[props.course].estimatedEnrol}
            </td>
            <td>
                {applications.length}
            </td>
            <td>
                {assignments.length}
            </td>
            <td>
                {taHours}
            </td>
            {props.courses[props.course].estimatedEnrol == null
                ? <td />
                : <td>
                      {(taHours / props.courses[props.course].estimatedEnrol).toFixed(2)}
                  </td>}
        </tr>
    );
};

export { Summary };
