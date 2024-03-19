export const convertComponentHtmlToJsx = (str, startingIndent, currentFormIndex) => {

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

        // replace forms with React form component
        const replaceableForms = newDiv.querySelectorAll('[data-content-form]');
        if (replaceableForms.length > currentFormIndex) {

            const formContainer = document.createElement('div');
            formContainer.appendChild(replaceableForms[currentFormIndex]);
            div.innerHTML = formContainer.innerHTML;
        }
    }

    return format(div, startingIndent).innerHTML.trim()
        .replace(/(data-content-form=)(")([^"]+)(")/g, 'onSubmit={handleFormSubmit}')
        .replace(/(&lt;)/g, '<')
        .replace(/(&gt;)/g, '>');
};

export const generateFormComponentCode = (str, currentFormIndex, formProps) => {
    const renderString = convertComponentHtmlToJsx(str, 2, currentFormIndex);
    const componentName = formProps?.filename ?? `Form${currentFormIndex+1}`;

    return `
import React from 'react';

const ${componentName} = ({onSubmit}) => {
  const handleFormSubmit = (evt) => {
    const formData = Object.fromEntries(new FormData(evt.target));
    return onSubmit(formData);
  };

  return (
    ${renderString}
  );
};

export default ${componentName};`;
}