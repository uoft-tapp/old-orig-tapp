import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { TableMenu } from './tableMenu.js'
import { UnassignedApplicantTable } from './unassignedApplicantTable.js'

class Unassigned extends React.Component {
    render() {
	return <Grid fluid><Row><Col xs={12}>
	    <TableMenu/>
	    <UnassignedApplicantTable applicants={this.props.applicants.assigned} assigned={false}/>
	    </Col></Row></Grid>
    }

    selectThisTab() {
	this.props.nav.selectTab(this.props.nav.unassigned.key);
    }
    
    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {	
	this.selectThisTab();
    }
}

export { Unassigned };
