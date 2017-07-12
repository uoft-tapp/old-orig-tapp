import React from 'react';
import { Grid } from 'react-bootstrap';

class Summary extends React.Component {
    render() {
        return (
            <Grid fluid id="summary-grid">
                <h1>Summary!</h1>
            </Grid>
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

export { Summary };
