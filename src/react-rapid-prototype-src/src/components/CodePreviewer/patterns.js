export const importline = {
    match: /^(?<a>import)(?<b> )(?<c>{? ?)(?<d>[^}]*)(?<e> ?}?)(?<f> )(?<g>from)(?<h> )(?<i>'[^']*')(?<j>;)/g,
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
};

export const declarationline = {
    match: /^(?<a> *)(?<b>const)(?<c> )(?<d>([a-z][^ ]+)?)(?<e>([A-Z][^ ]+)?)(?<f> = )(?<g>[^\(]*)(?<h>\()(?<i>[^\)]*)(?<j>\))(?<k>\)?)(?<l>( => )?)(?<m>{?)(?<n>;?)/g,
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
        k: '#d0b416',
        l: '#4a83b0',
        m: '#d0b416',
        n: ''
    }
};

export const commentline = {
    match: /^(?<a> *)(?<b>\/\/ TODO: do the thing)/g,
    colors: {
        a: '',
        b: '#6a9955'
    }
};

export const historyline = {
    match: /^(?<a> *)(?<b>history)(?<c>\.)(?<d>push)(?<e>\()(?<f>[^\)]*)(?<g>\))(?<h>;)/g,
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
};

export const closingbrace = {
    match: /^(?<a> *)(?<b>\})(?<c>;?)$/g,
    colors: {
        a: '',
        b: '#d0b416',
        c: ''
    }
}

export const closingbracket = {
    match: /^(?<a> *)(?<b>\))(?<c>;?)$/g,
    colors: {
        a: '',
        b: '#da70d6',
        c: ''
    }
}

export const returnline = {
    match: /^(?<a> *)(?<b>return )(?<c>\()$/g,
    colors: {
        a: '',
        b: '#bc80b6',
        c: '#da70d6'
    }
}

export const exportline = {
    match: /^(?<a>export default )(?<b>[^;]*)(?<c>;)$/g,
    colors: {
        a: '#bc80b6',
        b: '#c7c79b',
        c: ''
    }
}

export const tags = {
    match: /(?<a>[^<]*)(?<b><(\/?))(?<c>[a-zA-Z0-9]+)(?<d>[^>]*)(?<e>>)(?<f>.*)/g,
    colors: {
        a: '',
        b: '#737373',
        c: '#569cd6',
        d: '',
        e: '#737373',
        f: ''
    }
}

export const tagattributes = {
    match: /^(?<a> ([^=]+))(?<b>=)(?<c>")(?<d>[^"]+)(?<e>")(?<f>.*)$/g,
    colors: {
        a: '#80b2cc',
        b: '',
        c: '#ce9178',
        d: '#ce9178',
        e: '#ce9178',
        f: ''
    }
}

export const tagevents = {
    match: /^(?<a> ([^=]+))(?<b>=)(?<c>{)(?<d>[^}]+)(?<e>})(?<f>.*)$/g,
    colors: {
        a: '#80b2cc',
        b: '',
        c: '#d36dce',
        d: '#dbdba9',
        e: '#d36dce',
        f: ''
    }
};