export const defaultLocations = ['general'];

export const defaultProject = {
    "routes":[
        {
            "route":"/",
            "description":"Homepage for the website",
            "exits":[],
            "forms":[]
        }
    ],
    "globalExits":[
        {
            "route":"/",
            "visibleText":"Home",
            "routeLocations": defaultLocations
        }
    ]
};
