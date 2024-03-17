export function componentNameFromRoute(strRoute) {
    let componentName = strRoute
        .replace('/', '').replace(/:/g, '')
        .split('/').map((part) => part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase())
        .join('');
    if (!componentName.length) {
        componentName = 'Home';
    }
    componentName += 'Page';

    return componentName;
}

export function componentNameFromRouteProps(routeProps) {
    if (routeProps.hasOwnProperty('filename') && routeProps.filename.length > 0) {
        return routeProps.filename;
    }
    const {route} = routeProps;
    return componentNameFromRoute(route);
}