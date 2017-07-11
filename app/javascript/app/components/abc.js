import React from 'react';
import { Grid, Row, Col, Well } from 'react-bootstrap';
import { CourseMenu } from './courseMenu.js';
import { CoursePanel } from './coursePanel.js';
import SplitPane from 'react-split-pane/lib/SplitPane';

class ABC extends React.Component {
    mapLayoutToPanels() {
        let selected = this.props.func.getSelectedCourses();
        let selectedCount = selected.length;
        let layout = this.props.func.getCoursePanelLayout();

        let panelProps = { defaultSize: '50%', panelStyle: { margin: '2px' }, maxSize: -10 };

        switch (selectedCount) {
            case 0:
                return (
                    <Well id="no-courses-well">
                        <p>Nothing here yet!</p>
                        <p>Select one or more courses to start.</p>
                    </Well>
                );

            case 1:
                return (
                    <div>
                        <CoursePanel key={layout[0]} course={layout[0]} {...this.props} />
                    </div>
                );

            case 2:
                let course1, course2, orient;
                if (layout.length == 1) {
                    (course1 = layout[0][0]), (course2 = layout[0][1]);
                    orient = 'horizontal';
                } else {
                    (course1 = layout[0]), (course2 = layout[1]);
                    orient = 'vertical';
                }

                return (
                    <SplitPane split={orient} {...panelProps}>
                        <CoursePanel key={course1} course={course1} {...this.props} />
                        <CoursePanel key={course2} course={course2} {...this.props} />
                    </SplitPane>
                );

            case 3:
                if (layout.length == 1) {
                    return (
                        <SplitPane split="horizontal" {...panelProps}>
                            <CoursePanel key={layout[0][0]} course={layout[0][0]} {...this.props} />
                            <SplitPane split="horizontal" {...panelProps}>
                                <CoursePanel
                                    key={layout[0][1]}
                                    course={layout[0][1]}
                                    {...this.props}
                                />
                                <CoursePanel
                                    key={layout[0][2]}
                                    course={layout[0][2]}
                                    {...this.props}
                                />
                            </SplitPane>
                        </SplitPane>
                    );
                }

                if (layout.length == 2) {
                    if (layout[0].length == 1) {
                        return (
                            <SplitPane split="vertical" {...panelProps}>
                                <CoursePanel key={layout[0]} course={layout[0]} {...this.props} />
                                <SplitPane split="horizontal" {...panelProps}>
                                    <CoursePanel
                                        key={layout[1][0]}
                                        course={layout[1][0]}
                                        {...this.props}
                                    />
                                    <CoursePanel
                                        key={layout[1][1]}
                                        course={layout[1][1]}
                                        {...this.props}
                                    />
                                </SplitPane>
                            </SplitPane>
                        );
                    }

                    if (layout[1].length == 1) {
                        return (
                            <SplitPane split="vertical" {...panelProps}>
                                <SplitPane split="horizontal" {...panelProps}>
                                    <CoursePanel
                                        key={layout[0][0]}
                                        course={layout[0][0]}
                                        {...this.props}
                                    />
                                    <CoursePanel
                                        key={layout[0][1]}
                                        course={layout[0][1]}
                                        {...this.props}
                                    />
                                </SplitPane>
                                <CoursePanel key={layout[1]} course={layout[1]} {...this.props} />
                            </SplitPane>
                        );
                    }

                    if (layout[0][0] == layout[1][0]) {
                        return (
                            <SplitPane split="horizontal" {...panelProps}>
                                <CoursePanel
                                    key={layout[0][0]}
                                    course={layout[0][0]}
                                    {...this.props}
                                />
                                <SplitPane split="vertical" {...panelProps}>
                                    <CoursePanel
                                        key={layout[0][1]}
                                        course={layout[0][1]}
                                        {...this.props}
                                    />
                                    <CoursePanel
                                        key={layout[1][1]}
                                        course={layout[1][1]}
                                        {...this.props}
                                    />
                                </SplitPane>
                            </SplitPane>
                        );
                    }

                    if (layout[0][1] == layout[1][1]) {
                        return (
                            <SplitPane split="horizontal" {...panelProps}>
                                <SplitPane split="vertical" {...panelProps}>
                                    <CoursePanel
                                        key={layout[0][0]}
                                        course={layout[0][0]}
                                        {...this.props}
                                    />
                                    <CoursePanel
                                        key={layout[1][0]}
                                        course={layout[1][0]}
                                        {...this.props}
                                    />
                                </SplitPane>
                                <CoursePanel
                                    key={layout[0][1]}
                                    course={layout[0][1]}
                                    {...this.props}
                                />
                            </SplitPane>
                        );
                    }
                }

                if (layout.length == 3) {
                    return (
                        <SplitPane split="vertical" {...panelProps}>
                            <CoursePanel key={layout[0]} course={layout[0]} {...this.props} />
                            <SplitPane split="vertical" {...panelProps}>
                                <CoursePanel key={layout[1]} course={layout[1]} {...this.props} />
                                <CoursePanel key={layout[2]} course={layout[2]} {...this.props} />
                            </SplitPane>
                        </SplitPane>
                    );
                }
                break;

            case 4:
                return (
                    <SplitPane split="horizontal" {...panelProps}>
                        <SplitPane split="vertical" {...panelProps}>
                            <CoursePanel key={layout[0][0]} course={layout[0][0]} {...this.props} />
                            <CoursePanel key={layout[0][1]} course={layout[0][1]} {...this.props} />
                        </SplitPane>

                        <SplitPane split="vertical" {...panelProps}>
                            <CoursePanel key={layout[1][0]} course={layout[1][0]} {...this.props} />
                            <CoursePanel key={layout[1][1]} course={layout[1][1]} {...this.props} />
                        </SplitPane>
                    </SplitPane>
                );
        }
    }

    render() {
        return (
            <SplitPane
                split="vertical"
                defaultSize="14em"
                allowResize={false}
                pane1Style={{ margin: '0 1vw' }}
                pane2Style={{ marginRight: '1vw' }}
                resizerStyle={{ display: 'none' }}>
                <CourseMenu key={'courseMenu'} {...this.props} />
                {this.mapLayoutToPanels()}
            </SplitPane>
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
