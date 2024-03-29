import { componentNameFromRouteProps } from "./libs";

const formNameFromProps = (formProps, currentFormIndex) => formProps?.filename ?? `Form${currentFormIndex+1}`;

const convertComponentHtmlToJsx = (str, startingIndent, currentRoute) => {

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

        // replace anchor tags with React Link tags
        const replaceableAnchors = newDiv.querySelectorAll('[data-content-exit]');
        for (let a = 0 ; a < replaceableAnchors.length ; a++) {
            let anchorNode = replaceableAnchors[a];
            let textNode = document.createTextNode(`<Link to="${anchorNode.getAttribute('href')}">${anchorNode.innerHTML}</Link>`);
            anchorNode.replaceWith(textNode);
        }

        // replace forms with React form component
        const replaceableForms = newDiv.querySelectorAll('[data-content-form]');
        for (let f = 0 ; f < replaceableForms.length ; f++) {
            const formFilename = formNameFromProps(currentRoute.forms[f], f);
            let formNode = replaceableForms[f];
            let textNode = document.createTextNode(`<${formFilename} data-content-form="${formNode.getAttribute('data-content-form')}" />`);
            formNode.replaceWith(textNode);
        }

        div.innerHTML = newDiv.outerHTML;
    }

    return format(div, startingIndent).innerHTML.trim()
        .replace(/(data-content-form=)(")([^"]+)(")/g, 'onSubmit={$3}')
        .replace(/(&lt;)/g, '<')
        .replace(/(&gt;)/g, '>');
};

const locationToComponentStrings = (locationStr) => {
    let componentName = locationStr
        .replace('/', '').replace(/:/g, '')
        .split('/').map((part) => part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase())
        .join('');
    if (!componentName.length) {
        componentName = 'Home';
    }
    componentName += 'Page';

    const _componentPathVariables = locationStr
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

const currentRouteToComponentStrings = (currentRoute) => {
    let needsHistory = false;
    let importForms = [];
    const componentFormHandlers = currentRoute.forms && currentRoute.forms.length > 0
            ? currentRoute.forms.reduce(
                (str, form, idx) => {
                    const formFilename = formNameFromProps(form, idx);
                    importForms.push(`import ${formFilename} from './${formFilename}';`);
                    const {
                        name,
                        exit = {route: ''}
                    } = form.action;
                    const handler = name || `handleForm${idx}`;
                    str += `  const ${handler} = (formData) => {`
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
    
    const componentDescription = currentRoute.description.trim().replace(/[\r\n]/, ' ');
    const importFormsString = importForms.length ? importForms.join("\n") : '';
    const importHistoryString = needsHistory ? `import { useHistory } from 'react-router-dom';` : '';
    const useHistoryString = needsHistory ? `  const history = useHistory();${ "\n\n"}` : '';

    return {
        componentFormHandlers,
        componentDescription,
        importFormsString,
        importHistoryString,
        useHistoryString
    };
}


export const generateComponentCode = (str, location, currentRoute) => {
    const {
        componentPathVariables
    } = locationToComponentStrings(location);

    const componentName = componentNameFromRouteProps(currentRoute);
    
    const {
        componentFormHandlers,
        componentDescription,
        importFormsString,
        importHistoryString,
        useHistoryString
    } = currentRouteToComponentStrings(currentRoute);

    const renderString = convertComponentHtmlToJsx(str, 2, currentRoute);

    return `
import React from 'react';
${importFormsString}
${importHistoryString}

/**
 * ${componentDescription}
 */
const ${componentName} = (props) => {
${useHistoryString + componentPathVariables + componentFormHandlers}

  return (
    ${renderString}
  );
};

export default ${componentName};`;
}