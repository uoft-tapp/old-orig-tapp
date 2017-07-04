import React from "react";
import { Table } from "react-bootstrap";

const THeader = props =>
  <thead>
    <tr>
      {props.config.map((field, i) =>
        <th key={"header-" + i}>
          {field.header}
        </th>
      )}
    </tr>
  </thead>;

const ApplicantRow = props =>
  <tr key={"unassigned-" + props.applicantId + "-row"}>
    {props.config.map((field, i) =>
      <td key={"applicant-" + props.applicantId + "-row-" + i}>
        {field.data(props)}
      </td>
    )}
  </tr>;

class UnassignedApplicantTable extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <THeader config={this.props.config} />
        <tbody>
          {this.props.applicants.map(([key, val]) =>
            <ApplicantRow
              key={"unassigned" + key}
              applicantId={key}
              applicant={val}
              {...this.props}
            />
          )}
        </tbody>
      </Table>
    );
  }
}

export { UnassignedApplicantTable };
