const pageContent: string = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Reliant</title>
        <meta charset="utf-8">
    </head>
    <body>
        <div id="container">
            <div id="group-2">
                <!-- Switchers -->
                <div id="switchers-container">
                    <span class="header">Switchers Left</span>
                    <span class="information" id="num-switchers">0</span>
                    <div class="buttonblock">
                        <input type="button" id="clear-switchers" value="Clear Switchers">
                    </div>
                </div>
                <!-- Status -->
                <div id="status-container">
                    <span id="status-header" class="header">Status</span>
                    <span id="status" class="information">N/A</span>
                </div>
                <!-- Current WA Nation -->
                <div id="current-wa-nation-container">
                    <div class="buttonblock">
                        <input type="button" class="ajaxbutton" id="update-localid" value="Update Localid">
                        <input type="button" class="ajaxbutton" id="update-wa-status" value="Update">
                    </div>
                    <span id="current-wa-nation-header" class="header">Current WA Nation</span>
                    <div class="buttonblock">
                        <input type="button" id="resign" value="Resign" class="ajaxbutton">
                        <input type="button" id="admit" value="Admit on Next Switcher" class="ajaxbutton">
                    </div>
                    <span id="current-wa-nation" class="information">N/A</span>
                </div>
                <!-- Did I Update? -->
                <div id="did-i-update-container">
                    <span class="header">Did I Update?</span>
                    <input type="button" class="ajaxbutton" id="check-if-updated" value="Did I Update?">
                    <div class="information">
                        <ul id="did-i-update">
                        </ul>
                    </div>
                </div>
            </div>
            <div id="group-3">
                <!-- Endorsing -->
                <div id="endorse-container">
                    <span id="endorse-header" class="header">Endorse</span>
                    <div class="buttonblock">
                        <input type="button" id="refresh-endorse" value="Refresh" class="ajaxbutton">
                    </div>
                    <ul class="information" id="nations-to-endorse">
                    </ul>
                </div>
                <!-- Dossier -->
                <div id="dossier-container">
                    <span id="dossier-header" class="header">Dossier</span>
                    <div class="buttonblock">
                        <input type="button" id="refresh-dossier" value="Refresh" class="ajaxbutton">
                        <label for="raider-jp">Raider Jump Point</label>
                        <input type="text" id="raider-jp">
                        <input type="button" id="set-raider-jp" value="Set">
                    </div>
                    <ul class="information" id="nations-to-dossier">
                    </ul>
                </div>
            </div>
            <div id="group-4">
                <!-- JP Happenings -->
                <div id="jp-happenings-container">
                    <span class="header">JP Happenings</span>
                    <ul class="information" id="jp-happenings">
                    </ul>
                </div>
                <!-- Raider Happenings -->
                <div id="raider-happenings-container">
                    <span class="header">Raider Happenings</span>
                    <ul class="information" id="raider-happenings">
                    </ul>
                </div>
            </div>
            <div id="group-5">
                <!-- Chasing -->
                <div id="chasing-container">
                    <span id="chasing-header" class="header">Chasing</span>
                    <span class="subheader">JP</span>
                    <input type="button" id="move-to-jp" value="Move to JP" class="ajaxbutton">
                    <span class="subheader">Chase</span>
                    <input type="button" id="chasing-button" value="Refresh" class="ajaxbutton">
                </div>
                <!-- Current Region -->
                <div id="current-region-container">
                    <span id="current-region-header" class="header">Current Region</span>
                    <span id="current-region" class="information">N/A</span>
                    <span class="subheader">WA Delegate</span>
                    <span class="information" id="wa-delegate">N/A</span>
                    <span class="subheader">Last WA Update</span>
                    <span class="information" id="last-wa-update">N/A</span>
                    <input type="button" class="ajaxbutton" id="update-region-status" value="Update">
                    <input type="button" class="ajaxbutton" id="check-current-region" value="Check Current Region">
                    <input type="hidden" id="delegate-nation" value="N/A">
                    <input type="button" class="ajaxbutton" id="endorse-delegate" value="Endorse Delegate">
                    <input type="button" id="copy-win" value="Copy Win">
                </div>
                <!-- Reports Container -->
                <div id="reports-container">
                    <span class="header">Reports</span>
                    <ul id="reports" class="information">
                    </ul>
                </div>
            </div>
            <div id="group-6">
                <!-- Current Region Happenings -->
                <div id="current-region-happenings-container">
                    <span class="header">Region Happenings</span>
                    <ul class="information" id="region-happenings">
                    </ul>
                </div>
                <!-- World Happenings-->
                <div id="world-happenings-container">
                    <span class="header" id="world-happenings-header">World Happenings</span>
                    <input type="button" class="ajaxbutton" id="update-world-happenings" value="Update">
                    <ul class="information" id="world-happenings">
                    </ul>
                </div>
            </div>
        </div>
    </body>
