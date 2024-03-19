import React from 'react';

const HighlitLine = ({line}) => {
    let content = line;
    let found = null;
    const rules = [
        {
            match: /^(?<a>import)(?<b> )(?<c>{? ?)(?<d>[^}]*)(?<e> ?}?)(?<f> )(?<g>from)(?<h> )(?<i>'[^']*')(?<j>;)/,
            colors: {
                a: '#bc80b6',
                b: '',
                c: '#dbbe13',
                d: '#92ceed',
                e: '#dbbe13',
                f: '',
                g: '#c586c0',
                h: '',
                i: '#c08871',
                j: ''
            }
        },
        {
            match: /^(?<a> *)(?<b>const)(?<c> )(?<d>([a-z][^ ]+)?)(?<e>([A-Z][^ ]+)?)(?<f> = )(?<g>[^\(]*)(?<h>\()(?<i>[^\)]*)(?<j>\))(?<k>( => )?)(?<l>{?)(?<m>;?)/,
            colors: {
                a: '',
                b: '#4a83b0',
                c: '',
                d: '#52c1ff',
                e: '#c7c79b',
                f: '',
                g: '#c7c79b',
                h: '#d0b416',
                i: '#9bdbfc',
                j: '#d0b416',
                k: '#4a83b0',
                l: '#d0b416',
                m: ''
            }
        },
        {
            match: /^(?<a> *)(?<b>\/\/ TODO: do the thing)/,
            colors: {
                a: '',
                b: '#6a9955'
            }
        },
        {
            match: /^(?<a> *)(?<b>history)(?<c>\.)(?<d>push)(?<e>\()(?<f>[^\)]*)(?<g>\))(?<h>;)/,
            colors: {
                a: '',
                b: '#52c1ff',
                c: '',
                d: '#dcdcaa',
                e: '#da70d6',
                f: '#ce9178',
                g: '#da70d6',
                h: ''
            }
        },
        {
            match: /^(?<a> *)(?<b>\})(?<c>;?)$/,
            colors: {
                a: '',
                b: '#d0b416',
                c: ''
            }
        },
        {
            match: /^(?<a> *)(?<b>\))(?<c>;?)$/,
            colors: {
                a: '',
                b: '#da70d6',
                c: ''
            }
        },
        {
            match: /^(?<a> *)(?<b>return )(?<c>\()$/,
            colors: {
                a: '',
                b: '#bc80b6',
                c: '#da70d6'
            }
        },
        {
            match: /^(?<a>export default )(?<b>[^;]*)(?<c>;)$/,
            colors: {
                a: '#bc80b6',
                b: '#c7c79b',
                c: ''
            }
        }
    ]
    
    for (let r = 0 ; r < rules.length ; r++) {
        let rule = rules[r];
        found = line.match(rule.match);
        if (found && found.groups) {
            content = [];
            for (const key in found.groups) {
                const value = found.groups[key];
                content.push(
                    value.length > 0 && rule.colors[key].length > 0
                        ? <span key={key} style={{color: rule.colors[key]}}>{value}</span>
                        : value
                )
            }
            break;
        }
    }
    
    return (
        <div style={{lineHeight: '1.4em', minHeight: '1.4em'}}>{content}</div>
    );
};

const SyntaxHighlighter = ({str}) => {
    const lines = str.split("\n");
    return (
        <code>
            <pre>
                {
                    lines.map((line, idx) => <HighlitLine key={idx} line={line}  />)
                }
            </pre>
        </code>
    );
}

export default SyntaxHighlighter;