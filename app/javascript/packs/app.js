/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import '../app-styles'

import _ from 'underscore'
import Backbone from 'backbone'
import NestedModel from 'backbone-nested'

import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import { appState } from '../app/appState.js'
import { fetchAll } from '../app/fetch.js'

import { Courses } from '../app/components/courses.js'
import { ABC } from '../app/components/abc.js'
import { Assigned } from '../app/components/assigned.js'
import { Unassigned } from '../app/components/unassigned.js'
import { Summary } from '../app/components/summary.js'
import { Applicant } from '../app/components/applicant.js'

/*** Main app component ***/

class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = appState.toJSON();

	this._updateState = this._updateState.bind(this);
	
	_.extend(this, Backbone.Events);

	// start fetching data
	fetchAll();
    }

    _updateState() {
	this.setState(appState.toJSON());
    }

    componentDidMount() {
	appState.bind('change', this._updateState);
    }
    
    render() {
	return <AppView {...this.state}/>;
    }
}

/*** Main app view component ***/

const AppView = props => <RouterInst {...props} />;

/*** Router ***/
// temporary logout "view"
const Bye = props => <div className="container-fluid" style={{paddingTop: "70px"}}><h1>Bye!</h1></div>;

const RouterInst = props => (
	<Router basename="index.html">
	<div>
	<NavbarInst {...props} />

	<Switch>
	<Route path={props.nav.courses.route} render={() => <Courses {...props}/>} />
	<Route path={props.nav.abc.route} render={() => <ABC {...props}/>} />
	<Route path={props.nav.assigned.route} render={() => <Assigned {...props}/>} />
	<Route path={props.nav.unassigned.route} render={() => <Unassigned {...props}/>} />
	<Route path={props.nav.summary.route} render={() => <Summary {...props}/>} />
    
	<Route path={props.nav.logout.route} render={() => <Bye/>} />

    	<Route path={props.nav.applicant.route} render={({ match }) => <Applicant {...props} match={match}/>} />
	</Switch>
    
	</div>
	</Router>
);

/*** Navbar ***/

const NavbarInst = props => (
	<Navbar fixedTop fluid>
	
	<Navbar.Header>
	<Navbar.Brand>TAPP</Navbar.Brand>
	</Navbar.Header>
	
    	<Nav pullLeft activeKey={props.nav.selectedTab} onSelect={props.nav.handleSelectTab}>

	<NavItem eventKey={props.nav.courses.key}>
	<Link id={"link" + props.nav.courses.key} to={props.nav.courses.route}>{props.nav.courses.label}</Link>
	</NavItem>
	<NavItem eventKey={props.nav.abc.key}>
	<Link id={"link" + props.nav.abc.key} to={props.nav.abc.route}>{props.nav.abc.label}</Link>
	</NavItem>
	<NavItem eventKey={props.nav.assigned.key}>
	<Link to={props.nav.assigned.route}>{props.nav.assigned.label}</Link>
	</NavItem>
	<NavItem eventKey={props.nav.unassigned.key}>
	<Link to={props.nav.unassigned.route}>{props.nav.unassigned.label}</Link>
	</NavItem>
	<NavItem eventKey={props.nav.summary.key}>
	<Link to={props.nav.summary.route}>{props.nav.summary.label}</Link>
	</NavItem>
    {props.nav.applicantSelected &&
     <NavItem eventKey={props.nav.applicant.key}>{props.nav.applicant.label}</NavItem>
    }
    </Nav>

	<Nav pullRight>
	<NavDropdown eventKey={props.nav.logout.key} title={props.nav.logout.role + ":" + props.nav.logout.user}
    id="nav-dropdown">
	<MenuItem eventKey={props.nav.logout.key + ".1"}>
	<Link to={props.nav.logout.route}>Logout</Link>
	</MenuItem>
	</NavDropdown>
	</Nav>
	
    </Navbar>
);


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
	<App />,
	document.getElementById('root'),
    )
})
