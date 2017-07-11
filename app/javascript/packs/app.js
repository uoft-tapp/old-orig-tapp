/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import '../app-styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, Badge } from 'react-bootstrap';

import { appState } from '../app/appState.js';
import { fetchAll } from '../app/fetch.js';

import { Courses } from '../app/components/courses.js';
import { ABC } from '../app/components/abc.js';
import { Assigned } from '../app/components/assigned.js';
import { Unassigned } from '../app/components/unassigned.js';
import { Summary } from '../app/components/summary.js';
import { Applicant } from '../app/components/applicant.js';

/*** Main app component ***/

class App extends React.Component {
    constructor(props) {
        super(props);

        // start fetching data
        fetchAll();
    }

    componentDidMount() {
        appState.subscribe(this.forceUpdate.bind(this, null));
    }

    render() {
        return <RouterInst func={appState} />;
    }
}

const navConfig = {
    courses: {
        route: '/courses',
        key: '1',
    },
    abc: {
        route: '/applicantsbycourse',
        key: '2',
    },
    assigned: {
        route: '/assigned',
        key: '3',
    },
    unassigned: {
        route: '/unassigned',
        key: '4',
    },
    summary: {
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

/*** Router ***/
// temporary logout "view"
const Bye = props =>
    <div className="container-fluid" style={{ paddingTop: '70px' }}>
        <h1>Bye!</h1>
    </div>;

const RouterInst = props =>
    <Router basename="index.html">
        <div>
            <NavbarInst {...props} />

            <Switch>
                <Route
                    path={navConfig.courses.route}
                    render={() => <Courses navKey={navConfig.courses.key} {...props} />}
                />
                <Route
                    path={navConfig.abc.route}
                    render={() => <ABC navKey={navConfig.abc.key} {...props} />}
                />
                <Route
                    path={navConfig.assigned.route}
                    render={() => <Assigned navKey={navConfig.assigned.key} {...props} />}
                />
                <Route
                    path={navConfig.unassigned.route}
                    render={() => <Unassigned navKey={navConfig.unassigned.key} {...props} />}
                />
                <Route
                    path={navConfig.summary.route}
                    render={() => <Summary navKey={navConfig.summary.key} {...props} />}
                />

                <Route path={navConfig.logout.route} render={() => <Bye />} />

                <Route
                    path={navConfig.applicant.route}
                    render={({ match }) =>
                        <Applicant navKey={navConfig.applicant.key} match={match} {...props} />}
                />
            </Switch>
        </div>
    </Router>;

/*** Navbar ***/

const NavbarInst = props => {
    let selectedApplicant = props.func.getSelectedApplicant();
    let notifications = props.func.getUnreadNotifications();

    return (
        <Navbar fixedTop fluid>
            <Navbar.Header>
                <Navbar.Brand>TAPP</Navbar.Brand>
            </Navbar.Header>

            <Nav
                pullLeft
                activeKey={props.func.getSelectedNavTab()}
                onSelect={eventKey => props.func.selectNavTab(eventKey)}>
                <NavItem eventKey={navConfig.courses.key}>
                    <Link to={navConfig.courses.route}>Courses</Link>
                </NavItem>
                <NavItem eventKey={navConfig.abc.key}>
                    <Link to={navConfig.abc.route}>Applicants by Course</Link>
                </NavItem>
                <NavItem eventKey={navConfig.assigned.key}>
                    <Link to={navConfig.assigned.route}>All Assigned</Link>
                </NavItem>
                <NavItem eventKey={navConfig.unassigned.key}>
                    <Link to={navConfig.unassigned.route}>All Unassigned</Link>
                </NavItem>
                <NavItem eventKey={navConfig.summary.key}>
                    <Link to={navConfig.summary.route}>Summary</Link>
                </NavItem>
                {selectedApplicant &&
                    <NavItem eventKey={navConfig.applicant.key}>
                        {props.func.getApplicantById(selectedApplicant).lastName},&nbsp;
                        {props.func.getApplicantById(selectedApplicant).firstName}
                    </NavItem>}
            </Nav>

            <Nav pullRight>
                <NavDropdown
                    noCaret
                    disabled={notifications.length == 0}
                    title={
                        <span>
                            <i className="fa fa-warning" style={{ fontSize: '16px' }} />&nbsp;{notifications.length}
                        </span>
                    }
                    id="nav-alert-dropdown"
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

                <NavDropdown
                    eventKey={navConfig.logout.key}
                    title={props.func.getCurrentUserRole() + ':' + props.func.getCurrentUserName()}
                    id="nav-auth-dropdown">
                    <MenuItem eventKey={navConfig.logout.key + '.1'}>
                        <Link to={navConfig.logout.route}>Logout</Link>
                    </MenuItem>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
};

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
});
