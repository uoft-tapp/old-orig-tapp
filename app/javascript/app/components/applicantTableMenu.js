import React from 'react'
import PropTypes from 'prop-types';
import { ButtonGroup, Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap'

class ApplicantTableMenu extends React.Component {
    constructor(props) {
	super(props);

	this.icon = {
	    '1': <Glyphicon style={{fontSize: '7pt'}} glyph={'menu-up'}/>,
	    '-1': <Glyphicon style={{fontSize: '7pt'}} glyph={'menu-down'}/>
	};
    }
    
    render() {
	return (
		<div style={{marginBottom: '1vh'}}>
		<ButtonGroup>
		<Button onClick={this.props.clearFilters}>Clear filters</Button>

	    {this.props.config.map(
		(field, i) =>
		    (field.filterLabel &&
		     <DropdownButton title={field.filterLabel} key={field.filterLabel + "-dropdown"}
		     id={field.filterLabel + "-dropdown"}
		     bsStyle={this.props.anyFilterActive(i) ? 'primary' : 'default'}>

		     {field.filterCategories.map(
			 (category, j) =>
			     <MenuItem
			 key={'filter-' + category}
			 eventKey={i+'.'+j}
			 onSelect={eventKey => this.props.toggleFilter(...(eventKey.split('.').map(Number)))}
			 active={this.props.isFilterActive(i, j)}>
			     {category}
			 </MenuItem>
		     )}
		     
		     </DropdownButton>)
	    )}
	    
	    </ButtonGroup>
		
		<ButtonGroup style={{paddingLeft: "1vw"}}>
		{this.props.activeSortFields.map(
		    sortField => {
			let dir = sortField > 0 ? 1 : -1;
			let name = this.props.config[sortField * dir].header;
			
			return (
				<DropdownButton title={<span>{name} {this.icon[dir]}</span>}
			    key={"sort-" + sortField} id={"sort-" + sortField} noCaret>
				
				<MenuItem onSelect={() => this.props.toggleSortDir(sortField)}>
				{name} {this.icon[-dir]}</MenuItem>
				
				<MenuItem onSelect={() => this.props.removeSort(sortField)}>
				Clear field</MenuItem>
				
				</DropdownButton>
			);
		    })}

		<DropdownButton title="Add sort field" id="sort-dropdown" bsStyle="info" noCaret>
		{this.props.config.map(
		    (field, i) => (field.sortData &&
				       <MenuItem key={"sort-" + field.header}
				       onSelect={() => this.props.addSort(i)}>
				       {field.header}
				       </MenuItem>)
		)}
		</DropdownButton>
		</ButtonGroup>
	    
	    </div>
	);
    }
}

ApplicantTableMenu.propTypes = {
    config: PropTypes.arrayOf(
	PropTypes.shape({
	    header: PropTypes.string.isRequired,
	    data: PropTypes.func.isRequired,
	    
	    sortData: PropTypes.func,
	    filterLabel: PropTypes.string,
	    filterCategories: PropTypes.arrayOf(PropTypes.string),
	    filterFuncs: PropTypes.arrayOf(PropTypes.func),
	})
    ).isRequired,
    
    activeSortFields: PropTypes.arrayOf(PropTypes.number).isRequired,
    
    anyFilterActive: PropTypes.func.isRequired,
    isFilterActive: PropTypes.func.isRequired,
    toggleFilter: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
    
    addSort: PropTypes.func.isRequired,
    removeSort: PropTypes.func.isRequired,
    toggleSortDir: PropTypes.func.isRequired,
};


export { ApplicantTableMenu };
