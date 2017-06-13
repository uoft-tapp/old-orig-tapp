import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import GoldenLayout from 'golden-layout'

var coursesLayout = new GoldenLayout({
    content: [{
        type: 'column',
	content: [{
	    type: 'react-component',
	    component: 'test1',
	    props: { courseCode: 'CSC108H1' }
        },  
	{ type: 'react-component',
	    component: 'test2',
	    props: { courseCode: 'CSC148H1' }
        }]
    }]
},
document.body.appendChild(document.createElement('div')));

var CoursePane = React.createClass({	
    render: function() {
    	    return <h1>{this.props.courseCode}</h1>
    }
});

coursesLayout.registerComponent('test1', CoursePane);
coursesLayout.registerComponent('test2', CoursePane);

coursesLayout.init();