import React from "react";
import { Grid, Row, Col, Button } from "react-bootstrap";
import { UnassignedTableMenu } from "./unassignedTableMenu.js";
import { UnassignedApplicantTable } from "./unassignedApplicantTable.js";

class Unassigned extends React.Component {
  constructor(props) {
    super(props);
    this.unassigned = props.func.getUnassignedApplicantsList();
    this.coursesList = Object.entries(props.func.getCoursesList());

    this.config = [
      {
        header: "Last Name",
        additional_sort: true,
        data: p => p.applicant.lastName,
        sortData: p => p.applicant.lastName
      },
      {
        header: "First Name",
        additional_sort: true,
        data: p => p.applicant.firstName,
        sortData: p => p.applicant.firstName
      },
      {
        header: "Dept.",
        additional_sort: true,
        data: p => p.applicant.dept,
        sortData: p => p.applicant.dept
      },
      {
        header: "Prog.",
        additional_sort: true,
        data: p => p.applicant.program,
        sortData: p => p.applicant.program
      },
      {
        header: "Year",
        additional_sort: true,
        data: p => p.applicant.year,
        sortData: p => p.applicant.year
      },
      {
        header: "Email",
        additional_sort: true,
        data: p => p.applicant.email,
        sortData: p => p.applicant.email
      },
      {
        header: "Course Preferences",
        additional_sort: false,
        data: p =>
          props.func.getApplicationById(p.applicantId)["prefs"].map(position =>
            <Button
              style={{ marginRight: "1px" }}
              key={p.applicantId + "-" + position.positionId}
              bsStyle="primary"
              bsSize="xsmall"
              disabled
            >
              {props.func.getCourseById(position.positionId).code}
            </Button>
          ),
        sortData: p =>
          props.func.getApplicationById(p.applicantId)["prefs"].map(position =>
            <Button bsStyle="primary" bsSize="small" disabled>
              {props.func.getCourseById(position.positionId).code}
            </Button>
          )
      }
    ];
  }

  render() {
    return (
      <Grid fluid style={{ height: "88vh", overflow: "auto" }}>
        <Row>
          <Col xs={12}>
            <UnassignedTableMenu
              config={this.config}
              addSort={field => {
                this.props.func.addAssignmentSortFilters(field);
              }}
              activeSortFields={this.props.unassignedView.selected}
              clear={field => {
                this.props.func.clearAssignmentSortFilters(field);
              }}
              coursesList={this.coursesList}
            />

            <UnassignedApplicantTable
              config={this.config}
              applicants={this.unassigned}
              assigned={false}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
  componentDidMount() {
    this.selectThisTab();
  }

  componentDidUpdate() {
    this.selectThisTab();
  }

  selectThisTab() {
    this.props.func.selectNavTab(this.props.navKey);
  }
}

export { Unassigned };
