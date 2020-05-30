document.head.innerHTML = '<title>Reliant</title><meta charset="utf-8">';

const pageContent = document.createElement('div');
pageContent.id = "content";
pageContent.innerHTML = `
<div id="group1">
    <input type="button" class="ajaxbutton" id="update-localid" value="Update Localid">
    <input type="button" class="ajaxbutton" id="update-wa-status" value="Update">
    
    <!-- Status -->
    <div id="status-container">
    <span id="status-header" class="header">Status</span>
    <br>
    <br>
    <span id="status" class="information">N/A</span>
    </div>


    <!-- Current WA Nation -->
    <div id="current-wa-nation-container">
    <span id="current-wa-nation-header" class="header">Current WA Nation</span>
    <br>
    <input type="button" id="resign" value="Resign" class="ajaxbutton">
    <input type="button" id="admit" value="Admit on Next Switcher" class="ajaxbutton">
    <br>
    <span id="current-wa-nation" class="information">N/A</span>
    </div>
</div>

<div id="group2">
    <!-- Endorsing -->
    <div id="endorse-container">
        <span id="endorse-header" class="header">Endorse</span>
        <br>
        <input type="button" id="refresh-endorse" value="Refresh" class="ajaxbutton">
        <br>
        <br>
        <div class="information">
            <ul id="nations-to-endorse">
            </ul>
        </div>
    </div>
    
    <!-- Dossier -->
    <div id="dossier-container">
        <span id="dossier-header" class="header">Dossier</span>
        <br>
        <input type="button" id="refresh-dossier" value="Refresh" class="ajaxbutton">
        <div>
            <label for="raider-jp">Raider Jump Point</label>
            <input type="text" id="raider-jp">
            <input type="button" id="set-raider-jp" value="Set">
        </div>
        <div class="information">
            <ul id="nations-to-dossier">
            </ul>
        </div>
    </div>
</div>

<div id="group3">
    <!-- Chasing -->
    <div id="chasing-container">
        <span id="chasing-header" class="header">Chasing</span>
        <br>
        <input type="button" id="move-to-jp" value="Move to JP" class="ajaxbutton">
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
    </div>
</div>

<div id="group4">
    <!-- Switchers -->
    <div id="switchers-container">
        <span class="header">Switchers Left</span>
        <br>
        <div class="information">
            <ul id="switchers">
            </ul>
        </div>
    </div>
</div>

<div id="group5">
    <!-- Did I Update? -->
    <div id="did-i-update-container">
        <span class="header">Did I Update?</span>
        <input type="button" class="ajaxbutton" id="check-if-updated" value="Did I Update?">
        <span class="information">
            <ul id="did-i-update">
            
            </ul>
        </span>
    </div>
</div>
`;

document.body.appendChild(pageContent);

/*
 * Dynamic Information
 */

const status: HTMLElement = document.querySelector("#status");
const currentWANation: HTMLElement = document.querySelector("#current-wa-nation");
const nationsToEndorse: HTMLElement = document.querySelector("#nations-to-endorse");
const nationsToDossier: HTMLElement = document.querySelector("#nations-to-dossier");
const switchers: HTMLElement = document.querySelector("#switchers");
const currentRegion: HTMLElement = document.querySelector("#current-region");
const didIUpdate: HTmlElement = document.querySelector("#did-i-update");

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
        }
        else
            status.innerHTML = `Error admitting to the WA on ${selectedSwitcher}.`;
        delete storedSwitchers[selectedSwitcher];
        chrome.storage.local.set({"switchers": storedSwitchers});
    });
}

