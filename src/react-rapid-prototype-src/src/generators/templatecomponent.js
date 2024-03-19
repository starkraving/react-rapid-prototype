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
    const contentDiv = div.querySelector('[data-content-start]');
    if (contentDiv) {
        contentDiv.removeAttribute('data-content-start');
        contentDiv.innerHTML = '{children}'
    }

    // replace anchor tags with React Link tags
    const replaceableAnchors = div.querySelectorAll('[data-content-exit]');
    for (let a = 0 ; a < replaceableAnchors.length ; a++) {
        let anchorNode = replaceableAnchors[a];
        let textNode = document.createTextNode(`<Link to="${anchorNode.getAttribute('href')}">${anchorNode.innerHTML}</Link>`);
        anchorNode.replaceWith(textNode);
    }

    return format(div, startingIndent).innerHTML.trim()
        .replace(/(&lt;)/g, '<')
        .replace(/(&gt;)/g, '>');
};


export const generateTemplateCode = (str) => {
    const renderString = convertComponentHtmlToJsx(str, 2);

    return `
import React from 'react';

const Template = ({children}) => {
  return (
    ${renderString}
  );
};

export default Template;`;
}