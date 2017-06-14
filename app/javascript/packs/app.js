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
import {BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'

/*** Router ***/
const RouterInst = props => (
	<Router basename="index.html">
	<div>
	<NavbarInst {...props} />

	<Route path={props.nav.courses.route} component={Courses} />
	<Route path={props.nav.abc.route} component={ABC} />
	<Route path={props.nav.assigned.route} component={Assigned} />
	<Route path={props.nav.unassigned.route} component={Unassigned} />
	<Route path={props.nav.summary.route} component={Summary} />
	
	<Route path={props.nav.logout.route} component={Bye} />
	
	</div>
	</Router>
);

/*** Navbar ***/

const NavbarInst = props => (
	<Navbar fixedTop>
	
	<Navbar.Header>
	<Navbar.Brand>TAPP</Navbar.Brand>
	</Navbar.Header>
	
    	<Nav pullLeft onSelect={props.nav.handleSelectTab}>
	<NavItem eventKey={props.nav.courses.key}>
	<NavLink to={props.nav.courses.route}>{props.nav.courses.label}</NavLink>
	</NavItem>
	<NavItem eventKey={props.nav.abc.key}>
	<NavLink to={props.nav.abc.route}>{props.nav.abc.label}</NavLink>
	</NavItem>
	<NavItem eventKey={props.nav.assigned.key}>
	<NavLink to={props.nav.assigned.route}>{props.nav.assigned.label}</NavLink>
	</NavItem>
	<NavItem eventKey={props.nav.unassigned.key}>
	<NavLink to={props.nav.unassigned.route}>{props.nav.unassigned.label}</NavLink>
	</NavItem>
	<NavItem eventKey={props.nav.summary.key}>
	<NavLink to={props.nav.summary.route}>{props.nav.summary.label}</NavLink>
	</NavItem>
	</Nav>

	<Nav pullRight>
	<NavDropdown eventKey={props.nav.logout.key} title={props.nav.logout.role + ":" + props.nav.logout.user}
    id="nav-dropdown">
	<MenuItem eventKey={props.nav.logout.key + ".1"}>
	<NavLink to={props.nav.logout.route}>Logout</NavLink>
	</MenuItem>
	</NavDropdown>
	</Nav>
	
    </Navbar>
);

const Courses = props => <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Courses!</h1></div>;

const ABC = props => <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Applicants by Courses!</h1></div>;

const Assigned = props => <div className="container-fluid" style={{paddingTop: "70px"}}><h1>All Assigned!</h1></div>;

const Unassigned = props => <div className="container-fluid" style={{paddingTop: "70px"}}><h1>All Unassigned!</h1></div>;

const Summary = props => <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Summary!</h1></div>;

const Bye = props => <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Bye!</h1></div>;


let AppState = {
    // navbar-related props
    nav: {
	courses: {
	    key: "1",
	    label: "Courses",
	    route: "/courses",
	},
	abc: {
	    key: "2",
	    label: "Applicants by Course",
	    route: "/applicantsbycourse",
	},
	assigned: {
	    key: "3",
	    label: "All Assigned",
	    route: "/assigned",
	},
	unassigned: {
	    key: "4",
	    label: "All Unassigned",
	    route: "/unassigned",
	},
	summary: {
	    key: "5",
	    label: "Summary",
	    route: "/summary",
	},

	logout: {
	    key: "6",
	    route: "/bye",
	    role: "role",
	    user: "user",
	},

	handleSelectTab: (eventKey) => null,
    },

};

const AppView = props => <RouterInst {...props} />;

class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = AppState;
    }

    render() {
	return <AppView {...this.state}/>;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
	<App />,
	document.getElementById('root'),
    )
})
