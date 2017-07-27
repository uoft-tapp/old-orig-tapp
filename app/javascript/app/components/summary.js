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
        if (this.props.func.getSelectedNavTab() != this.props.navKey) {
            this.props.func.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }
}

export { Summary };
