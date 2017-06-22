import _ from 'underscore'
import Backbone from 'backbone'
import NestedModel from 'backbone-nested'
import React from 'react'
import ReactDOM from 'react-dom'

window.React = React;
window.ReactDOM = ReactDOM;

const fakeApplicants = [{"id":1,"utorid":"applicant1","student_number":"1342088432","first_name":"Mjolarkark","last_name":"Zedslamares","email":"mjolarkark.zedslamares@mail.utoronto.ca","phone":"647628818","address":"1 Slamares St.","created_at":"2017-06-13T19:20:35.287Z","updated_at":"2017-06-13T19:20:35.287Z"},{"id":2,"utorid":"applicant2","student_number":"1722477828","first_name":"Zorkairmed","last_name":"Krired","email":"zorkairmed.krired@mail.utoronto.ca","phone":"6473189830","address":"2 Red St.","created_at":"2017-06-13T19:20:35.293Z","updated_at":"2017-06-13T19:20:35.293Z"},{"id":3,"utorid":"applicant3","student_number":"1552264775","first_name":"Reicratron","last_name":"Krmaracer","email":"reicratron.krmaracer@mail.utoronto.ca","phone":"647310459","address":"3 Aracer St.","created_at":"2017-06-13T19:20:35.297Z","updated_at":"2017-06-13T19:20:35.297Z"},{"id":4,"utorid":"applicant4","student_number":"1848603557","first_name":"Krcresmed","last_name":"Cruredarc","email":"krcresmed.cruredarc@mail.utoronto.ca","phone":"6471118826","address":"4 Redarc St.","created_at":"2017-06-13T19:20:35.302Z","updated_at":"2017-06-13T19:20:35.302Z"},{"id":5,"utorid":"applicant5","student_number":"1907443616","first_name":"Crymiricred","last_name":"Marirder","email":"crymiricred.marirder@mail.utoronto.ca","phone":"6477635355","address":"5 Irder St.","created_at":"2017-06-13T19:20:35.307Z","updated_at":"2017-06-13T19:20:35.307Z"},{"id":6,"utorid":"applicant6","student_number":"1363292541","first_name":"Reiairure","last_name":"Jarmeeark","email":"reiairure.jarmeeark@mail.utoronto.ca","phone":"6474045326","address":"6 Meeark St.","created_at":"2017-06-13T19:20:35.313Z","updated_at":"2017-06-13T19:20:35.313Z"},{"id":7,"utorid":"applicant7","student_number":"1439403490","first_name":"Azurmaraczur","last_name":"Mormiritron","email":"azurmaraczur.mormiritron@mail.utoronto.ca","phone":"6472351019","address":"7 Miritron St.","created_at":"2017-06-13T19:20:35.319Z","updated_at":"2017-06-13T19:20:35.319Z"},{"id":8,"utorid":"applicant8","student_number":"1313340385","first_name":"Cairder","last_name":"Krarkarc","email":"cairder.krarkarc@mail.utoronto.ca","phone":"6472913034","address":"8 Rkarc St.","created_at":"2017-06-13T19:20:35.325Z","updated_at":"2017-06-13T19:20:35.325Z"},{"id":9,"utorid":"applicant9","student_number":"1436145002","first_name":"Cromimed","last_name":"Creosalmarmur","email":"cromimed.creosalmarmur@mail.utoronto.ca","phone":"6472611877","address":"9 Osalmarmur St.","created_at":"2017-06-13T19:20:35.330Z","updated_at":"2017-06-13T19:20:35.330Z"},{"id":10,"utorid":"applicant10","student_number":"1505415496","first_name":"Crumurmed","last_name":"Jarzoird","email":"crumurmed.jarzoird@mail.utoronto.ca","phone":"6479954564","address":"10 Zoird St.","created_at":"2017-06-13T19:20:35.336Z","updated_at":"2017-06-13T19:20:35.336Z"},{"id":11,"utorid":"applicant11","student_number":"1487538515","first_name":"Breclozur","last_name":"Drakmaraced","email":"breclozur.drakmaraced@mail.utoronto.ca","phone":"6476851550","address":"11 Kmaraced St.","created_at":"2017-06-13T19:20:35.341Z","updated_at":"2017-06-13T19:20:35.341Z"},{"id":12,"utorid":"applicant12","student_number":"1829031452","first_name":"Drakmeed","last_name":"Azurcresmed","email":"drakmeed.azurcresmed@mail.utoronto.ca","phone":"647272025","address":"12 Rcresmed St.","created_at":"2017-06-13T19:20:35.347Z","updated_at":"2017-06-13T19:20:35.347Z"},{"id":13,"utorid":"applicant13","student_number":"1655214415","first_name":"Morslamarmur","last_name":"Mormaracure","email":"morslamarmur.mormaracure@mail.utoronto.ca","phone":"6479371767","address":"13 Maracure St.","created_at":"2017-06-13T19:20:35.352Z","updated_at":"2017-06-13T19:20:35.352Z"},{"id":14,"utorid":"applicant14","student_number":"1927629407","first_name":"Krslamarmur","last_name":"Cryarczur","email":"krslamarmur.cryarczur@mail.utoronto.ca","phone":"6471332616","address":"14 Arczur St.","created_at":"2017-06-13T19:20:35.358Z","updated_at":"2017-06-13T19:20:35.358Z"},{"id":15,"utorid":"applicant15","student_number":"1303087535","first_name":"Mermaraccred","last_name":"Zuraires","email":"mermaraccred.zuraires@mail.utoronto.ca","phone":"647304872","address":"15 Aires St.","created_at":"2017-06-13T19:20:35.363Z","updated_at":"2017-06-13T19:20:35.363Z"},{"id":16,"utorid":"applicant16","student_number":"1425908355","first_name":"Drakarcer","last_name":"Brearcark","email":"drakarcer.brearcark@mail.utoronto.ca","phone":"6472571686","address":"16 Arcark St.","created_at":"2017-06-13T19:20:35.368Z","updated_at":"2017-06-13T19:20:35.368Z"},{"id":17,"utorid":"applicant17","student_number":"1697510693","first_name":"Brezermur","last_name":"Madmeemur","email":"brezermur.madmeemur@mail.utoronto.ca","phone":"6478435629","address":"17 Meemur St.","created_at":"2017-06-13T19:20:35.374Z","updated_at":"2017-06-13T19:20:35.374Z"},{"id":18,"utorid":"applicant18","student_number":"1818451674","first_name":"Zedmeearc","last_name":"Jarmeecred","email":"zedmeearc.jarmeecred@mail.utoronto.ca","phone":"6477865824","address":"18 Meecred St.","created_at":"2017-06-13T19:20:35.379Z","updated_at":"2017-06-13T19:20:35.379Z"},{"id":19,"utorid":"applicant19","student_number":"1759183707","first_name":"Cryslamared","last_name":"Mrokmiricred","email":"cryslamared.mrokmiricred@mail.utoronto.ca","phone":"6474898852","address":"19 Kmiricred St.","created_at":"2017-06-13T19:20:35.384Z","updated_at":"2017-06-13T19:20:35.384Z"},{"id":20,"utorid":"applicant20","student_number":"1388403313","first_name":"Rayairmed","last_name":"Creomeearc","email":"rayairmed.creomeearc@mail.utoronto.ca","phone":"6475618286","address":"20 Omeearc St.","created_at":"2017-06-13T19:20:35.389Z","updated_at":"2017-06-13T19:20:35.389Z"},{"id":21,"utorid":"applicant21","student_number":"1151127061","first_name":"Cruzerarc","last_name":"Mermiried","email":"cruzerarc.mermiried@mail.utoronto.ca","phone":"6474631663","address":"21 Miried St.","created_at":"2017-06-13T19:20:35.395Z","updated_at":"2017-06-13T19:20:35.395Z"},{"id":22,"utorid":"applicant22","student_number":"1498348438","first_name":"Creocramur","last_name":"Merarcer","email":"creocramur.merarcer@mail.utoronto.ca","phone":"6477482187","address":"22 Arcer St.","created_at":"2017-06-13T19:20:35.400Z","updated_at":"2017-06-13T19:20:35.400Z"},{"id":23,"utorid":"applicant23","student_number":"1464557089","first_name":"Azurmiriure","last_name":"Lukcloder","email":"azurmiriure.lukcloder@mail.utoronto.ca","phone":"6476457710","address":"23 Cloder St.","created_at":"2017-06-13T19:20:35.405Z","updated_at":"2017-06-13T19:20:35.405Z"},{"id":24,"utorid":"applicant24","student_number":"1241813035","first_name":"Merarcmur","last_name":"Jarmaracd","email":"merarcmur.jarmaracd@mail.utoronto.ca","phone":"647861657","address":"24 Maracd St.","created_at":"2017-06-13T19:20:35.410Z","updated_at":"2017-06-13T19:20:35.410Z"},{"id":25,"utorid":"applicant25","student_number":"1472589261","first_name":"Rayclotron","last_name":"Creoarked","email":"rayclotron.creoarked@mail.utoronto.ca","phone":"6478956484","address":"25 Oarked St.","created_at":"2017-06-13T19:20:35.416Z","updated_at":"2017-06-13T19:20:35.416Z"},{"id":26,"utorid":"applicant26","student_number":"1928802564","first_name":"Reimirimed","last_name":"Zedcloure","email":"reimirimed.zedcloure@mail.utoronto.ca","phone":"6478782677","address":"26 Cloure St.","created_at":"2017-06-13T19:20:35.421Z","updated_at":"2017-06-13T19:20:35.421Z"},{"id":27,"utorid":"applicant27","student_number":"1423684452","first_name":"Azurcloure","last_name":"Jagcraark","email":"azurcloure.jagcraark@mail.utoronto.ca","phone":"6477152145","address":"27 Craark St.","created_at":"2017-06-13T19:20:35.426Z","updated_at":"2017-06-13T19:20:35.426Z"},{"id":28,"utorid":"applicant28","student_number":"1029045836","first_name":"Crozercred","last_name":"Raysalmarder","email":"crozercred.raysalmarder@mail.utoronto.ca","phone":"6472088254","address":"28 Salmarder St.","created_at":"2017-06-13T19:20:35.431Z","updated_at":"2017-06-13T19:20:35.431Z"},{"id":29,"utorid":"applicant29","student_number":"1208619502","first_name":"Zedsord","last_name":"Mersalmarmed","email":"zedsord.mersalmarmed@mail.utoronto.ca","phone":"6477438372","address":"29 Salmarmed St.","created_at":"2017-06-13T19:20:35.437Z","updated_at":"2017-06-13T19:20:35.437Z"},{"id":30,"utorid":"applicant30","student_number":"1974228535","first_name":"Zorkurakmur","last_name":"Zorkmaracarc","email":"zorkurakmur.zorkmaracarc@mail.utoronto.ca","phone":"6475232464","address":"30 Kmaracarc St.","created_at":"2017-06-13T19:20:35.442Z","updated_at":"2017-06-13T19:20:35.442Z"},{"id":31,"utorid":"applicant31","student_number":"1601204183","first_name":"Rayzerzur","last_name":"Cruairark","email":"rayzerzur.cruairark@mail.utoronto.ca","phone":"6474582476","address":"31 Airark St.","created_at":"2017-06-13T19:20:35.447Z","updated_at":"2017-06-13T19:20:35.447Z"},{"id":32,"utorid":"applicant32","student_number":"1011435491","first_name":"Mrokcloes","last_name":"Creoirark","email":"mrokcloes.creoirark@mail.utoronto.ca","phone":"6476103996","address":"32 Oirark St.","created_at":"2017-06-13T19:20:35.452Z","updated_at":"2017-06-13T19:20:35.452Z"},{"id":33,"utorid":"applicant33","student_number":"1842070457","first_name":"Raymeetron","last_name":"Zorkzoirer","email":"raymeetron.zorkzoirer@mail.utoronto.ca","phone":"647361790","address":"33 Kzoirer St.","created_at":"2017-06-13T19:20:35.458Z","updated_at":"2017-06-13T19:20:35.458Z"},{"id":34,"utorid":"applicant34","student_number":"1360949136","first_name":"Jarmurder","last_name":"Mermurcred","email":"jarmurder.mermurcred@mail.utoronto.ca","phone":"6471677706","address":"34 Murcred St.","created_at":"2017-06-13T19:20:35.463Z","updated_at":"2017-06-13T19:20:35.463Z"},{"id":35,"utorid":"applicant35","student_number":"1853321165","first_name":"Creocresarc","last_name":"Mjolreded","email":"creocresarc.mjolreded@mail.utoronto.ca","phone":"6479029885","address":"35 Lreded St.","created_at":"2017-06-13T19:20:35.467Z","updated_at":"2017-06-13T19:20:35.467Z"},{"id":36,"utorid":"applicant36","student_number":"1662853589","first_name":"Zurcreszur","last_name":"Mermicred","email":"zurcreszur.mermicred@mail.utoronto.ca","phone":"647495799","address":"36 Micred St.","created_at":"2017-06-13T19:20:35.471Z","updated_at":"2017-06-13T19:20:35.471Z"},{"id":37,"utorid":"applicant37","student_number":"1249915743","first_name":"Zorkslamarzur","last_name":"Mrokzerarc","email":"zorkslamarzur.mrokzerarc@mail.utoronto.ca","phone":"6472313201","address":"37 Kzerarc St.","created_at":"2017-06-13T19:20:35.475Z","updated_at":"2017-06-13T19:20:35.475Z"},{"id":38,"utorid":"applicant38","student_number":"1242673868","first_name":"Mjolsores","last_name":"Jarsalmarark","email":"mjolsores.jarsalmarark@mail.utoronto.ca","phone":"6474206684","address":"38 Salmarark St.","created_at":"2017-06-13T19:20:35.479Z","updated_at":"2017-06-13T19:20:35.479Z"},{"id":39,"utorid":"applicant39","student_number":"1526744183","first_name":"Zurmurure","last_name":"Crucresder","email":"zurmurure.crucresder@mail.utoronto.ca","phone":"6478771644","address":"39 Cresder St.","created_at":"2017-06-13T19:20:35.483Z","updated_at":"2017-06-13T19:20:35.483Z"},{"id":40,"utorid":"applicant40","student_number":"1312732522","first_name":"Jarsorarc","last_name":"Jarzered","email":"jarsorarc.jarzered@mail.utoronto.ca","phone":"6474998416","address":"40 Zered St.","created_at":"2017-06-13T19:20:35.487Z","updated_at":"2017-06-13T19:20:35.487Z"},{"id":41,"utorid":"applicant41","student_number":"1277370439","first_name":"Madmurtron","last_name":"Brecresark","email":"madmurtron.brecresark@mail.utoronto.ca","phone":"6474764298","address":"41 Cresark St.","created_at":"2017-06-13T19:20:35.492Z","updated_at":"2017-06-13T19:20:35.492Z"},{"id":42,"utorid":"applicant42","student_number":"1249645418","first_name":"Crumies","last_name":"Brearkure","email":"crumies.brearkure@mail.utoronto.ca","phone":"6477160130","address":"42 Arkure St.","created_at":"2017-06-13T19:20:35.496Z","updated_at":"2017-06-13T19:20:35.496Z"},{"id":43,"utorid":"applicant43","student_number":"1265331514","first_name":"Krmurarc","last_name":"Marires","email":"krmurarc.marires@mail.utoronto.ca","phone":"6476894625","address":"43 Ires St.","created_at":"2017-06-13T19:20:35.502Z","updated_at":"2017-06-13T19:20:35.502Z"},{"id":44,"utorid":"applicant44","student_number":"1828167063","first_name":"Bremid","last_name":"Mjolcramur","email":"bremid.mjolcramur@mail.utoronto.ca","phone":"6473209776","address":"44 Lcramur St.","created_at":"2017-06-13T19:20:35.505Z","updated_at":"2017-06-13T19:20:35.505Z"},{"id":45,"utorid":"applicant45","student_number":"1702902754","first_name":"Zurzerarc","last_name":"Drakzerark","email":"zurzerarc.drakzerark@mail.utoronto.ca","phone":"6474766594","address":"45 Kzerark St.","created_at":"2017-06-13T19:20:35.509Z","updated_at":"2017-06-13T19:20:35.509Z"},{"id":46,"utorid":"applicant46","student_number":"1149375916","first_name":"Mersorure","last_name":"Mjolsalmarzur","email":"mersorure.mjolsalmarzur@mail.utoronto.ca","phone":"6478556776","address":"46 Lsalmarzur St.","created_at":"2017-06-13T19:20:35.513Z","updated_at":"2017-06-13T19:20:35.513Z"},{"id":47,"utorid":"applicant47","student_number":"1272287459","first_name":"Lukmeearc","last_name":"Croclod","email":"lukmeearc.croclod@mail.utoronto.ca","phone":"6475970266","address":"47 Clod St.","created_at":"2017-06-13T19:20:35.517Z","updated_at":"2017-06-13T19:20:35.517Z"},{"id":48,"utorid":"applicant48","student_number":"1842444532","first_name":"Zedarcmur","last_name":"Azakcloark","email":"zedarcmur.azakcloark@mail.utoronto.ca","phone":"6473303150","address":"48 Kcloark St.","created_at":"2017-06-13T19:20:35.520Z","updated_at":"2017-06-13T19:20:35.520Z"},{"id":49,"utorid":"applicant49","student_number":"1171360788","first_name":"Croredtron","last_name":"Zedarkcred","email":"croredtron.zedarkcred@mail.utoronto.ca","phone":"6476533831","address":"49 Arkcred St.","created_at":"2017-06-13T19:20:35.525Z","updated_at":"2017-06-13T19:20:35.525Z"},{"id":50,"utorid":"applicant50","student_number":"1970567087","first_name":"Breaircred","last_name":"Zedmiure","email":"breaircred.zedmiure@mail.utoronto.ca","phone":"6473159717","address":"50 Miure St.","created_at":"2017-06-13T19:20:35.529Z","updated_at":"2017-06-13T19:20:35.529Z"},{"id":51,"utorid":"applicant51","student_number":"1290571566","first_name":"Azurarktron","last_name":"Breird","email":"azurarktron.breird@mail.utoronto.ca","phone":"6475851271","address":"51 Ird St.","created_at":"2017-06-13T19:20:35.533Z","updated_at":"2017-06-13T19:20:35.533Z"},{"id":52,"utorid":"applicant52","student_number":"1742463881","first_name":"Mjolsalmard","last_name":"Lukzoired","email":"mjolsalmard.lukzoired@mail.utoronto.ca","phone":"6476462113","address":"52 Zoired St.","created_at":"2017-06-13T19:20:35.539Z","updated_at":"2017-06-13T19:20:35.539Z"},];


