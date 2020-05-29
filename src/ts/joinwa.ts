function addSwitcher(switcher: string, appid: string): void
{
    chrome.storage.local.get('switchers', (result) => {
        let oldSwitchers: object[];
        if (result.switchers !== undefined)
            oldSwitchers = result.switchers;
        else
            oldSwitchers = [];
        console.log(typeof(oldSwitchers));
        let switcherObject: object = {
            'name': switcher,
            'appid': appid
        };
        oldSwitchers.push(switcherObject);
        chrome.storage.local.set({'switchers': oldSwitchers});
    });
}

if (urlParameters['page'] === 'join_WA') {
    const switcherRegex: RegExp = new RegExp(`nation=([A-za-z0-9_]+?)&appid=([0-9]+)`, 'g');
    const match = switcherRegex.exec(document.URL);
    addSwitcher(match[1], match[2]);
}