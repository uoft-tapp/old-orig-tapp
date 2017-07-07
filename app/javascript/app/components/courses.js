import React from 'react';
import ReactDOM from 'react-dom';
import { CourseList } from './courseList.js';
import { CourseForm } from './courseForm.js';

class Courses extends React.Component {
    render() {
        return (
            <div className="container-fluid" style={{ width: '100vw' }}>
                <CourseList {...this.props} />
                <CourseForm {...this.props} />
            </div>
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

export { Courses };
