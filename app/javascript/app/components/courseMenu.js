import React from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'

class CourseMenu extends React.Component {
    render() {
	if (!this.props.courses.list)
	    return null;
	
	let itemStyle = {height: '2em', padding: '3px'};

	const list = Object.entries(this.props.courses.list).map(
	    ([key, val]) => {
		return (<ListGroupItem className='course-menu-item' key={'course-' + key} style={itemStyle}
			onClick={() => {
			    this.props.func.toggleSelectedCourse(key);
			    this.props.func.toggleCoursePanel(key);
			}}
			active={this.props.func.isCourseSelected(key)}>
			<span style={{float: 'left'}}>{val.code}</span>
			<span style={{float: 'right'}}>{val.assignmentCount} /{val.estimatedPositions}</span>
			</ListGroupItem>);
	    });
	
	return (
		<Panel header='Courses' style={{height: '100%', overflow: 'auto'}}>
		<ListGroup fill>{list}</ListGroup>
		</Panel>
	);
    }
}

export { CourseMenu };
