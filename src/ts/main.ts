/*
 * Helpers
 */

function canonicalize(str: string): string
{
    return str.trim().toLowerCase().replace(/ /g, '_');
}

function getUrlParameters(url: string): object
{
    const reg: RegExp = new RegExp('\/([A-Za-z0-9-]+?)=([A-Za-z0-9_.+]+)', 'g');
    let params: object = {};
    let match: Match;
    while ((match = reg.exec(url)) !== null)
        params[match[1]] = match[2];
    return params;
}

function pretty(str: string): string
{
    return str.replace(/_/g, ' ').replace(/\w+\s*/g, (txt: string) => txt.charAt(0).toUpperCase()
    + txt.substr(1).toLowerCase());
}

const urlParameters: object = getUrlParameters(document.URL);

/*
 * Keybind Handling
 */

function keyPress(e: KeyboardEvent): void
{
    const textboxSelected: HTMLElement = document.querySelector('input:focus, textarea:focus');
    if (e.ctrlKey || e.altKey || e.shiftKey)
        return;
    else if (textboxSelected)
        return;
    const pressedKey: string = e.key.toUpperCase();
}

document.addEventListener('keyup', keyPress);

/*
 * Keybind Functionality
 */

let keys: object = {};

chrome.storage.local.get('movekey', (result) =>
{
    const moveKey = result.movekey || 'X';
    keys[moveKey] = () =>
    {
        const moveButton = document.querySelector('button[name=move_region]');
        if (moveButton)
            moveButton.click();
        else if (urlParameters['page'] === 'reports')
            document.querySelector('li > a:nth-of-type(3)').click();
    };
});

/*
 * Miscellaneous
 */

const settingsParent = document.querySelector('.belspacer.belspacermain');
if (settingsParent) {
    // Settings Button
    let settingsDiv = document.createElement('div');
    settingsDiv.setAttribute('class', 'bel');
    let settingsButton = document.createElement('button');
    settingsButton.setAttribute('id', 'reliant-settings');
    settingsButton.setAttribute('class', 'button');
    settingsButton.innerHTML = 'Reliant Settings';
    settingsDiv.appendChild(settingsButton);

    // Main Reliant Button
    let reliantButton = document.createElement('button');
    reliantButton.setAttribute('id', 'reliant-main');
    reliantButton.setAttribute('class', 'button');
    reliantButton.innerHTML = 'Reliant';
    settingsDiv.appendChild(reliantButton);
    settingsParent.insertBefore(settingsDiv, settingsParent.firstChild);
    document.querySelector('#reliant-settings').addEventListener('click', (e: MouseEvent) =>
    {
        window.location.href = '/page=blank/reliant_settings';
    });
    document.querySelector('#reliant-main').addEventListener('click', (e: MouseEvent) =>
    {
        window.location.href = '/template-overall=none/page=blank/reliant';
    });
}