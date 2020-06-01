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

function getLocalId(page: string): void
{
    const localId = document.querySelector("input[name=localid]");
    if (localId)
        chrome.storage.local.set({'localid': localId.value});
    else if (page) {
        const localIdRegex: RegExp = new RegExp('<input type="hidden" name="localid" value="([A-Za-z0-9]+?)">');
        const match = localIdRegex.exec(page);
        chrome.storage.local.set({'localid': match[1]});
    }
    else
        return;
}

function getChk(page: string): void
{
    const chk = document.querySelector("input[name=chk]");
    if (chk)
        chrome.storage.local.set({'chk': chk.value});
    else if (page) {
        const chkRegex: RegExp = new RegExp('<input type="hidden" name="chk" value="([A-Za-z0-9]+?)">');
        const match = chkRegex.exec(page);
        chrome.storage.local.set({'chk': match[1]});
    }
    else
        return;
}

const urlParameters: object = getUrlParameters(document.URL);
if (urlParameters["page"] !== "blank") {
    getLocalId();
    getChk();
}

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
    // ignore caps lock
    const pressedKey: string = e.key.toUpperCase();
    if (pressedKey in keys)
        keys[pressedKey]();
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
        else if (urlParameters['reliant'] === 'main')
            document.querySelector('#chasing-button').click();
    };
});

chrome.storage.local.get('jpkey', (result) =>
{
    chrome.storage.local.get('jumppoint', (jpresult) =>
    {
        const jpKey = result.jpkey || 'V';
        const jumpPoint = jpresult.jumppoint || 'artificial_solar_system';
        keys[jpKey] = () =>
        {
            const moveButton = document.querySelector('button[name=move_region]');
            if (urlParameters['region'] === jumpPoint)
                moveButton.click();
            else if (urlParameters['reliant'] === 'main')
                document.querySelector('#move-to-jp').click();
            else
                window.location.href = `/template-overall=none/region=${jumpPoint}`;
        };
    });
});

chrome.storage.local.get('mainpagekey', (result) =>
{
    const mainPageKey = result.mainpagekey || ' ';
    keys[mainPageKey] = () =>
    {
        window.location.href = '/template-overall=none/page=blank/reliant=main';
    }
});

chrome.storage.local.get("resignkey", (result) =>
{
    const resignKey = result.resignkey || "'";
    keys[resignKey] = () =>
    {
        chrome.storage.local.get('switchstate', (switchstateresult) =>
        {
            const currentSwitchState = switchstateresult.switchstate;
            if (urlParameters["page"] === "join_WA")
                document.querySelector("button[class=\"button primary icon approve big\"").click();
            else if (urlParameters['reliant'] === 'main') {
                // In the WA with a valid localid
                if (currentSwitchState === '0')
                    document.querySelector('#resign').click();
                // Not in the WA, waiting to admit on a new switcher
                else if (currentSwitchState === '1')
                    document.querySelector('#admit').click();
                // Admitted on a new switcher, waiting to update localid
                else if (currentSwitchState === '2')
                    document.querySelector('#update-localid').click();
            }
        });
    };
});

chrome.storage.local.get("dossierkey", (result) =>
{
    const dossierKey = result.dossierkey || 'M';
    keys[dossierKey] = () =>
    {
        if (urlParameters["page"] === "dossier")
            document.querySelector("button[name=clear_dossier]").click();
        else
            window.location.href = "/template-overall=none/page=dossier";
    };
});

chrome.storage.local.get("dossiernationkey", (result) =>
{
    const dossierNationKey = result.dossiernationkey || 'N';
    keys[dossierNationKey] = () =>
    {
        const dossierButton = document.querySelector("button[value=add]");
        if (dossierButton)
            dossierButton.click();
        else if (urlParameters['reliant'] === 'main') {
            let refreshButton = document.querySelector('#refresh-dossier');
            let dossierButton = document.querySelector('.dossier[data-clicked="0"]');
            if (!dossierButton)
                refreshButton.click();
            else
                dossierButton.click();
        }
    };
});

chrome.storage.local.get("endorsekey", (result) => {
    const endorseKey = result.endorsekey || 'Z';
    keys[endorseKey] = () => {
        const endorseButton = document.querySelector("button[class=\"endorse button icon wa\"]");
        if (endorseButton)
            endorseButton.click();
        else if (urlParameters['reliant'] === 'main') {
            let refreshButton = document.querySelector('#refresh-endorse');
            let endorseButton = document.querySelector('.endorse[data-clicked="0"]');
            if (!endorseButton)
                refreshButton.click();
            else
                endorseButton.click();
        }
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
        window.location.href = '/page=blank/reliant=settings';
    });
    document.querySelector('#reliant-main').addEventListener('click', (e: MouseEvent) =>
    {
        window.location.href = '/template-overall=none/page=blank/reliant=main';
    });
}