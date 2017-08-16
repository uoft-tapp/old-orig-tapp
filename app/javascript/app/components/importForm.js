import React from 'react';
import {
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    OverlayTrigger,
    Popover,
} from 'react-bootstrap';

// form for importing data from a file and persisting it to the database
class ImportForm extends React.Component {
    loadFile() {
        let files = document.getElementById('import').files;
        if (files.length > 0) {
            let message =
                'Are you sure you want to import "' + files[0].name + '" into the database?';
            if (files[0].type == 'application/json') {
                if (confirm(message)) {
                    let importChass = this.props.importChass;
                    let waitAlert = () => this.props.notify('<i>Import in progress...</i>');
                    let chassAlert = () => this.props.alert('Error: This is not a CHASS JSON.');
                    let malformedAlert = () => this.props.alert('Error: This JSON is malformed.');
                    this.uploadFile(files[0], importChass, waitAlert, chassAlert, malformedAlert);
                }
            } else {
                this.props.alert('Error: The file you uploaded is not a JSON.');
            }
        } else {
            this.props.alert('Error: No file chosen.');
        }
    }

    uploadFile(file, importChass, waitAlert, chassAlert, malformedAlert) {
        let reader = new FileReader();
        reader.onload = function(event) {
            try {
                let data = JSON.parse(event.target.result);

                if (data['courses'] !== undefined && data['applicants'] !== undefined) {
                    data = { chass_json: data };
                    waitAlert();
                    importChass(data);
                } else {
                    chassAlert();
                }
            } catch (err) {
                malformedAlert();
            }
        };
        reader.readAsText(file);
    }

    render() {
        return (
            <Form inline>
                <FormControl.Static style={{ verticalAlign: 'middle' }}>
                    <i
                        className="fa fa-upload"
                        style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                        onClick={() => this.loadFile()}
                    />&emsp;
                </FormControl.Static>
                <FormGroup>
                    <ControlLabel>
                        Import from file:
                        <OverlayTrigger
                            trigger="click"
                            rootClose
                            placement="right"
                            overlay={InfoDialog(chassFormat)}>
                            <i className="fa fa-info-circle" style={{ color: 'blue' }} />
                        </OverlayTrigger>
                    </ControlLabel>
                    <FormControl id="import" type="file" accept="application/json" />
                </FormGroup>
            </Form>
        );
    }
}

const InfoDialog = () =>
    <Popover id="help" placement="right" title="CHASS JSON format">
        <textarea value={chassFormat} disabled />
    </Popover>;

const chassFormat = `{
    "courses": [
      {
        "instructor": [{},...],
        "last_updated": datetime,
        "end_nominations": string,
        "status": integer,
        "end_posting": datetime,
        "start_posting": datetime,
        "total_hours": integer,
        "duties": string,
        "qualifications": string,
        "tutorials": string,
        "dates": string,
        "n_hours": string,
        "n_positions": integer,
        "enrollment": integer,
        "round_id": integer,
        "course_name": string,
        "course_id": string,
        "dates": string
      },...],
    "applicants": [
      {
        "app_id": string,
        "utorid": string,
        "first_name": string,
        "last_name": string,
        "email": string,
        "phone": string,
        "student_no": string,
        "address": string,
        "ta_training": (Y/N),
        "access_acad_history": (Y/N),
        "dept": string,
        "program_id": string,
        "yip": string,
        "course_preferences": string,
        "ta_experience": "string,
        "academic_qualifications": string,
        "technical_skills": string,
        "availability": string,
        "other_info": string,
        "special_needs": string,
        "last_updated": datetime,
        "courses": [string, ...]
      },...]
  }`;

export { ImportForm };
