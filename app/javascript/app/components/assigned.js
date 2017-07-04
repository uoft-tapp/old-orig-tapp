import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { AssignedTableMenu } from "./assignedTableMenu.js";
import { AssignedApplicantTable } from "./assignedApplicantTable.js";

class Assigned extends React.Component {
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <AssignedTableMenu />
            <AssignedApplicantTable
              applicants={this.props.applicants}
              assigned={false}
            />
          </Col>
        </Row>
      </Grid>
    );
  }

  selectThisTab() {
    this.props.func.selectNavTab(this.props.navKey);
  }

  componentDidMount() {
    this.selectThisTab();
  }

  componentDidUpdate() {
    this.selectThisTab();
  }
}

export { Assigned };
