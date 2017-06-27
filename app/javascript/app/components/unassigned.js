import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { TableMenu } from './tableMenu.js'
import { UnassignedApplicantTable } from './unassignedApplicantTable.js'

class Unassigned extends React.Component {
    render() {
      return <Grid fluid><Row><Col xs={12}>
          <TableMenu/>
          <UnassignedApplicantTable applicants={this.props.applicants} assigned={false}/>
          </Col></Row></Grid>
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

export { Unassigned };