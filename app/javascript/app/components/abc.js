import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { CourseMenu } from './courseMenu.js'
import { CoursePane } from './coursePane.js'

class ABC extends React.Component {
    render() {
	return (
		<Grid fluid><Row><Col xs={12}>
		<CourseMenu {...this.props.courseMenu}/>
		<CoursePane {...this.props}/>
		</Col></Row></Grid>
	);
    }
}

export { ABC };
