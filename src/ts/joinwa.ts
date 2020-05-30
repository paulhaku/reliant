function addSwitcher(switcher: string, appid: string): void
{
    chrome.storage.local.get('switchers', (result) => {
        let switchers: object;
        if (result.switchers !== undefined)
            switchers = result.switchers;
        else
            switchers = {};
        if (switcher in switchers)
            return;
        else
            switchers[switcher] = appid;
        chrome.storage.local.set({'switchers': switchers});
    });
}

if (urlParameters['page'] === 'join_WA') {
    const switcherRegex: RegExp = new RegExp(`nation=([A-Za-z0-9_]+?)&appid=([0-9]+)`, 'g');
    const match = switcherRegex.exec(document.URL);
    addSwitcher(match[1], match[2]);
}