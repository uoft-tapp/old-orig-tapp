import React from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'

class CourseMenu extends React.Component {
    render() {
	const courses = fake.slice();//this.props.courses.slice();
	courses.sort((a, b) => a.code > b.code);

	const list = courses.map(
	    (course) => (
		this.props.selected.has(course.code) ?
		    (<ListGroupItem key={course.code} onClick={() => this.props.handleClick(course.code)} active>
		     <span style={{float: 'left'}}>{course.code}</span>
		     <span style={{float: 'right'}}>{course.assigned} /{course.expected}</span>
		     </ListGroupItem>)
		: (<ListGroupItem key={course.code} onClick={() => this.props.handleClick(course.code)}>
		   <span style={{float: 'left'}}>{course.code}</span>
		   <span style={{float: 'right'}}>{course.assigned} /{course.expected}</span>
		   </ListGroupItem>)
	    ));
	
	return <ListGroup style={{float: "left"}}>{list}</ListGroup>;
    }
}



let fake = ([
    {code: 'CSC108H1B', assigned: 2, expected: 10},
    {code: 'CSC100H', assigned: 2, expected: 10},
    {code: 'HLP101H1', assigned: 2, expected: 10},
    {code: 'CSC104H1', assigned: 2, expected: 10},
    {code: 'CSC108H1C', assigned: 2, expected: 10},
    {code: 'CSC121H1', assigned: 2, expected: 10},
    {code: 'CSC240H1', assigned: 2, expected: 10},
    {code: 'CSC318H1', assigned: 2, expected: 10},
    {code: 'CSC320H1', assigned: 2, expected: 10},
    {code: 'CSC321H1', assigned: 2, expected: 10},
    {code: 'CSC324H1', assigned: 2, expected: 10},
    {code: 'CSC401H1', assigned: 2, expected: 10},
    {code: 'CSC402H1', assigned: 2, expected: 10},
    {code: 'CSC388H1', assigned: 2, expected: 10},
    {code: 'CSC385H1', assigned: 2, expected: 10},
    {code: 'CSC469H1', assigned: 2, expected: 10},
    {code: 'CSC403H1', assigned: 2, expected: 10},
    {code: 'CSC108H1', assigned: 2, expected: 10},
    {code: 'CSC148H1', assigned: 2, expected: 10},
    {code: 'CSC210H1', assigned: 2, expected: 10},
    {code: 'CSC108H1A', assigned: 2, expected: 10},
    {code: 'CSC207H1', assigned: 2, expected: 10},
    {code: 'CSC209H1', assigned: 2, expected: 10},
    {code: 'CSC236H1', assigned: 2, expected: 10},
    {code: 'CSC263H1', assigned: 2, expected: 10},
    {code: 'CSC258H1', assigned: 2, expected: 10},
    {code: 'CSC400H1', assigned: 2, expected: 10},
    {code: 'CSC488H1', assigned: 2, expected: 10},
    {code: 'CSC302H1', assigned: 2, expected: 10},
    {code: 'CSC301H1', assigned: 2, expected: 10},
    {code: 'CSC300H1', assigned: 2, expected: 10},
    {code: 'CSC309H1', assigned: 2, expected: 10},
    {code: 'CSC336H1', assigned: 2, expected: 10},
    {code: 'CSC369H1', assigned: 2, expected: 10},
    {code: 'CSC363H1', assigned: 2, expected: 10},
    {code: 'CSC165H1', assigned: 2, expected: 10},
    {code: 'CSC373H1', assigned: 2, expected: 10},
    {code: 'CSC101H1', assigned: 2, expected: 10},
    {code: 'CSC102H1', assigned: 2, expected: 10},
    {code: 'CSC103H1', assigned: 2, expected: 10},
    {code: 'CSC105H1', assigned: 2, expected: 10},
    {code: 'CSC106H1', assigned: 2, expected: 10},
    {code: 'CSC107H1', assigned: 2, expected: 10},
    {code: 'CSC109H1', assigned: 2, expected: 10},
    {code: 'CSC110H1', assigned: 2, expected: 10},
    {code: 'CSC111H1', assigned: 2, expected: 10},
    {code: 'CSC112H1', assigned: 2, expected: 10},
    {code: 'CSC113H1', assigned: 2, expected: 10},
    {code: 'CSC114H1', assigned: 2, expected: 10},
    {code: 'CSC115H1', assigned: 2, expected: 10},
    {code: 'CSC116H1', assigned: 2, expected: 10},
    {code: 'CSC117H1', assigned: 2, expected: 10},
    {code: 'CSC118H1', assigned: 2, expected: 10},
    {code: 'CSC119H1', assigned: 2, expected: 10},    
]);


export { CourseMenu };
