import React from 'react'
import { CourseMenu } from './courseMenu.js'

class ABC extends React.Component {
    render() {
	return (
		<div className="container-fluid" style={{paddingTop: "70px"}}>
		<CourseMenu {...this.props.courseMenu}/>
		</div>
	);
    }
}

export { ABC };
