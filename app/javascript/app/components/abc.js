import React from 'react'
import _ from 'underscore'
import { Grid, Row, Col, Well } from 'react-bootstrap'
import { CourseMenu } from './courseMenu.js'
import { CoursePane } from './coursePane.js'
import SplitPane from 'react-split-pane/lib/SplitPane'

class ABC extends React.Component {
    mapLayoutToPanes() {
	let active = this.props.courseMenu.selected;
	let activeCount = active.length;
	let layout = this.props.abcView.layout;

	switch (activeCount) {
	case 0:
	    return (<Well><p>Nothing here yet!</p>
		    <p>Select one or more courses to start.</p></Well>);

	case 1:
	    return (<div><CoursePane key={layout[0]} course={layout[0]} {...this.props}/></div>);
	
	case 2:
	    let course1, course2;
	    if (layout.length == 1)
		course1 = layout[0][0], course2 = layout[0][1];
	    else
		course1 = layout[0], course2 = layout[1];
	    
	    return (
		    <SplitPane split={layout.length == 1 ? "horizontal" : "vertical"} defaultSize="50%"
		resizerStyle={{background:'red',width:'3px'}}>
		    <CoursePane key={course1} course={course1} {...this.props}/>
		    <CoursePane key={course2} course={course2} {...this.props}/>
		</SplitPane>
	    );

	case 3:
	    if (layout.length == 1)
		return (
			<SplitPane split="horizontal" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			<CoursePane key={layout[0][0]} course={layout[0][0]} {...this.props}/>
			<SplitPane split="horizontal" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			<CoursePane key={layout[0][1]} course={layout[0][1]} {...this.props}/>
			<CoursePane key={layout[0][2]} course={layout[0][2]} {...this.props}/>
			</SplitPane>
			</SplitPane>
		);

	    if (layout.length == 2) {
		if (layout[0].length == 1)
		    return (
			    <SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <CoursePane key={layout[0]} course={layout[0]} {...this.props}/>
			    <SplitPane split="horizontal" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <CoursePane key={layout[1][0]} course={layout[1][0]} {...this.props}/>
			    <CoursePane key={layout[1][1]} course={layout[1][1]} {...this.props}/>
			    </SplitPane>
			    </SplitPane>
		    );

		if (layout[1].length == 1)
		    return (
			    <SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <SplitPane split="horizontal" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <CoursePane key={layout[0][0]} course={layout[0][0]} {...this.props}/>
			    <CoursePane key={layout[0][1]} course={layout[0][1]} {...this.props}/>
			    </SplitPane>
			    <CoursePane key={layout[1]} course={layout[1]} {...this.props}/>
			    </SplitPane>
		    );

		if (layout[0][0] == layout[1][0])
		    return (
			    <SplitPane split="horizontal" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <CoursePane key={layout[0][0]} course={layout[0][0]} {...this.props}/>
			    <SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <CoursePane key={layout[0][1]} course={layout[0][1]} {...this.props}/>
			    <CoursePane key={layout[1][1]} course={layout[1][1]} {...this.props}/>
			    </SplitPane>
			    </SplitPane>
		    );

		if (layout[0][1] == layout[1][1])
		    return (
			    <SplitPane split="horizontal" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			    <CoursePane key={layout[0][0]} course={layout[0][0]} {...this.props}/>
			    <CoursePane key={layout[1][0]} course={layout[1][0]} {...this.props}/>
			    </SplitPane>
			    <CoursePane key={layout[0][1]} course={layout[0][1]} {...this.props}/>
			    </SplitPane>
		    );

	    }

	    if (layout.length == 3){
		return (
			<SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			<CoursePane key={layout[0]} course={layout[0]} {...this.props}/>
			<SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
			<CoursePane key={layout[1]} course={layout[1]} {...this.props}/>
			<CoursePane key={layout[2]} course={layout[2]} {...this.props}/>
			</SplitPane>
			</SplitPane>
		);}
	
	    break;

	case 4:
	    return (
		    <SplitPane split="horizontal" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
		    
		    <SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
		    <CoursePane key={layout[0][0]} course={layout[0][0]} {...this.props}/>
		    <CoursePane key={layout[0][1]} course={layout[0][1]} {...this.props}/>
		    </SplitPane>

		    <SplitPane split="vertical" defaultSize="50%" resizerStyle={{background:'red',width:'3px'}}>
		    <CoursePane key={layout[1][0]} course={layout[1][0]} {...this.props}/>
		    <CoursePane key={layout[1][1]} course={layout[1][1]} {...this.props}/>
		    </SplitPane>
		    
		</SplitPane>
	    );
	}
    }

    render() {
	return (
		<div>
		<SplitPane split="vertical" defaultSize="14em">
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
