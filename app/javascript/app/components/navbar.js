import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

/*** Navbar ABC view layout icons ***/
import img20 from '../img/layout-20.png';
import img21 from '../img/layout-21.png';
import img30 from '../img/layout-30.png';
import img31 from '../img/layout-31.png';
import img32 from '../img/layout-32.png';
import img33 from '../img/layout-33.png';
import img34 from '../img/layout-34.png';
import img35 from '../img/layout-35.png';

/*** Navbar configuration ***/

const config = {
    courses: {
        label: 'Courses',
        route: '/courses',
        key: '1',
    },
    abc: {
        label: 'Applicants By Course',
        route: '/applicantsbycourse',
        key: '2',
    },
    assigned: {
        label: 'All Assigned',
        route: '/assigned',
        key: '3',
    },
    unassigned: {
        label: 'All Unassigned',
        route: '/unassigned',
        key: '4',
    },
    summary: {
        label: 'Summary',
        route: '/summary',
        key: '5',
    },
    applicant: {
        route: '/applicant/:id',
        key: '6',
    },
    logout: {
        route: '/bye',
        key: '7',
    },
};

/*** Navbar components ***/

const ViewTabs = props => {
    let selectedApplicant = props.func.getSelectedApplicant();

    return (
        <Nav
            pullLeft
            activeKey={props.selectedTab}
            onSelect={eventKey => props.func.selectNavTab(eventKey)}>
            <NavItem eventKey={config.courses.key}>
                <Link to={config.courses.route}>Courses</Link>
            </NavItem>
            <NavItem eventKey={config.abc.key}>
                <Link to={config.abc.route}>Applicants by Course</Link>
            </NavItem>
            <NavItem eventKey={config.assigned.key}>
                <Link to={config.assigned.route}>All Assigned</Link>
            </NavItem>
            <NavItem eventKey={config.unassigned.key}>
                <Link to={config.unassigned.route}>All Unassigned</Link>
            </NavItem>
            <NavItem eventKey={config.summary.key}>
                <Link to={config.summary.route}>Summary</Link>
            </NavItem>
            {selectedApplicant &&
                <NavItem eventKey={config.applicant.key}>
                    {props.func.getApplicantById(selectedApplicant).lastName},&nbsp;
                    {props.func.getApplicantById(selectedApplicant).firstName}
                </NavItem>}
        </Nav>
    );
};

const CoursePanelLayoutTabs = props => {
    if (props.selectedTab != config.abc.key) {
        return null;
    }

    if ([20, 21].includes(props.layout)) {
        return (
            <Nav
                bsStyle="pills"
                onSelect={eventKey => props.func.setCoursePanelLayoutById(eventKey)}>
                <NavItem eventKey={20}>
                    <img src={img20} alt="layout-20" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={21}>
                    <img src={img21} alt="layout-21" style={{ height: '16px' }} />
                </NavItem>
            </Nav>
        );
    }

    if ([30, 31, 32, 33, 34, 35].includes(props.layout)) {
        return (
            <Nav
                bsStyle="pills"
                onSelect={eventKey => props.func.setCoursePanelLayoutById(eventKey)}>
                <NavItem eventKey={30}>
                    <img src={img30} alt="layout-30" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={31}>
                    <img src={img31} alt="layout-31" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={32}>
                    <img src={img32} alt="layout-32" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={33}>
                    <img src={img33} alt="layout-33" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={34}>
                    <img src={img34} alt="layout-34" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={35}>
                    <img src={img35} alt="layout-35" style={{ height: '16px' }} />
                </NavItem>
            </Nav>
        );
    }

    return null;
};

const Notifications = props => {
    let notifications = props.func.getUnreadNotifications();

    return (
        <NavDropdown
            noCaret
            disabled={notifications.length == 0}
            title={
                <span>
                    <i className="fa fa-bell-o" style={{ fontSize: '16px' }} />&nbsp;{notifications.length}
                </span>
            }
            id="nav-notif-dropdown"
            onToggle={willOpen => {
                if (!willOpen) {
                    props.func.readNotifications();
                }
            }}>
            {notifications.map((text, i) =>
                <MenuItem key={'notification-' + i}>
                    {text}
                </MenuItem>
            )}
        </NavDropdown>
    );
};

const Auth = props => {
    return (
        <NavDropdown
            eventKey={config.logout.key}
            title={props.func.getCurrentUserRole() + ':' + props.func.getCurrentUserName()}
            id="nav-auth-dropdown">
            <MenuItem eventKey={config.logout.key + '.1'}>
                <Link to={config.logout.route}>Logout</Link>
            </MenuItem>
        </NavDropdown>
    );
};

/*** Navbar ***/

const NavbarInst = props => {
    let selectedTab = props.func.getSelectedNavTab();

    // used to populate the layout menu in the ABC view
    let selectedLayout = props.func.getCoursePanelLayoutAsId();

    return (
        <Navbar fixedTop fluid>
            <Navbar.Header>
                <Navbar.Brand>TAPP</Navbar.Brand>
            </Navbar.Header>

            <ViewTabs selectedTab={selectedTab} {...props} />

            <Nav pullRight activeKey={selectedLayout}>
                <CoursePanelLayoutTabs
                    selectedTab={selectedTab}
                    layout={selectedLayout}
                    {...props}
                />
                <Notifications {...props} />
                <Auth {...props} />
            </Nav>
        </Navbar>
    );
};

export { NavbarInst as Navbar, config as navConfig };
