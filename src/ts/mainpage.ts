const pageContent: string = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Reliant</title>
        <meta charset="utf-8">
    </head>
    <body>
        <div id="container">
            <div id="group-1">
                <!-- Switchers -->
                <div id="switchers-container">
                    <span class="header">Switchers Left</span>
                    <span class="subheader" id="num-switchers">0</span>
                    <div class="information">
                        <ul id="switchers">
                        </ul>
                    </div>
                </div>
            </div>
            <div id="group-2">
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
        </div>
    </body>
</html>
`;

document.open();
document.write(pageContent);
document.close();

/*
 * Dynamic Information
 */

const status: HTMLElement = document.querySelector("#status");
const currentWANation: HTMLElement = document.querySelector("#current-wa-nation");
const nationsToEndorse: HTMLElement = document.querySelector("#nations-to-endorse");
const nationsToDossier: HTMLElement = document.querySelector("#nations-to-dossier");
const switchers: HTMLElement = document.querySelector("#switchers");
const currentRegion: HTMLElement = document.querySelector("#current-region");
const didIUpdate: HTMLElement = document.querySelector("#did-i-update");
const reports: HTMLElement = document.querySelector('#reports');

/*
 * Helpers
 */

function resetSwitchers(switcherList: string[]): void
{
    const toAdd = Object.keys(switcherList);
    switchers.innerHTML = '';
    for (let i = 0; i != toAdd.length; i++)
        switchers.innerHTML += `<li>${toAdd[i]}</li>`;
}

function makeAjaxQuery(url: string, method: string, data: object): string
{
    return new Promise((resolve, reject) => {
        function onLoadStart(e: Event): void
        {
            // for adhering to the simultaneity rule
            document.querySelectorAll('.ajaxbutton').forEach(node => {
                node.disabled = true;
            });
        }

        async function onLoadEnd(e: Event): void
        {
            document.querySelectorAll('.ajaxbutton').forEach(node => {
                node.disabled = false;
            });
            resolve(xhr.response);
        }

        let xhr = new XMLHttpRequest();
        xhr.addEventListener("loadstart", onLoadStart);
        xhr.addEventListener("loadend", onLoadEnd);
        xhr.open(method, url);
        xhr.responseType = "text";
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
    chrome.storage.local.get('chk', async (result) => {
        const chk = result.chk;
        let formData = new FormData();
        formData.set('action', 'leave_UN');
        formData.set('chk', chk);
        const response = await makeAjaxQuery("/page=UN_status", "POST", formData);
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
    chrome.storage.local.get('switchers', async (result) => {
        // storedswitchers is an object of nation:appid pairs
        let storedSwitchers = result.switchers;
        let switcherNames = Object.keys(storedSwitchers);
        let selectedSwitcher = switcherNames[0];
        let formData = new FormData();
        formData.set('nation', selectedSwitcher);
        formData.set('appid', storedSwitchers[selectedSwitcher]);
        let response = await makeAjaxQuery("/cgi-bin/join_un.cgi", "POST", formData);
        if (response.indexOf("Welcome to the World Assembly, new member") !== -1) {
            currentWANation.innerHTML = pretty(selectedSwitcher);
            status.innerHTML = `Admitted to the WA on ${selectedSwitcher}.`;
            // Update Chk
            getChk(response);
            chrome.storage.local.set({'switchstate': '2'});
        }
        else
            status.innerHTML = `Error admitting to the WA on ${selectedSwitcher}.`;
        delete storedSwitchers[selectedSwitcher];
        chrome.storage.local.set({"switchers": storedSwitchers});
    });
}

function refreshEndorse(e: MouseEvent): void
{
    const jpHappenings = document.querySelector("#jp-happenings");
    nationsToEndorse.innerHTML = '';
    jpHappenings.innerHTML = '';
    chrome.storage.local.get('jumppoint', async (result) => {
        const jumpPoint = result.jumppoint;
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
            // update the jp happenings at the same time so we don't have to make an extra query (max 10)
            if (happeningsAdded <= 10) {
                lis[i].querySelectorAll('a').forEach((node) => {
                    node.href = node.href.replace('page=blank/', '');
                });
                jpHappenings.innerHTML += `<li>${lis[i].innerHTML}</li>`;
                happeningsAdded++;
            }
            const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a:nth-of-type(1)').href);
            const nationName = nationNameMatch[1];
            // Don't include nations that probably aren't in the WA
            if (lis[i].innerHTML.indexOf('resigned from') !== -1)
                resigned.push(nationName);
            else if (lis[i].innerHTML.indexOf('was admitted') !== -1) {
                if (resigned.indexOf(nationName) === -1) {
                    function onEndorseClick(e: MouseEvent)
                    {
                        chrome.storage.local.get('localid', async (localidresult) => {
                            e.target.setAttribute('data-clicked', '1');
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
    const raiderHappenings = document.querySelector("#raider-happenings");
    raiderHappenings.innerHTML = '';
    nationsToDossier.innerHTML = '';
    chrome.storage.local.get('raiderjp', async (result) => {
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
            // update the jp happenings at the same time so we don't have to make an extra query (max 10)
            if (happeningsAdded <= 10) {
                lis[i].querySelectorAll('a').forEach((node) => {
                    node.href = node.href.replace('page=blank/', '');
                });
                raiderHappenings.innerHTML += `<li>${lis[i].innerHTML}</li>`;
                happeningsAdded++;
            }
            const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a:nth-of-type(1)').href);
            const nationName = nationNameMatch[1];
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
                        if (dossierResponse.indexOf('has been added to your Dossier.' !== -1))
                            status.innerHTML = `Dossiered ${nationName}`;
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
    const newRaiderJP = canonicalize(document.querySelector("#raider-jp").value);
    chrome.storage.local.set({"raiderjp": newRaiderJP});
}

function moveToJP(e: MouseEvent): void
{
    if (e.target.value == 'Move to JP') {
        chrome.storage.local.get('localid', (localidresult) => {
            chrome.storage.local.get('jumppoint', async (jumppointresult) => {
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
    'plum_island', 'no_nope_and_nay', 'vienna', 'crystal_falls'];
    if (e.target.value == "Refresh") {
        let response = await makeAjaxQuery('/template-overall=none/page=reports', 'GET');
        // only so we can use queryselector on the response DOM rather than using regex matching
        let responseDiv = document.createElement('div');
        responseDiv.innerHTML = response;
        let lis = responseDiv.querySelectorAll('li');
        // add the reports items to the page so we don't have to make a second query for it
        lis.forEach((node) => {
            // fix link
            node.querySelectorAll('a').forEach((anode) => {
                anode.href = anode.href.replace('page=blank/', '');
            });
            reports.innerHTML += `<li>${node.innerHTML}</li>`;
        });
        let moveRegion = responseDiv.querySelector('.rlink:nth-of-type(3)');
        if (!moveRegion)
            return;
        let moveRegionValue = canonicalize(moveRegion.innerHTML);
        if (doNotMove.indexOf(moveRegionValue) !== -1)
            return;
        let moveRegionParent = moveRegion.parentElement;
        if (moveRegionParent.innerHTML.indexOf('relocated from') === -1)
            return;
        else {
            e.target.value = `Move to ${moveRegionValue}`;
            e.target.setAttribute('data-moveregion', moveRegionValue);
        }
    }
    else if (e.target.getAttribute('data-moveregion')) {
        chrome.storage.local.get('localid', async (result) => {
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
    let strongs = responseDiv.querySelectorAll('strong');
    for (let i = 0; i != strongs; i++) {
        const strongParent = strongs[i].parentElement;
        if (strongs[i].innerHTML == 'WA Delegate:' || strongs[i].innerHTML == 'WA Delegate') {
            const waDelegate = strongParent.querySelector('a');
            if (waDelegate) {
                document.querySelector("#wa-delegate").innerHTML = waDelegate.innerHTML;
                document.querySelector("#delegate-nation").value = nationRegex.exec(strongParent.querySelector('a').href)[1];
            }
            else {
                document.querySelector("#wa-delegate").innerHTML = 'None';
                document.querySelector("#delegate-nation").value = 'N/A';
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
        const nationName = document.querySelector("#delegate-nation").value;
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
        if (key == "switchers") {
            const newSwitchers: object = storageChange.newValue;
            document.querySelector("#num-switchers").innerHTML = Object.keys(newSwitchers).length;
            resetSwitchers(newSwitchers);
            break;
        }
    }
}

/*
 * Event Listeners
 */

document.querySelector("#resign").addEventListener("click", resignWA);
document.querySelector("#admit").addEventListener("click", admitWA);
document.querySelector("#refresh-endorse").addEventListener("click", refreshEndorse);
document.querySelector("#refresh-dossier").addEventListener("click", refreshDossier);
document.querySelector("#set-raider-jp").addEventListener("click", setRaiderJP);
document.querySelector("#move-to-jp").addEventListener("click", moveToJP);
document.querySelector("#chasing-button").addEventListener("click", chasingButton);
document.querySelector("#update-localid").addEventListener('click', manualLocalIdUpdate);
document.querySelector("#update-wa-status").addEventListener('click', manualChkUpdate);
document.querySelector("#update-region-status").addEventListener('click', updateRegionStatus);
document.querySelector("#check-current-region").addEventListener('click', checkCurrentRegion);
document.querySelector("#check-if-updated").addEventListener('click', checkIfUpdated);
document.querySelector("#copy-win").addEventListener('click', copyWin);
document.querySelector('#endorse-delegate').addEventListener('click', endorseDelegate);
document.addEventListener('keyup', keyPress);
chrome.storage.onChanged.addListener(onStorageChange);

/*
 * Initialization
 */

chrome.storage.local.get("switchers", (result) =>
{
    document.querySelector("#num-switchers").innerHTML = Object.keys(result.switchers).length;
    resetSwitchers(result.switchers);
});