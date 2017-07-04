import React from "react";
import {
  ButtonGroup,
  Button,
  DropdownButton,
  MenuItem,
  Glyphicon
} from "react-bootstrap";

class UnassignedTableMenu extends React.Component {
  render() {
    return (
      <div style={{ marginBottom: "1vh" }}>
        <ButtonGroup>
          <Button>Clear filters</Button>

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

          <DropdownButton title="Course" id="course-dropdown">
            {this.props.coursesList.map((course, index) =>
              <MenuItem eventKey={"4." + index}>
                {course[1]["code"]}
              </MenuItem>
            )}
          </DropdownButton>
        </ButtonGroup>

        <ButtonGroup style={{ paddingLeft: "1vw" }}>
          {this.props.activeSortFields.map((field, index) =>
            <DropdownButton
              title={
                <span>
                  {field.split("-")[0]}{" "}
                  <Glyphicon
                    style={{ fontSize: "7pt" }}
                    glyph={"menu-" + field.split("-")[1]}
                  />
                </span>
              }
              id={"sort-" + field}
              key={"sort-" + field}
              noCaret
            >
              <MenuItem>
                {field.split("-")[0]}{" "}
                <Glyphicon
                  style={{ fontSize: "7pt" }}
                  glyph={
                    "menu-" + (field.split("-")[1] == "up" ? "down" : "up")
                  }
                />
              </MenuItem>
              <MenuItem onSelect={field => this.props.clear(field)}>
                Clear field
              </MenuItem>
            </DropdownButton>
          )}
          <DropdownButton
            title="Add sort field"
            id="sort-dropdown"
            bsStyle="info"
            noCaret
          >
            {this.props.config.map((field, index) => {
              if (field.additional_sort)
                return (
                  <MenuItem
                    key={"sort-" + field.header}
                    eventKey={"sort-" + field.header}
                    onSelect={eventKey => this.props.addSort(field.header)}
                  >
                    {field.header}
                  </MenuItem>
                );
            })}
          </DropdownButton>
        </ButtonGroup>
      </div>
    );
  }
}

export { UnassignedTableMenu };
