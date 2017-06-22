import React from 'react'
import _ from 'underscore'
import { Grid, Row, Col, Well } from 'react-bootstrap'
import { CourseMenu } from './courseMenu.js'
import { CoursePane } from './coursePane.js'
import SplitPane from 'react-split-pane/lib/SplitPane'

class ABC extends React.Component {
    mapLayoutToPanes() {
	let activeCount = this.props.courseMenu.selected.length;
	let layout = this.props.abcView.layout;

	switch (activeCount) {
	case 0:
	    return (<Well><p>Nothing here yet!</p>
		    <p>Select one or more courses to start.</p></Well>);

	case 1:
	    return (<div><CoursePane key={layout[0]} course={layout[0]} {...this.props}/></div>);
	
	case 2:
	    return (
		    <SplitPane split={layout.length == 1 ? "horizontal" : "vertical"} defaultSize="50%"
		resizerStyle={{background:'red',width:'3px'}}>
		    {this.props.courseMenu.selected.map(
			courseCode => <CoursePane key={courseCode} course={courseCode} {...this.props}/>
		    )}
		</SplitPane>
	    );

	case 3:
	    return null;
	    break;

	case 4:
	    return (
		    <SplitPane split="horizontal" defaultSize="50%"
		resizerStyle={{background:'red',width:'3px'}}>
		    
		    <SplitPane split="vertical" defaultSize="50%"
		resizerStyle={{background:'red',width:'3px'}}>
		    {this.props.abcView.layout[0].map(
			courseCode => <CoursePane key={courseCode} course={courseCode} {...this.props}/>
		    )}
		</SplitPane>

		    <SplitPane split="vertical" defaultSize="50%"
		resizerStyle={{background:'red',width:'3px'}}>
		    {this.props.abcView.layout[1].map(
			courseCode => <CoursePane key={courseCode} course={courseCode} {...this.props}/>
		    )}
		</SplitPane>
		    
		</SplitPane>
	    );
	}
    }

    render() {	
	return (
		<div>
		<SplitPane split="vertical" defaultSize="13em">
		<CourseMenu key={"courseMenu"} toggleCoursePanel={this.props.abcView.toggleCoursePanel}
		  {...this.props.courseMenu}/>
		{this.mapLayoutToPanes()}
	    </SplitPane>
		</div>
	);
    }

    selectThisTab() {
	this.props.nav.selectTab(this.props.nav.abc.key);
    }
    
    componentDidMount() {
	this.selectThisTab();
    }

    componentDidUpdate() {	
	this.selectThisTab();
    }
}

export { ABC };
/*
		<Grid fluid><Row>
		<Col xs={2}>
		<CourseMenu key={"courseMenu"} toggleCoursePanel={this.props.abcView.toggleCoursePanel}
	    {...this.props.courseMenu}/>
		</Col>
		<Col xs={10}>

<CoursePane key={courseCode} course={courseCode} {...this.props}/>
		</Col>
		</Row></Grid>
*/
