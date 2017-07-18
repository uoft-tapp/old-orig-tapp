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
    return (
        <Nav pullLeft activeKey={props.func.getSelectedNavTab()}>
            <NavItem eventKey={routeConfig.courses.key} href={routeConfig.courses.route}>
                Courses
            </NavItem>
            <NavItem eventKey={routeConfig.abc.key} href={routeConfig.abc.route}>
                Applicants by Course
            </NavItem>
            <NavItem eventKey={routeConfig.assigned.key} href={routeConfig.assigned.route}>
                All Assigned
            </NavItem>
            <NavItem eventKey={routeConfig.unassigned.key} href={routeConfig.unassigned.route}>
                All Unassigned
            </NavItem>
            <NavItem eventKey={routeConfig.summary.key} href={routeConfig.summary.route}>
                Summary
            </NavItem>
        </Nav>
    );
};

const CoursePanelLayoutTabs = props => {
    let layout = props.func.getCoursePanelLayout();

    if ([2, 2.1].includes(layout)) {
        return (
            <Nav
                bsStyle="pills"
                activeKey={layout}
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

    if ([3, 3.1, 3.2, 3.3, 3.4, 3.5].includes(layout)) {
        return (
            <Nav
                bsStyle="pills"
                activeKey={layout}
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
            <MenuItem eventKey={routeConfig.logout.key + '.1'} href={routeConfig.logout.route}>
                Logout
            </MenuItem>
        </NavDropdown>
    );
};

/*** Navbar ***/

const NavbarInst = props => {
    return (
        <Navbar fixedTop fluid>
            <Navbar.Header>
                <Navbar.Brand>TAPP</Navbar.Brand>
            </Navbar.Header>

            <ViewTabs {...props} />

            <Nav pullRight>
                {props.func.getSelectedNavTab() == routeConfig.abc.key &&
                    <CoursePanelLayoutTabs {...props} />}
                <Notifications {...props} />
                <Auth {...props} />
            </Nav>
        </Navbar>
    );
};

export { NavbarInst as Navbar };
