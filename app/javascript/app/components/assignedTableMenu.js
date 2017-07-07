import React from 'react';
import { ButtonGroup, Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

class AssignedTableMenu extends React.Component {
    render() {
        return (
            <div style={{ marginBottom: '1vh' }}>
                <ButtonGroup>
                    <Button>Clear filters</Button>

                    <DropdownButton title="Status" id="status-dropdown">
                        <MenuItem eventKey="1.1">Assigned elsewhere</MenuItem>
                        <MenuItem eventKey="1.2">Unassigned</MenuItem>
                    </DropdownButton>

                    <DropdownButton title="Prog." id="prog-dropdown">
                        <MenuItem eventKey="2.1">PostDoc</MenuItem>
                        <MenuItem eventKey="2.2">PhD</MenuItem>
                        <MenuItem eventKey="2.3">Masters</MenuItem>
                        <MenuItem eventKey="2.4">UG</MenuItem>
                    </DropdownButton>

                    <DropdownButton title="Dept." id="dept-dropdown">
                        <MenuItem eventKey="3.1">DCS</MenuItem>
                        <MenuItem eventKey="3.2">Other</MenuItem>
                    </DropdownButton>
                </ButtonGroup>

                <ButtonGroup style={{ paddingLeft: '1vw' }}>
                    {this.props.selectedSortFields.map((field, index) =>
                        <DropdownButton
                            title={
                                <span>
                                    {field.split('-')[0]}{' '}
                                    <Glyphicon
                                        style={{ fontSize: '7pt' }}
                                        glyph={'menu-' + field.split('-')[1]}
                                    />
                                </span>
                            }
                            id={'sort-' + field}
                            key={'sort-' + field}
                            noCaret>
                            <MenuItem>
                                {field.split('-')[0]}{' '}
                                <Glyphicon
                                    style={{ fontSize: '7pt' }}
                                    glyph={'menu-' + (field.split('-')[1] == 'up' ? 'down' : 'up')}
                                />
                            </MenuItem>
                            <MenuItem>Clear field</MenuItem>
                        </DropdownButton>
                    )}
                    <DropdownButton
                        title="Add sort field"
                        id="sort-dropdown"
                        bsStyle="info"
                        noCaret>
                        {this.props.sortFields.map((field, index) =>
                            <MenuItem
                                key={'sort-' + field}
                                eventKey={'sort-' + field}
                                onSelect={eventKey => this.props.sort(eventKey.split('-')[1])}>
                                {field}
                            </MenuItem>
                        )}
                    </DropdownButton>
                </ButtonGroup>
            </div>
        );
    }
}

export { AssignedTableMenu };
