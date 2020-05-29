document.head.innerHTML = '<title>Reliant</title><meta charset="utf-8">';

const pageContent = document.createElement('div');
pageContent.id = "content";
pageContent.innerHTML = `
<div id="group1">
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
</div>

<div id="group4">
    <!-- Switchers -->
    <div id="switchers-container">
        <span id="switchers-container" class="header">Switchers Left</span>
        <br>
        <div class="information">
            <ul id="switchers">
            </ul>
        </div>
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
            const nationNameRegex = new RegExp('<body id="loggedin" data-nname="([A-Za-z0-9_]+?)">');
            const match = nationNameRegex.exec(response);
            status.innerHTML = `Resigned from the WA on ${match[1]}`;
        }
    });
}

function admitWA(e: MouseEvent): void
{
    chrome.storage.local.get('switchers', async (result) => {
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
            const chkRegex: RegExp = new RegExp(`<input type="hidden" name="chk" value="([A-Za-z0-9]+?)">`);
            const match = chkRegex.exec(response);
            const chk = match[1];
            chrome.storage.local.set({'chk': chk});
            console.log(`chk set to ${chk}`);
        }
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
        let div = document.createElement('div');
        div.innerHTML = response;
        let lis = div.querySelectorAll('li');
        for (let i = 0; i != lis.length; i++) {
            if (lis[i].innerHTML.indexOf('was admitted') !== -1) {
                const nationNameRegex = new RegExp('nation=([A-Za-z0-9_]+)');
                const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a').href);
                const nationName = nationNameMatch[1];
                nationsToEndorse.innerHTML += `<li>${pretty(nationName)}</li>`;
            }
        }
    });
}

function refreshDossier(e: MouseEvent): void
{

}

function setRaiderJP(e: MouseEvent): void
{

}

function moveToJP(e: MouseEvent): void
{

}

function chasingButton(e: MouseEvent): void
{

}

function onStorageChange(changes: object, areaName: string)
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
chrome.storage.onChanged.addListener(onStorageChange);

/*
 * Initialization
 */

chrome.storage.local.get("switchers", (result) =>
{
    resetSwitchers(result.switchers);
});