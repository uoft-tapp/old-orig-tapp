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

const ViewTab = props =>
    <li role="presentation" className={props.activeKey == props.id ? 'active' : ''}>
        <Link to={props.route} className="navbar-link">
            {props.label}
        </Link>
    </li>;

const ViewTabs = props => {
    let activeKey = props.getSelectedNavTab();

    return (
        <ul className="nav navbar-nav navbar-left">
            <ViewTab activeKey={activeKey} {...routeConfig.courses} />
            <ViewTab activeKey={activeKey} {...routeConfig.abc} />
            <ViewTab activeKey={activeKey} {...routeConfig.assigned} />
            <ViewTab activeKey={activeKey} {...routeConfig.unassigned} />
            <ViewTab activeKey={activeKey} {...routeConfig.summary} />
        </ul>
    );
};

const CoursePanelLayoutTabs = props => {
    let layout = props.getCoursePanelLayout();

    if ([2, 2.1].includes(layout)) {
        return (
            <Nav
                bsStyle="pills"
                activeKey={layout}
                onSelect={eventKey => props.setCoursePanelLayout(eventKey)}>
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
                onSelect={eventKey => props.setCoursePanelLayout(eventKey)}>
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

const Round = props => {
    if (props.isCoursesListNull() || props.fetchingCourses()) {
        return null;
    }

    let selectedRound = props.getSelectedRound();

    return (
        <NavDropdown
            title={
                <span
                    style={{
                        color: '#fff',
                        backgroundColor: '#5bc0de',
                        padding: '6px 12px',
                        borderRadius: '4px',
                    }}>
                    {selectedRound ? 'Round ' + selectedRound : 'All Rounds'}
                </span>
            }
            noCaret
            id="nav-round-dropdown"
            onSelect={eventKey => props.selectRound(eventKey)}>
            {selectedRound &&
                <MenuItem eventKey={null} key="all">
                    All Rounds
                </MenuItem>}
            {props.getRounds().map(
                round =>
                    round != selectedRound &&
                    <MenuItem eventKey={round} key={round}>
                        Round {round}
                    </MenuItem>
            )}
        </NavDropdown>
    );
};

const Notifications = props => {
    let notifications = props.getUnreadNotifications();

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
                    props.readNotifications();
                }
            }}>
            {notifications.map((text, i) =>
                <MenuItem key={'notification-' + i} dangerouslySetInnerHTML={{ __html: text }} />
            )}
        </NavDropdown>
    );
};

const Auth = props =>
    <NavDropdown
        eventKey={routeConfig.logout.id}
        title={props.getCurrentUserRole() + ':' + props.getCurrentUserName()}
        id="nav-auth-dropdown">
        <MenuItem eventKey={routeConfig.logout.id + '.1'} href={routeConfig.logout.route}>
            Logout
        </MenuItem>
    </NavDropdown>;

/*** Navbar ***/

const NavbarInst = props =>
    <Navbar fixedTop fluid>
        <Navbar.Header>
            <Navbar.Brand>TAPP</Navbar.Brand>
        </Navbar.Header>

        <ViewTabs {...props} />

        <Nav pullRight>
            {props.getSelectedNavTab() == routeConfig.abc.id &&
                <CoursePanelLayoutTabs {...props} />}
            <Round {...props} />
            <Notifications {...props} />
            <Auth {...props} />
        </Nav>
    </Navbar>;

export { NavbarInst as Navbar };