let appState = new Backbone.NestedModel({    
    // navbar component
    nav: {
	courses: {
	    key: "1",
	    label: "Courses",
	    route: "/courses",
	},
	abc: {
	    key: "2",
	    label: "Applicants by Course",
	    route: "/applicantsbycourse",
	},
	assigned: {
	    key: "3",
	    label: "All Assigned",
	    route: "/assigned",
	},
	unassigned: {
	    key: "4",
	    label: "All Unassigned",
	    route: "/unassigned",
	},
	summary: {
	    key: "5",
	    label: "Summary",
	    route: "/summary",
	},

	applicant: {
	    key: "6",
	    label: "-",
	    route: "/applicant/:id",
	},
	
	logout: {
	    key: "7",
	    route: "/bye",
	    role: "role",
	    user: "user",
	},

	selectedTab: null,

	applicantSelected: false,
	
	selectTab: (eventKey) => {
	    appState.set({'nav.selectedTab': eventKey,
			  'nav.applicantSelected': (eventKey == appState.get('nav.applicant.key'))});
	},
    },

    // course menu component (at most one per view)
    courseMenu: {
	// will be populated with course codes and assigned/expected applicant counts
	courses: [],
	
	selected: [],

	// toggle the selected state of the course that is clicked
	toggleSelected: courseCode => {
	    let selected = appState.get('courseMenu.selected');
	    let i = selected.indexOf(courseCode);
	    
	    if (i == -1 && selected.length < 4) {
		appState.add('courseMenu.selected', courseCode);	
	    } else {
		appState.remove('courseMenu.selected[' + i + ']');
	    }
	},

	isSelected: courseCode => appState.get('courseMenu.selected').includes(courseCode),
	
    },

    // abc view
    abcView: {
	layout: [],

	addCoursePanel: (courseCode, activeCount) => {
	    let layout = appState.get('abcView.layout');
	    appState.unset('abcView.layout', {silent: true});
	    
	    switch (activeCount) {
	    case 1:
		// layout is now [ course ]
		layout = [courseCode];
		break;

	    case 2:
		// layout is now [ course1, course2 ]
		// need to be able to toggle switch to [ [course1, course2] ]
		layout.push(courseCode);
		break;

	    case 3:
		// need to be able to toggle between 3-layouts
		if (layout.length == 2)
		    // layout was [ course1, course2 ], is now [ course1, course2, course3]
		    layout.push(courseCode);
		
		else
		    // layout was [ [course1, course2] ], is now [ course3, [course1, course2] ]
		    layout = [courseCode, layout];

		break;

	    case 4:
		// layout is now [ [course1, course2], [course3, course4] ]
		
		if (layout[0].length == 1)
		    // layout was [ course1, [course2, course3] ]
		    layout[0].push(courseCode);
		
		else if (layout[1].length == 1)
		    // layout was [ [course1, course2], course3 ]
		    layout[1].push(courseCode);
		
		else if (layout[0][0] == layout[1][0])
		    // layout was [ [course1, course2] [course1, course3] ]
		    layout[1][0] = courseCode;

		else
		    // layout was [ [course1, course2] [course3, course2] ]
		    layout[1][1] = courseCode;		    
		
		break;
	    }

	    return layout;
	},

	removeCoursePanel: (courseCode, activeCount) => {
	    let layout = appState.get('abcView.layout');
	    appState.unset('abcView.layout', {silent: true});
	    
	    switch (activeCount) {
	    case 0:
		layout = [];
		break;

	    case 1:
		// layout is now [ course ]
		if (layout[0] == courseCode)
		    layout.splice(0, 1);
		else
		    layout.splice(1, 1);
		break;

	    case 2:
		// layout is now [ course1, course2 ]
		break;

	    case 3:

		break;
	    }

	    return layout;
	},
	
	toggleCoursePanel: (courseCode) => {
	    let active = appState.get('courseMenu.selected');
	    
	    if (active.includes(courseCode)) {
		// add course to layout
		appState.set('abcView.layout', appState.get('abcView.addCoursePanel')(courseCode, active.length));

	    } else {
		// remove course from layout
		appState.set('abcView.layout', appState.get('abcView.removeCoursePanel')(courseCode, active.length));
	    }
	},
    },

    assignedView: null,

    unassignedView: null,

    // courses data
    courses: {
	resourceRoute: '/courses',
	
	onceFetched: resp => {
	    appState.set({'courses.list': resp,
			  // populate the course menu with course codes and assigned/expected applicant counts
			  'courseMenu.courses': resp.map(course => (
			      {code: course.code, expected: course.positions[0].estimated_count, assigned: 0})),
			  'courses.fetched': true});
	    return resp;
	},

	fetched: false,

	list: [],
    },
    
    // applicant data
    applicants: {
	resourceRoute: '/applicants',

	onceFetched: resp => {
	    // separate applicants into assigned and unassigned
	    let unassigned = [], assigned = [];
	    for (applicant in resp) {
		if (true)
		    unassigned.push(applicant);
		else
		    assigned.push(applicant);
	    }
	    
	    appState.set({'applicants.list': resp,
			  'applicants.assigned': assigned, 'applicants.unassigned': unassigned, 
			  'applicants.fetched': true});
	    return resp;
	},
    
	fetched: true,
	
	list: fakeApplicants,

	unassigned: fakeApplicants.slice(50),

	assigned: fakeApplicants.slice(0,50),
    },

    // application data
    applications: {
	resourceRoute: '/applications',

	onceFetched: resp => {
	    appState.set({'applications.list': resp,
			  'applications.fetched': true});

	    return resp;
	},

	fetched: false,

	list: [],
    },
});


function fetchHelper(URL, next) {
    fetch(URL).then(function(response) {
	return response.json();
    }).then(function(response) {
	return next(response);
    });
}

function fetchAll() {
    let resources = ['applications', 'courses'];
    
    let i;
    for (i = 0; i < resources.length; i++)
	fetchHelper(appState.get(resources[i] + '.resourceRoute'), appState.get(resources[i] + '.onceFetched'));
}

export {appState, fetchAll};
