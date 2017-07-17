import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { routeConfig } from '../routeConfig.js';

/*** Navbar ABC view layout icons ***/
import img20 from '../img/layout-20.png';
import img21 from '../img/layout-21.png';
import img30 from '../img/layout-30.png';
import img31 from '../img/layout-31.png';
import img32 from '../img/layout-32.png';
import img33 from '../img/layout-33.png';
import img34 from '../img/layout-34.png';
import img35 from '../img/layout-35.png';

/*** Navbar components ***/

const ViewTabs = props => {
    let selectedApplicant = props.func.getSelectedApplicant();

    return (
        <Nav
            pullLeft
            activeKey={props.selectedTab}
            onSelect={eventKey => props.func.selectNavTab(eventKey)}>
            <NavItem eventKey={routeConfig.courses.key}>
                <Link to={routeConfig.courses.route}>Courses</Link>
            </NavItem>
            <NavItem eventKey={routeConfig.abc.key}>
                <Link to={routeConfig.abc.route}>Applicants by Course</Link>
            </NavItem>
            <NavItem eventKey={routeConfig.assigned.key}>
                <Link to={routeConfig.assigned.route}>All Assigned</Link>
            </NavItem>
            <NavItem eventKey={routeConfig.unassigned.key}>
                <Link to={routeConfig.unassigned.route}>All Unassigned</Link>
            </NavItem>
            <NavItem eventKey={routeConfig.summary.key}>
                <Link to={routeConfig.summary.route}>Summary</Link>
            </NavItem>
            {selectedApplicant &&
                <NavItem eventKey={routeConfig.applicant.key}>
                    {props.func.getApplicantById(selectedApplicant).lastName},&nbsp;
                    {props.func.getApplicantById(selectedApplicant).firstName}
                </NavItem>}
        </Nav>
    );
};

const CoursePanelLayoutTabs = props => {
    if (props.selectedTab != routeConfig.abc.key) {
        return null;
    }

    if ([2, 2.1].includes(props.layout)) {
        return (
            <Nav
                bsStyle="pills"
                activeKey={props.layout}
                onSelect={eventKey => props.func.setCoursePanelLayout(eventKey)}>
                <NavItem eventKey={2}>
                    <img src={img20} alt="layout-2.0" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={2.1}>
                    <img src={img21} alt="layout-2.1" style={{ height: '16px' }} />
                </NavItem>
            </Nav>
        );
    }

    if ([3, 3.1, 3.2, 3.3, 3.4, 3.5].includes(props.layout)) {
        return (
            <Nav
                bsStyle="pills"
                activeKey={props.layout}
                onSelect={eventKey => props.func.setCoursePanelLayout(eventKey)}>
                <NavItem eventKey={3}>
                    <img src={img30} alt="layout-3.0" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={3.1}>
                    <img src={img31} alt="layout-3.1" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={3.2}>
                    <img src={img32} alt="layout-3.2" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={3.3}>
                    <img src={img33} alt="layout-3.3" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={3.4}>
                    <img src={img34} alt="layout-3.4" style={{ height: '16px' }} />
                </NavItem>
                <NavItem eventKey={3.5}>
                    <img src={img35} alt="layout-3.5" style={{ height: '16px' }} />
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
            eventKey={routeConfig.logout.key}
            title={props.func.getCurrentUserRole() + ':' + props.func.getCurrentUserName()}
            id="nav-auth-dropdown">
            <MenuItem eventKey={routeConfig.logout.key + '.1'}>
                <Link to={routeConfig.logout.route}>Logout</Link>
            </MenuItem>
        </NavDropdown>
    );
};

/*** Navbar ***/

const NavbarInst = props => {
    let selectedTab = props.func.getSelectedNavTab();

    return (
        <Navbar fixedTop fluid>
            <Navbar.Header>
                <Navbar.Brand>TAPP</Navbar.Brand>
            </Navbar.Header>

            <ViewTabs selectedTab={selectedTab} {...props} />

            <Nav pullRight>
                <CoursePanelLayoutTabs
                    selectedTab={selectedTab}
                    layout={props.func.getCoursePanelLayout()}
                    {...props}
                />
                <Notifications {...props} />
                <Auth {...props} />
            </Nav>
        </Navbar>
    );
};

export { NavbarInst as Navbar };
