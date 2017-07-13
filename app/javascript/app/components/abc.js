import React from 'react';
import { Grid, Row, Col, Well } from 'react-bootstrap';
import { CourseMenu } from './courseMenu.js';
import { CoursePanel } from './coursePanel.js';

class ABC extends React.Component {
    mapLayoutToPanels() {
        let selected = this.props.func.getSelectedCourses();
        let layout = this.props.func.getCoursePanelLayout();

        let course1, course2, course3, course4, panel1style, panel2style, panel3style, panel4style;

        switch (selected.length) {
            case 0:
                return 0;

            case 1:
                course1 = layout[0];
                panel1style = { height: '100%', width: '100%' };
                break;

            case 2:
                if (layout.length == 1) {
                    // stacked
                    (course1 = layout[0][0]), (course2 = layout[0][1]);
                    panel1style = panel2style = { height: '50%', width: '100%' };
                } else {
                    // side-by-side
                    (course1 = layout[0]), (course2 = layout[1]);
                    panel1style = panel2style = { height: '100%', width: '50%' };
                }
                break;

            case 3:
                if (layout.length == 1) {
                    // stacked
                    [course1, course2, course3] = layout[0];

                    panel1style = panel2style = panel3style = {
                        height: 'calc(100%/3)',
                        width: '100%',
                    };
                } else if (layout.length == 2) {
                    if (layout[0].length == 1) {
                        // 1 panel left, 2 stacked panels right
                        [course1, [course2, course3]] = layout;

                        panel1style = { height: '100%', width: '50%' };
                        panel2style = panel3style = { height: '50%', width: '50%' };
                    } else if (layout[1].length == 1) {
                        // 2 stacked panels left, 1 panel right
                        [[course1, course2], course3] = layout;

                        panel1style = panel2style = { height: '50%', width: '50%' };
                        panel3style = { height: '100%', width: '50%' };
                    } else if (layout[0][0] == layout[1][0]) {
                        // 1 panel on top, 2 side-by-side panels on bottom
                        [[course1, course2], [_, course3]] = layout;

                        panel1style = { height: '50%', width: '100%' };
                        panel2style = panel3style = { height: '50%', width: '50%' };
                    } else if (layout[0][1] == layout[1][1]) {
                        // 2 side-by-side panels on top, 1 panel on bottom
                        [[course1, course3], [course2, _]] = layout;

                        panel1style = panel2style = { height: '50%', width: '50%' };
                        panel3style = { height: '50%', width: '100%' };
                    }
                } else if (layout.length == 3) {
                    // side-by-side
                    [course1, course2, course3] = layout;
                    panel1style = panel2style = panel3style = {
                        height: '100%',
                        width: 'calc(100%/3)',
                    };
                }
                break;

            case 4:
                [[course1, course2], [course3, course4]] = layout;
                panel1style = panel2style = panel3style = panel4style = {
                    height: '50%',
                    width: '50%',
                };
                break;
        }

        return {
            course1: course1,
            course2: course2,
            course3: course3,
            course4: course4,
            panel1style: panel1style,
            panel2style: panel2style,
            panel3style: panel3style,
            panel4style: panel4style,
        };
    }

    render() {
        let layout = this.mapLayoutToPanels();

        return (
            <Grid fluid id="abc-grid">
                <CourseMenu {...this.props} />
                <div id="course-panel-layout">
                    {layout == 0 &&
                        <Well id="no-courses-well">
                            <p>Nothing here yet!</p>
                            <p>Select one or more courses to start.</p>
                        </Well>}
                    {layout.course1 &&
                        <CoursePanel
                            key="course-panel-1"
                            panelStyle={layout.panel1style}
                            course={layout.course1}
                            {...this.props}
                        />}
                    {layout.course2 &&
                        <CoursePanel
                            key="course-panel-2"
                            panelStyle={layout.panel2style}
                            course={layout.course2}
                            {...this.props}
                        />}
                    {layout.course3 &&
                        <CoursePanel
                            key="course-panel-3"
                            panelStyle={layout.panel3style}
                            course={layout.course3}
                            {...this.props}
                        />}
                    {layout.course4 &&
                        <CoursePanel
                            key="course-panel-4"
                            panelStyle={layout.panel4style}
                            course={layout.course4}
                            {...this.props}
                        />}
                </div>
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

export { ABC };
