/*** Route configuration ***/

const routeConfig = {
    courses: {
        route: '/courses',
        key: 'courses',
    },
    abc: {
        route: '/applicantsbycourse',
        key: 'abc',
    },
    assigned: {
        route: '/assigned',
        key: 'assigned',
    },
    unassigned: {
        route: '/unassigned',
        key: 'unassigned',
    },
    summary: {
        route: '/summary',
        key: 'summary',
    },
    applicant: {
        route: '/applicant/:id',
        key: 'applicant',
    },
    logout: {
        route: '/bye',
        key: 'logout',
    },
};

export { routeConfig };