import React from 'react';
import { Modal } from 'react-bootstrap';
import { Applicant } from './applicant.js';

class ApplicantModal extends React.Component {
    render() {
        let applicant = this.props.func.getApplicantById(this.props.applicantId);

        return (
            <Modal
                id="applicant-modal"
                show={true}
                onHide={() => this.props.func.unselectApplicant()}>
                <Modal.Header>
                    <Modal.Title>
                        {applicant.lastName},&nbsp;{applicant.firstName}
                        <span className="text-muted" style={{ float: 'right' }}>
                            <i className="fa fa-external-link" style={{ fontSize: '16px' }} />&ensp;
                            <i
                                className="fa fa-times"
                                style={{ fontSize: '18px' }}
                                onClick={() => this.props.func.unselectApplicant()}
                            />
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Applicant {...this.props} />
                </Modal.Body>
            </Modal>
        );
    }
}

export { ApplicantModal };
