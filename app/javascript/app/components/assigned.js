import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { TableMenu } from './tableMenu.js'
import { AssignedApplicantTable } from './assignedApplicantTable.js'

class Assigned extends React.Component {
    render() {
	return <Grid fluid><Row><Col xs={12}>
	    <TableMenu/>
	    <AssignedApplicantTable applicants={this.props.applicants.assigned} assigned={false}/>
	    </Col></Row></Grid>
    }

    selectThisTab() {
	this.props.nav.selectTab(this.props.nav.assigned.key);
    }
    
    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {	
	this.selectThisTab();
    }
}

export { Assigned };
