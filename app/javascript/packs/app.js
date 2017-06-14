/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import '../app-styles'

import React from 'react'
import ReactDOM from 'react-dom'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'

/*** Navbar ***/

const NavbarInst = props => (
	<Navbar fixedTop>
	
	<Navbar.Header>
	<Navbar.Brand>TAPP</Navbar.Brand>
	</Navbar.Header>
	
    	<Nav pullLeft onSelect={props.nav.handleSelectTab}>
	<NavItem eventKey={props.nav.courses.key} href={props.nav.courses.route}>
	{props.nav.courses.label}
    </NavItem>
	<NavItem eventKey={props.nav.abc.key} href={props.nav.abc.route}>
	{props.nav.abc.label}
    </NavItem>
	<NavItem eventKey={props.nav.assigned.key} href={props.nav.assigned.route}>
	{props.nav.assigned.label}
    </NavItem>
	<NavItem eventKey={props.nav.unassigned.key} href={props.nav.unassigned.route}>
	{props.nav.unassigned.label}
    </NavItem>
	<NavItem eventKey={props.nav.summary.key} href={props.nav.summary.route}>
	{props.nav.summary.label}
    </NavItem>
	</Nav>

	<Nav pullRight>
	<NavDropdown eventKey={props.nav.logout.key}
    title={props.nav.logout.role + ":" + props.nav.logout.user} id="nav-dropdown">
	<MenuItem eventKey={props.nav.logout.key + ".1"} href={props.nav.logout.route}>Logout</MenuItem>
	</NavDropdown>
	</Nav>
	
    </Navbar>
);


const AppView = props => (
	<NavbarInst {...props} />
);

function viewRouter(routeKey) {
    switch (routeKey) {


    case "2":
	// applicant by course
	
    }
}

let AppState = {
    // navbar-related props
    nav: {
	courses: {
	    key: "1",
	    label: "Courses",
	    route: "#courses",
	},
	abc: {
	    key: "2",
	    label: "Applicants by Course",
	    route: "#applicantsbycourse",
	},
	assigned: {
	    key: "3",
	    label: "All Assigned",
	    route: "#assigned",
	},
	unassigned: {
	    key: "4",
	    label: "All Unassigned",
	    route: "#unassigned",
	},
	summary: {
	    key: "5",
	    label: "Summary",
	    route: "#summary",
	},

	logout: {
	    key: "6",
	    route: "#",
	    role: "role",
	    user: "user",
	},

	handleSelectTab: viewRouter,
    },

};

class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = AppState;
    }

    render() {
	return <AppView {...this.state} />;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
	<App />,
	document.getElementById('root'),
    )
})
