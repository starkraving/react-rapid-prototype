export const convertComponentHtmlToJsx = (str, startingIndent) => {

    const format = (node, level) => {

        const indentBefore = new Array(level++ + 1).join('  ');
        const indentAfter  = new Array(level - 1).join('  ');
        let textNode;
    
        for (let i = 0; i < node.children.length; i++) {
    
            textNode = document.createTextNode('\n' + indentBefore);
            node.insertBefore(textNode, node.children[i]);
    
            format(node.children[i], level);
    
            if (node.lastElementChild === node.children[i]) {
                textNode = document.createTextNode('\n' + indentAfter);
                node.appendChild(textNode);
            }
        }
    
        return node;
    }

    let div = document.createElement('div');
    div.innerHTML = str.trim();
    const newDiv = div.querySelector('[data-content-start]');
    if (newDiv) {
        newDiv.removeAttribute('data-content-start');
        const replaceableAnchors = newDiv.querySelectorAll('[data-content-exit]');
        for (let a = 0 ; a < replaceableAnchors.length ; a++) {
            let anchorNode = replaceableAnchors[a];
            let textNode = document.createTextNode(`<Link to="${anchorNode.getAttribute('href')}">${anchorNode.innerHTML}</Link>`);
            anchorNode.replaceWith(textNode);
        }
        div.innerHTML = newDiv.outerHTML;
    }

    return format(div, startingIndent).innerHTML.trim()
        .replace(/(data-content-form=)(")([^"]+)(")/g, 'onSubmit={$3}')
        .replace(/(&lt;)/g, '<')
        .replace(/(&gt;)/g, '>');
};

export const locationToComponentStrings = (location) => {
    let componentName = location.pathname
        .replace('/', '').replace(/:/g, '')
        .split('/').map((part) => part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase())
        .join('');
    if (!componentName.length) {
        componentName = 'Home';
    }
    componentName += 'Page';

    const _componentPathVariables = location.pathname
        .split('/')
        .filter((part) => part.indexOf(':') === 0)
        .map((part) => part.substring(1));

    const componentPathVariables = _componentPathVariables.length === 0
        ? ''
        : _componentPathVariables.reduce(
            (str, part) => str + "\n    " + part + ',',
            "  const {"
          ) + "\n  } = props.match.params;\n\n";

    return {
        componentName,
        componentPathVariables
    };
};

export const currentRouteToComponentStrings = (currentRoute) => {
    let needsHistory = false;
    const componentFormHandlers = currentRoute.forms && currentRoute.forms.length
            ? currentRoute.forms.reduce(
                (str, form, idx) => {
                    const {
                        name,
                        exit = {route: ''}
                    } = form.action;
                    const handler = name || `handleForm${idx}`;
                    str += `  const ${handler} = () => {`
                        + "\n    // TODO: do the thing";
                    if (exit.route && exit.route.length) {
                        needsHistory = true;
                        str += `${"\n"}    history.push('${exit.route}');`
                    }
                    str += "\n  };";
                    if (idx < currentRoute.forms.length - 1) {
                        str += "\n\n";
                    }
                    return str;
                },
                ""
              )
            : '';
    
    const importHistoryString = needsHistory ? `import { useHistory } from 'react-router-dom';` : '';
    const useHistoryString = needsHistory ? `  const history = useHistory();${ "\n\n"}` : '';

    return {
        componentFormHandlers,
        importHistoryString,
        useHistoryString
    };
}


export const generateComponentCode = (str, location, currentRoute) => {
    const {
        componentName,
        componentPathVariables
    } = locationToComponentStrings(location);
    

    const {
        componentFormHandlers,
        importHistoryString,
        useHistoryString
    } = currentRouteToComponentStrings(currentRoute);

    const renderString = convertComponentHtmlToJsx(str, 2);

    return `
import 'React' from react;
${importHistoryString}

const ${componentName} = (props) => {
${useHistoryString + componentPathVariables + componentFormHandlers}

  return (
    ${renderString}
  );
};

export default ${componentName};`;
}