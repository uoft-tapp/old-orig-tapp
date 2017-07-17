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

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import { appState } from '../app/appState.js';
import { fetchAll } from '../app/fetch.js';

import { Navbar, navConfig } from '../app/components/navbar.js';
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

/*** Router ***/
// temporary logout "view"
const Bye = props =>
    <div className="container-fluid" style={{ paddingTop: '70px' }}>
        <h1>Bye!</h1>
    </div>;

const RouterInst = props =>
    <Router basename="index.html">
        <div>
            <Navbar {...props} />

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

            <div className="container-fluid" id="alert-container">
                {props.func.getAlerts().map(
                    alert =>
                        <Alert
                            key={'alert-' + alert.id}
                            bsStyle="danger"
                            onClick={() => props.func.dismissAlert(alert.id)}
                            onAnimationEnd={() => props.func.dismissAlert(alert.id)}>
                            {alert.text}
                        </Alert>
                )}
            </div>
        </div>
    </Router>;

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
});
