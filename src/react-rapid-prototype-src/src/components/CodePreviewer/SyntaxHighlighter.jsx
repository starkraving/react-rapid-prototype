import React from 'react';
import {
    importline,
    declarationline,
    commentline,
    historyline,
    closingbrace,
    closingbracket,
    returnline,
    exportline,
    tags,
    tagattributes,
    tagevents,
    reactline,
    multicommentline
} from './patterns';

const rules = [
    importline,
    declarationline,
    commentline,
    historyline,
    closingbrace,
    closingbracket,
    returnline,
    exportline,
    tags,
    tagattributes,
    tagevents,
    reactline,
    multicommentline
];

const applyHighlighting = (str, row, iter = 0) => {
    let content = str;
    let found = null;

    for (let r = 0 ; r < rules.length ; r++) {
        let rule = rules[r];
        found = [...str.matchAll(rule.match)];
        if (found && found.length > 0) {
            content = [];
            for (let f = 0 ; f < found.length ; f++) {
                let subMatch = found[f];
                if (subMatch.groups) {
                    for (const key in subMatch.groups) {
                        const value = subMatch.groups[key];
                        content.push(
                            value.length > 0 && rule.colors[key].length > 0
                                ? <span key={`${key}_${row}_${iter}_${r}_${f}`} style={{color: rule.colors[key]}}>{value}</span>
                                : (value.length > 0 ? applyHighlighting(value, row, (iter+1)) : value)
                        )
                    }
                }
            }
            
            break;
        }
    }

    return Array.isArray(content) ? content.flat() : str;
};

const HighlitLine = ({line, row}) => {
    return (
        <div style={{lineHeight: '1.4em', minHeight: '1.4em'}}>{applyHighlighting(line, row)}</div>
    );
};

const SyntaxHighlighter = ({str}) => {
    const lines = str.split("\n");
    return (
        <code>
            <pre>
                {
                    lines.map((line, idx) => <HighlitLine key={idx} row={idx} line={line} />)
                }
            </pre>
        </code>
    );
}

export default SyntaxHighlighter;