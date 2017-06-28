import React from 'react'
import { ButtonGroup, Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap'

class ABCTableMenu extends React.Component {
    render() {
	// style the dropdown if any of its items are active
	let dropStyle = (fields) => this.props.func.anyFilterActive(this.props.course, fields) ? 'primary' : 'default';
	
	let dropSelect = (eventKey) => this.props.func.toggleFilter(this.props.course, eventKey);
	let isActive = (eventKey) => this.props.func.isFilterActive(this.props.course, eventKey);
	
	return (
		<div style={{marginBottom: '1vh'}}>
		<ButtonGroup>
		<Button onClick={() => this.props.func.clearFilters(this.props.course)}>Clear filters</Button>
		
		<DropdownButton title="Status" id="status-dropdown" bsStyle={dropStyle(['1.1','1.2'])}>
		<MenuItem eventKey="1.1" onSelect={dropSelect} active={isActive('1.1')}>Assigned elsewhere</MenuItem>
		<MenuItem eventKey="1.2" onSelect={dropSelect} active={isActive('1.2')}>Unassigned</MenuItem>
		</DropdownButton>

	    	<DropdownButton title="Prog." id="prog-dropdown" bsStyle={dropStyle(['2.1','2.2','2.3','2.4'])}>
		<MenuItem eventKey="2.1" onSelect={dropSelect} active={isActive('2.1')}>PostDoc</MenuItem>
		<MenuItem eventKey="2.2" onSelect={dropSelect} active={isActive('2.2')}>PhD</MenuItem>
		<MenuItem eventKey="2.3" onSelect={dropSelect} active={isActive('2.3')}>Masters</MenuItem>
		<MenuItem eventKey="2.4" onSelect={dropSelect} active={isActive('2.4')}>UG</MenuItem>
		</DropdownButton>

	    	<DropdownButton title="Dept." id="dept-dropdown" bsStyle={dropStyle(['3.1','3.2'])}>
		<MenuItem eventKey="3.1" onSelect={dropSelect} active={isActive('3.1')}>DCS</MenuItem>
		<MenuItem eventKey="3.2" onSelect={dropSelect} active={isActive('3.2')}>Other</MenuItem>
		</DropdownButton>
		
		</ButtonGroup>

		<ButtonGroup style={{paddingLeft: "1vw"}}>
		{this.props.activeSortFields.map(
		    (field, index) => (
			    <DropdownButton
			title={<span>{field.split('-')[0]} <Glyphicon style={{fontSize: '7pt'}}
			       glyph={"menu-" + field.split('-')[1]} />
			       </span>}
			id={"sort-" + field} key={"sort-" + field} noCaret>
			    
			    <MenuItem>{field.split('-')[0]} <Glyphicon style={{fontSize: '7pt'}}
			glyph={"menu-" + (field.split('-')[1] == 'up' ? 'down' : 'up')} />
			    </MenuItem>
			    <MenuItem>Clear field</MenuItem>
			    </DropdownButton>
		    )
		)}
		<DropdownButton title="Add sort field" id="sort-dropdown" bsStyle="info" noCaret>
		{this.props.sortFields.map(
		    (field, index) => (
			    <MenuItem key={"sort-" + field} eventKey={'sort-' + field}
			onSelect={(eventKey) => this.props.sort(eventKey.split('-')[1])}>
			    {field}
			</MenuItem>
		    )
		)}
		</DropdownButton>
		</ButtonGroup>
	    
		</div>
	);
    }
}

export { ABCTableMenu };
