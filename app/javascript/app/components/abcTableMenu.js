import React from 'react'
import { ButtonGroup, Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap'

class ABCTableMenu extends React.Component {
    constructor(props) {
	super(props);

	this.icon = {
	    '1': <Glyphicon style={{fontSize: '7pt'}} glyph={'menu-up'}/>,
	    '-1': <Glyphicon style={{fontSize: '7pt'}} glyph={'menu-down'}/>
	};
    }
    
    render() {
	// style the dropdown if any of its items are active
	let dropStyle = (field) => this.props.func.anyFilterActive(this.props.course, field) ? 'primary' : 'default';
	
	let dropSelect = (eventKey) =>
	    this.props.func.toggleFilter(this.props.course, ...(eventKey.split('.').map(Number)));
	
	let isActive = (field, category) => this.props.func.isFilterActive(this.props.course, field, category);

	return (
		<div style={{marginBottom: '1vh'}}>
		<ButtonGroup>
		<Button onClick={() => this.props.func.clearFilters(this.props.course)}>Clear filters</Button>

	    {this.props.config.map(
		(field, i) =>
		    (field.filterLabel &&
		     <DropdownButton title={field.filterLabel} id={field.filterLabel + "-dropdown"}
		     bsStyle={dropStyle(i)}>

		     {field.filterCategories.map(
			 (category, j) =>
			     <MenuItem eventKey={i+'.'+j} onSelect={dropSelect} active={isActive(i, j)}>
			     {category}
			 </MenuItem>
		     )}
		     
		     </DropdownButton>)
	    )}
	    
	    </ButtonGroup>
		
		<ButtonGroup style={{paddingLeft: "1vw"}}>
		{this.props.func.getCoursePanelSortsByCourse(this.props.course).map(
		    (field, index) => {
			let dir = field > 0 ? 1 : -1;
			let name = this.props.config[field * dir].header;
			
			return (
				<DropdownButton title={<span>{name} {this.icon[dir]}</span>} key={"sort-" + field}
			    id={"sort-" + field} noCaret>
				
				<MenuItem onSelect={() => this.props.func.toggleSortDir(this.props.course, field)}>
				{name} {this.icon[-dir]}</MenuItem>
				
				<MenuItem onSelect={() => this.props.func.removeSort(this.props.course, field)}>
				Clear field</MenuItem>
				
				</DropdownButton>
			);
		    })}

		<DropdownButton title="Add sort field" id="sort-dropdown" bsStyle="info" noCaret>
		{this.props.config.map(
		    (field, index) => (field.sortData &&
				       <MenuItem key={"sort-" + field.header}
				       onSelect={() => this.props.func.addSort(this.props.course, index)}>
				       {field.header}
				       </MenuItem>)
		)}
		</DropdownButton>
		</ButtonGroup>
	    
		</div>
	);
    }
}

export { ABCTableMenu };