</html>
`;

document.open();
document.write(pageContent);
document.close();

// testing
let inQuery = false;

/*
 * Dynamic Information
 */

const status: HTMLElement = document.querySelector('#status');
const currentWANation: HTMLElement = document.querySelector('#current-wa-nation');
const nationsToEndorse: HTMLElement = document.querySelector('#nations-to-endorse');
const nationsToDossier: HTMLElement = document.querySelector('#nations-to-dossier');
const switchers: HTMLElement = document.querySelector('#switchers');
const currentRegion: HTMLElement = document.querySelector('#current-region');
const didIUpdate: HTMLElement = document.querySelector('#did-i-update');
const reports: HTMLElement = document.querySelector('#reports');
const regionHappenings: HTMLElement = document.querySelector('#region-happenings');
const worldHappenings: HTMLElement = document.querySelector('#world-happenings');

/*
 * Things to keep track of
 */

let nationsDossiered: string[] = [];
let nationsEndorsed: string[] = [];

/*
 * Helpers
 */

function makeAjaxQuery(url: string, method: string, data: object): string
{
    let ajaxButtons = document.querySelectorAll('.ajaxbutton');
    return new Promise((resolve, reject) =>
    {
        function onLoadStart(e: Event): void
        {
            if (inQuery)
                xhr.abort();
            // for adhering to the simultaneity rule
            for (let i = 0; i != ajaxButtons.length; i++)
                ajaxButtons[i].disabled = true;
            inQuery = true;
        }

        async function onLoadEnd(e: Event): void
        {
            for (let i = 0; i != ajaxButtons.length; i++)
                ajaxButtons[i].disabled = false;
            inQuery = false;
            resolve(xhr.response);
        }

        let xhr = new XMLHttpRequest();
        xhr.addEventListener('loadstart', onLoadStart);
        xhr.addEventListener('loadend', onLoadEnd);
        xhr.open(method, url);
        xhr.responseType = 'text';
        if (data !== undefined)
            xhr.send(data);
        else
            xhr.send();
    });
}

async function manualLocalIdUpdate(e: MouseEvent): void
{
    chrome.storage.local.set({'switchstate': '0'});
    console.log('manually updating localid');
    let response = await makeAjaxQuery('/region=rwby', 'GET');
    getLocalId(response);
    status.innerHTML = 'Updated localid.';
}

async function manualChkUpdate(e: MouseEvent): void
{
    let response = await makeAjaxQuery('/page=un', 'GET');
    getChk(response);
    // while we're getting the chk, we may as well check the current nation too
    let nationNameRegex = new RegExp('<body id="loggedin" data-nname="([A-Za-z0-9_-]+?)">');
    currentWANation.innerHTML = nationNameRegex.exec(response)[1];
}

/*
 * Event Handlers
 */

function resignWA(e: MouseEvent): void
{
    chrome.storage.local.get('chk', async (result) =>
    {
        const chk = result.chk;
        let formData = new FormData();
        formData.set('action', 'leave_UN');
        formData.set('chk', chk);
        const response = await makeAjaxQuery('/page=UN_status', 'POST', formData);
        if (response.indexOf('You inform the World Assembly that') !== -1) {
            currentWANation.innerHTML = 'N/A';
            const nationNameRegex = new RegExp('<body id="loggedin" data-nname="([A-Za-z0-9_-]+?)">');
            const match = nationNameRegex.exec(response);
            status.innerHTML = `Resigned from the WA on ${match[1]}`;
            chrome.storage.local.set({'switchstate': '1'});
        }
    });
}

function admitWA(e: MouseEvent): void
{
    chrome.storage.local.get('switchers', async (result) =>
    {
        // storedswitchers is an object of nation:appid pairs
        // reset stuff
        document.querySelector('#chasing-button').value = 'Refresh';
        document.querySelector('#move-to-jp').value = 'Move to JP';
        currentRegion.innerHTML = 'N/A';
        document.querySelector('#wa-delegate').innerHTML = 'N/A';
        document.querySelector('#last-wa-update').innerHTML = 'N/A';
        nationsToEndorse.innerHTML = '';
        nationsToDossier.innerHTML = '';
        nationsDossiered = [];
        nationsEndorsed = [];

        let storedSwitchers = result.switchers;
        let switcherNames = Object.keys(storedSwitchers);
        let selectedSwitcher = switcherNames[0];
        let formData = new FormData();
        formData.set('nation', selectedSwitcher);
        formData.set('appid', storedSwitchers[selectedSwitcher]);
        let response = await makeAjaxQuery('/cgi-bin/join_un.cgi', 'POST', formData);
        if (response.indexOf('Welcome to the World Assembly, new member') !== -1) {
            currentWANation.innerHTML = pretty(selectedSwitcher);
            status.innerHTML = `Admitted to the WA on ${selectedSwitcher}.`;
            // Update Chk
            getChk(response);
            chrome.storage.local.set({'switchstate': '2'});
        }
        else
            status.innerHTML = `Error admitting to the WA on ${selectedSwitcher}.`;
        delete storedSwitchers[selectedSwitcher];
        chrome.storage.local.set({'switchers': storedSwitchers});
    });
}

function refreshEndorse(e: MouseEvent): void
{
    const jpHappenings = document.querySelector('#jp-happenings');
    nationsToEndorse.innerHTML = '';
    jpHappenings.innerHTML = '';
    chrome.storage.local.get(['jumppoint', 'endorsehappeningscount'], async (result) =>
    {
        const maxHappeningsCount = Number(result.endorsehappeningscount) || 10;
        const jumpPoint = result.jumppoint || 'artificial_solar_system';
        let response = await makeAjaxQuery(`/page=ajax2/a=reports/view=region.${jumpPoint}/filter=move+member+endo`,
            'GET');
        const nationNameRegex = new RegExp('nation=([A-Za-z0-9_-]+)');
        // only so we can use queryselector on the response DOM rather than using regex matching
        let div = document.createElement('div');
        div.innerHTML = response;
        let lis = div.querySelectorAll('li');
        let resigned: string[] = [];
        let happeningsAdded: number = 0;
        for (let i = 0; i != lis.length; i++) {
            // update the jp happenings at the same time so we don't have to make an extra query
            if (happeningsAdded < maxHappeningsCount) {
                let liAnchors = lis[i].querySelectorAll('a');
                // fix links
                for (let j = 0; j != liAnchors.length; j++)
                    liAnchors[j].href = liAnchors[j].href.replace('page=blank/', '');
                jpHappenings.innerHTML += `<li>${lis[i].innerHTML}</li>`;
                happeningsAdded++;
            }
            const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a:nth-of-type(1)').href);
            const nationName = nationNameMatch[1];
            // don't allow us to endorse ourself
            if (canonicalize(nationName) === canonicalize(currentWANation.innerHTML))
                resigned.push(nationName);
            // don't allow us to endorse the same nation more than once per switch
            if (nationsEndorsed.indexOf(nationName) !== -1)
                resigned.push(nationName);
            // Don't include nations that probably aren't in the WA
            if (lis[i].innerHTML.indexOf('resigned from') !== -1)
                resigned.push(nationName);
            else if (lis[i].innerHTML.indexOf('was admitted') !== -1) {
                if (resigned.indexOf(nationName) === -1) {
                    function onEndorseClick(e: MouseEvent)
                    {
                        chrome.storage.local.get('localid', async (localidresult) =>
                        {
                            e.target.setAttribute('data-clicked', '1');
                            const localId = localidresult.localid;
                            let formData = new FormData();
                            formData.set('nation', nationName);
                            formData.set('localid', localId);
                            formData.set('action', 'endorse');
                            let endorseResponse = await makeAjaxQuery('/cgi-bin/endorse.cgi', 'POST', formData);
                            if (endorseResponse.indexOf('Failed security check.') !== -1)
                                status.innerHTML = `Failed to endorse ${nationName}.`;
                            else {
                                status.innerHTML = `Endorsed ${nationName}.`;
                                nationsEndorsed.push(nationName);
                                e.target.parentElement.removeChild(e.target);
                            }
                        });
                    }

                    let endorseButton: Element = document.createElement('input');
                    endorseButton.setAttribute('type', 'button');
                    endorseButton.setAttribute('data-clicked', '0');
                    endorseButton.setAttribute('class', 'ajaxbutton endorse');
                    endorseButton.setAttribute('value', `Endorse ${pretty(nationName)}`);
                    endorseButton.addEventListener('click', onEndorseClick);
                    let endorseLi = document.createElement('li');
                    endorseLi.appendChild(endorseButton);
                    nationsToEndorse.appendChild(endorseLi);
                }
            }
        }
    });
}

function refreshDossier(e: MouseEvent): void
{
    const raiderHappenings = document.querySelector('#raider-happenings');
    raiderHappenings.innerHTML = '';
    nationsToDossier.innerHTML = '';
    chrome.storage.local.get(['raiderjp', 'dossierhappeningscount'], async (result) =>
    {
        const maxHappeningsCount = Number(result.dossierhappeningscount) || 10;
        const raiderJp = result.raiderjp;
        let response = await makeAjaxQuery(`/page=ajax2/a=reports/view=region.${raiderJp}/filter=move+member+endo`,
            'GET');
        const nationNameRegex = new RegExp('nation=([A-Za-z0-9_-]+)');
        // only so we can use queryselector on the response DOM rather than using regex matching
        let div = document.createElement('div');
        div.innerHTML = response;
        let lis = div.querySelectorAll('li');
        let resigned: string[] = [];
        let happeningsAdded: number = 0;
        for (let i = 0; i != lis.length; i++) {
            // update the raider jp happenings at the same time so we don't have to make an extra query (max 10)
            if (happeningsAdded < maxHappeningsCount) {
                let liAnchors = lis[i].querySelectorAll('a');
                // fix link
                for (let j = 0; j != liAnchors.length; j++)
                    liAnchors[j].href = liAnchors[j].href.replace('page=blank/', '');
                raiderHappenings.innerHTML += `<li>${lis[i].innerHTML}</li>`;
                happeningsAdded++;
            }
            const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a:nth-of-type(1)').href);
            const nationName = nationNameMatch[1];
            // don't let us dossier the same nation twice
            if (nationsDossiered.indexOf(nationName) !== -1)
                resigned.push(nationName);
            // Don't include nations that probably aren't in the WA
            if (lis[i].innerHTML.indexOf('resigned from') !== -1)
                resigned.push(nationName);
            else if (lis[i].innerHTML.indexOf('was admitted') !== -1) {
                if (resigned.indexOf(nationName) === -1) {
                    async function onDossierClick(e: MouseEvent): void
                    {
                        e.target.setAttribute('data-clicked', '1');
                        let formData = new FormData();
                        formData.set('nation', nationName);
                        formData.set('action', 'add');
                        let dossierResponse = await makeAjaxQuery('/page=dossier', 'POST', formData);
                        if (dossierResponse.indexOf('has been added to your Dossier.' !== -1)) {
                            status.innerHTML = `Dossiered ${nationName}`;
                            nationsDossiered.push(nationName);
                            e.target.parentElement.removeChild(e.target);
                        }
                        else
                            status.innerHTML = `Failed to dossier ${nationName}.`;
                    }

                    let dossierButton = document.createElement('input');
                    dossierButton.setAttribute('type', 'button');
                    dossierButton.setAttribute('class', 'ajaxbutton dossier');
                    // so our key doesn't click it more than once
                    dossierButton.setAttribute('data-clicked', '0');
                    dossierButton.setAttribute('value', `Dossier ${pretty(nationName)}`);
                    dossierButton.addEventListener('click', onDossierClick);
                    let dossierLi = document.createElement('li');
                    dossierLi.appendChild(dossierButton);
                    nationsToDossier.appendChild(dossierLi);
                }
            }
        }
    });
}

function setRaiderJP(e: MouseEvent): void
{
    const newRaiderJP = canonicalize(document.querySelector('#raider-jp').value);
    chrome.storage.local.set({'raiderjp': newRaiderJP});
}

function moveToJP(e: MouseEvent): void
{
    if (e.target.value == 'Move to JP') {
        chrome.storage.local.get('localid', (localidresult) =>
        {
            chrome.storage.local.get('jumppoint', async (jumppointresult) =>
            {
                const localId = localidresult.localid;
                const moveRegion = jumppointresult.jumppoint;
                let formData = new FormData();
                formData.set('localid', localId);
                formData.set('region_name', moveRegion);
                formData.set('move_region', '1');
                let response = await makeAjaxQuery('/page=change_region', 'POST', formData);
                if (response.indexOf('This request failed a security check.') !== -1)
                    status.innerHTML = `Failed to move to ${moveRegion}.`;
                else {
                    status.innerHTML = `Moved to ${moveRegion}`;
                    currentRegion.innerHTML = moveRegion;
                }
                e.target.value = 'Update Localid';
            });
        });
    }
    else if (e.target.value == 'Update Localid') {
        manualLocalIdUpdate(e);
        e.target.value = 'Move to JP';
    }
}

async function chasingButton(e: MouseEvent): void
{
    // jump points and such
    const doNotMove = ['devide_by_zero', 'artificial_solar_system', 'trieltics', '3_guys', 'frozen_circle', 'switz',
        'plum_island', 'no_nope_and_nay', 'vienna', 'crystal_falls', 'birb', 'the_allied_nations_of_egalaria'];
    if (e.target.value == 'Refresh') {
        let response = await makeAjaxQuery('/template-overall=none/page=reports', 'GET');
        // only so we can use queryselector on the response DOM rather than using regex matching
        let responseDiv = document.createElement('div');
        responseDiv.innerHTML = response;
        let lis = responseDiv.querySelectorAll('li');
        // add the reports items to the page so we don't have to make a second query for it
        reports.innerHTML = '';
        for (let i = 0; i != lis.length; i++) {
            let liAnchors = lis[i].querySelectorAll('a');
            // fix link
            for (let j = 0; j != liAnchors.length; j++)
                liAnchors[j].href = liAnchors[j].href.replace('page=blank/', '');
            reports.innerHTML += `<li>${lis[i].innerHTML}</li>`;
        }
        let moveRegion = responseDiv.querySelector('.rlink:nth-of-type(3)');
        if (!moveRegion)
            return;
        let moveRegionValue = canonicalize(moveRegion.innerHTML);
        if (doNotMove.indexOf(moveRegionValue) !== -1)
            return;
        // don't allow us to move to the same region
        if (moveRegionValue === currentRegion.innerHTML)
            return;
        let moveRegionParent = moveRegion.parentElement;
        if (moveRegionParent.innerHTML.indexOf('relocated from') === -1)
            return;
        else {
            e.target.value = `Move!`;
            e.target.setAttribute('data-moveregion', moveRegionValue);
        }
    }
    else if (e.target.getAttribute('data-moveregion')) {
        chrome.storage.local.get('localid', async (result) =>
        {
            const localId = result.localid;
            const moveRegion = e.target.getAttribute('data-moveregion');
            let formData = new FormData();
            formData.set('localid', localId);
            formData.set('region_name', moveRegion);
            formData.set('move_region', '1');
            let response = await makeAjaxQuery('/page=change_region', 'POST', formData);
            if (response.indexOf('This request failed a security check.') !== -1)
                status.innerHTML = `Failed to move to ${moveRegion}.`;
            else {
                status.innerHTML = `Moved to ${moveRegion}`;
                currentRegion.innerHTML = moveRegion;
            }
            e.target.value = 'Update Localid';
            e.target.setAttribute('data-moveregion', '');
        });
    }
    else if (e.target.value == 'Update Localid') {
        manualLocalIdUpdate(e);
        e.target.value = 'Refresh';
    }
}

async function updateRegionStatus(e: MouseEvent): void
{
    if (currentRegion.innerHTML == 'N/A')
        return;
    const nationRegex: RegExp = new RegExp('nation=([A-Za-z0-9_-]+)');
    let response = await makeAjaxQuery(`/template-overall=none/region=${currentRegion.innerHTML}`, 'GET');
    let responseDiv = document.createElement('div');
    responseDiv.innerHTML = response;
    // update the region happenings at the same time to not make an extra query
    chrome.storage.local.get('regionhappeningscount', (result) =>
    {
        let regionHappeningsCount: number = Number(result.regionhappeningscount) || 10;
        let regionHappeningsLis = responseDiv.querySelectorAll('ul > li');
        regionHappenings.innerHTML = '';
        console.log(regionHappeningsLis);
        for (let i = 0; i != regionHappeningsCount; i++) {
            let anodes = regionHappeningsLis[i].querySelectorAll('a');
            // fix link
            for (let j = 0; j != anodes.length; j++)
                anodes[j].href = anodes[j].href.replace('page=blank/', '');
            regionHappenings.innerHTML += `<li>${regionHappeningsLis[i].innerHTML}</li>`;
        }
    });
    let strongs = responseDiv.querySelectorAll('strong');
    for (let i = 0; i != strongs; i++) {
        const strongParent = strongs[i].parentElement;
        if (strongs[i].innerHTML == 'WA Delegate:' || strongs[i].innerHTML == 'WA Delegate') {
            const waDelegate = strongParent.querySelector('a');
            if (waDelegate) {
                document.querySelector('#wa-delegate').innerHTML = waDelegate.innerHTML;
                document.querySelector('#delegate-nation').value = nationRegex.exec(strongParent.querySelector('a').href)[1];
            }
            else {
                document.querySelector('#wa-delegate').innerHTML = 'None';
                document.querySelector('#delegate-nation').value = 'N/A';
            }
        }
        else if (strongs[i].innerHTML == 'Last WA Update:') {
            const lastWaUpdate = strongParent.querySelector('time');
            document.querySelector('#last-wa-update').innerHTML = lastWaUpdate.innerHTML;
            break;
        }
    }
}

async function checkCurrentRegion(e: MouseEvent): void
{
    let response = await makeAjaxQuery('/region=artificial_solar_system', 'GET');
    let responseElement = document.createRange().createContextualFragment(response);
    let regionHref = responseElement.querySelector('#panelregionbar > a').href;
    currentRegion.innerHTML = new RegExp('region=([A-Za-z0-9_]+)').exec(regionHref)[1];
}

async function endorseDelegate(e: MouseEvent): void
{
    chrome.storage.local.get('localid', async (localidresult) =>
    {
        const nationName = document.querySelector('#delegate-nation').value;
        if (nationName === 'N/A')
            return;
        const localId = localidresult.localid;
        let formData = new FormData();
        formData.set('nation', nationName);
        formData.set('localid', localId);
        formData.set('action', 'endorse');
        let endorseResponse = await makeAjaxQuery('/cgi-bin/endorse.cgi', 'POST', formData);
        if (endorseResponse.indexOf('Failed security check.') !== -1)
            status.innerHTML = `Failed to endorse ${nationName}.`;
        else
            status.innerHTML = `Endorsed ${nationName}.`;
    });
}

async function checkIfUpdated(e: MouseEvent): void
{
    didIUpdate.innerHTML = '';
    let responseDiv = document.createElement('div');
    responseDiv.innerHTML = await makeAjaxQuery('/page=ajax2/a=reports/view=self/filter=change', 'GET');
    let lis = responseDiv.querySelectorAll('li');
    // limit to max 5 happenings to save space
    for (let i = 0; i != 3; i++) {
        if (typeof lis[i] === 'undefined')
            break;
        else
            didIUpdate.innerHTML += `<li>${lis[i].innerHTML}</li>`;
    }
}

async function updateWorldHappenings(e: MouseEvent): void
{
    worldHappenings.innerHTML = '';
    let response: string = await makeAjaxQuery('/page=ajax2/a=reports/view=world/filter=move+member+endo', 'GET');
    let responseElement: DocumentFragment = document.createRange().createContextualFragment(response);
    let lis = responseElement.querySelectorAll('li');
    // max 10
    chrome.storage.local.get('worldhappeningscount', (result) =>
    {
        let maxHappeningsCount = Number(result.worldhappeningscount) || 10;
        for (let i = 0; i < maxHappeningsCount; i++) {
            let liAnchors = lis[i].querySelectorAll('a');
            // fix link
            for (let j = 0; j != liAnchors.length; j++)
                liAnchors[j].href = liAnchors[j].href.replace('page=blank/', '');
            worldHappenings.innerHTML += `<li>${lis[i].innerHTML}</li>`;
        }
    });
}

function copyWin(e: MouseEvent): void
{
    // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    let copyText = document.createElement('textarea');
    copyText.value = `W: https://www.nationstates.net/region=${currentRegion.innerHTML}`;
    document.body.appendChild(copyText);
    copyText.select();
    document.execCommand('copy');
    document.body.removeChild(copyText);
}

