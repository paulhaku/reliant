if (urlParameters['page'] === 'ajax2') {
    let a = document.querySelectorAll('a');
    let itemRegex: RegExp = new RegExp('page=ajax2\/.+?\/((?:nation|region)=.+)');
    for (let i = 0; i != a.length; i++) {
        const match = itemRegex.exec(a[i].href);
        a[i].href = `/template-overall=none/${match[1]}`;
    }
}