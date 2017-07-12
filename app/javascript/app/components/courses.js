import React from 'react';
import ReactDOM from 'react-dom';
import { Grid } from 'react-bootstrap';
import { CourseList } from './courseList.js';
import { CourseForm } from './courseForm.js';

class Courses extends React.Component {
    render() {
        return (
            <Grid fluid id="courses-grid">
                <CourseList {...this.props} />
                <CourseForm {...this.props} />
            </Grid>
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