function refreshEndorse(e: MouseEvent): void
{
    nationsToEndorse.innerHTML = '';
    chrome.storage.local.get('jumppoint', async (result) => {
        const jumpPoint = result.jumppoint;
        let response = await makeAjaxQuery(`/page=ajax2/a=reports/view=region.${jumpPoint}/filter=move+member+endo`,
        'GET');
        // only so we can use queryselector on the response DOM rather than using regex matching
        let div = document.createElement('div');
        div.innerHTML = response;
        let lis = div.querySelectorAll('li');
        let resigned: string[] = [];
        for (let i = 0; i != lis.length; i++) {
            const nationNameRegex = new RegExp('nation=([A-Za-z0-9_-]+)');
            const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a:nth-of-type(1)').href);
            const nationName = nationNameMatch[1];
            // Don't include nations that probably aren't in the WA
            if (lis[i].innerHTML.indexOf('resigned from') !== -1)
                resigned.push(nationName);
            else if (lis[i].innerHTML.indexOf('was admitted') !== -1) {
                if (resigned.indexOf(nationName) === -1) {
                    function onEndorseClick(e: MouseEvent)
                    {
                        console.log('doing endorse click');
                        chrome.storage.local.get('localid', async (localidresult) => {
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
                    endorseButton.setAttribute('class', 'ajaxbutton');
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
    nationsToDossier.innerHTML = '';
    chrome.storage.local.get('raiderjp', async (result) => {
        const raiderJp = result.raiderjp;
        let response = await makeAjaxQuery(`/page=ajax2/a=reports/view=region.${raiderJp}/filter=move+member+endo`,
        'GET');
        // only so we can use queryselector on the response DOM rather than using regex matching
        let div = document.createElement('div');
        div.innerHTML = response;
        let lis = div.querySelectorAll('li');
        let resigned: string[] = [];
        for (let i = 0; i != lis.length; i++) {
            const nationNameRegex = new RegExp('nation=([A-Za-z0-9_-]+)');
            const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a:nth-of-type(1)').href);
            const nationName = nationNameMatch[1];
            // Don't include nations that probably aren't in the WA
            if (lis[i].innerHTML.indexOf('resigned from') !== -1)
                resigned.push(nationName);
            else if (lis[i].innerHTML.indexOf('was admitted') !== -1) {
                if (resigned.indexOf(nationName) === -1) {
                    async function onDossierClick(e: MouseEvent): void
                    {
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
                    dossierButton.setAttribute('class', 'ajaxbutton');
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
    const jumpPoints = ['devide_by_zero', 'artificial_solar_system', 'trieltics', '3_guys', 'frozen_circle', 'switz',
    'plum_island'];
    if (e.target.value == "Refresh") {
        let response = await makeAjaxQuery('/template-overall=none/page=reports', 'GET');
        // only so we can use queryselector on the response DOM rather than using regex matching
        let responseDiv = document.createElement('div');
        responseDiv.innerHTML = response;
        let moveRegion = responseDiv.querySelector('.rlink:nth-of-type(3)');
        if (!moveRegion)
            return;
        let moveRegionValue = canonicalize(moveRegion.innerHTML);
        if (jumpPoints.indexOf(moveRegionValue) !== -1)
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
    let response = await makeAjaxQuery(`/template-overall=none/region=${currentRegion.innerHTML}`, 'GET');
    let responseDiv = document.createElement('div');
    responseDiv.innerHTML = response;
    console.log(response);
    const waDelegate = responseDiv.querySelector('p:nth-child(2) > a');
    const lastWaUpdate = responseDiv.querySelector('p:nth-child(4) > time').innerHTML;
    if (waDelegate)
        document.querySelector("#wa-delegate").innerHTML = waDelegate.innerHTML;
    else
        document.querySelector("#wa-delegate").innerHTML = 'None.';
    document.querySelector("#last-wa-update").innerHTML = lastWaUpdate;
}

async function checkCurrentRegion(e: MouseEvent): void
{
    let response = await makeAjaxQuery('/region=artificial_solar_system', 'GET');
    let responseElement = document.createRange().createContextualFragment(response);
    let regionHref = responseElement.querySelector('#panelregionbar > a').href;
    currentRegion.innerHTML = new RegExp('region=([A-Za-z0-9_]+)').exec(regionHref)[1];
}

async function checkIfUpdated(e: MouseEvent): void
{
    didIUpdate.innerHTML = await makeAjaxQuery('/page=ajax2/a=reports/view=self/filter=change', 'GET');
}

function onStorageChange(changes: object, areaName: string): void
{
    for (let key in changes) {
        let storageChange = changes[key];
        if (key == "switchers") {
            const newSwitchers: string[] = storageChange.newValue;
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
chrome.storage.onChanged.addListener(onStorageChange);

/*
 * Initialization
 */

chrome.storage.local.get("switchers", (result) =>
{
    resetSwitchers(result.switchers);
});