// Update the list of switchers as soon as a new WA admit page is opened
function onStorageChange(changes: object, areaName: string): void
{
    for (let key in changes) {
        let storageChange = changes[key];
        if (key == 'switchers') {
            const newSwitchers: object = storageChange.newValue;
            document.querySelector('#num-switchers').innerHTML = Object.keys(newSwitchers).length;
            break;
        }
    }
}

function clearSwitcherList(e: MouseEvent): void
{
    chrome.storage.local.set({'switchers': {}});
    status.innerHTML = 'Cleared stored switchers.';
}

/*
 * Event Listeners
 */

document.querySelector('#resign').addEventListener('click', resignWA);
document.querySelector('#admit').addEventListener('click', admitWA);
document.querySelector('#refresh-endorse').addEventListener('click', refreshEndorse);
document.querySelector('#refresh-dossier').addEventListener('click', refreshDossier);
document.querySelector('#set-raider-jp').addEventListener('click', setRaiderJP);
document.querySelector('#move-to-jp').addEventListener('click', moveToJP);
document.querySelector('#chasing-button').addEventListener('click', chasingButton);
document.querySelector('#update-localid').addEventListener('click', manualLocalIdUpdate);
document.querySelector('#update-wa-status').addEventListener('click', manualChkUpdate);
document.querySelector('#update-region-status').addEventListener('click', updateRegionStatus);
document.querySelector('#check-current-region').addEventListener('click', checkCurrentRegion);
document.querySelector('#check-if-updated').addEventListener('click', checkIfUpdated);
document.querySelector('#copy-win').addEventListener('click', copyWin);
document.querySelector('#endorse-delegate').addEventListener('click', endorseDelegate);
document.querySelector('#update-world-happenings').addEventListener('click', updateWorldHappenings);
document.querySelector('#clear-switchers').addEventListener('click', clearSwitcherList);
document.addEventListener('keyup', keyPress);
chrome.storage.onChanged.addListener(onStorageChange);

/*
 * Initialization
 */

chrome.storage.local.get('switchers', (result) =>
{
    try {
        document.querySelector('#num-switchers').innerHTML = Object.keys(result.switchers).length;
    } catch(e) {
        // no wa links in storage, do nothing
        if (e instanceof TypeError) {}
    }
});