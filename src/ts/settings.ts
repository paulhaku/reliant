const pageContent: HTMLElement = document.querySelector('#content');
pageContent.innerHTML = `
<h1>Reliant Settings</h1>
<form>
<fieldset>
<legend>Clear Stored World Assembly Applications</legend>
<input class="button" type="button" id="clear-wa-apps" value="Clear WA Apps">
</fieldset>
<fieldset>
<legend>Jump Point</legend>
<input type="text" id="new-jump-point">
<input class="button" type="button" id="set-jump-point" value="Set">
</fieldset>
<fieldset>
<legend>Regional Officer Name</legend>
<input type="text" id="new-ro-name">
<input class="button" type="button" id="set-ro-name" value="Set">
</fieldset>
<fieldset>
<legend>Prepping</legend>
<p><strong>Password</strong></p>
<input type="text" id="my-password">
<input class="button" type="button" id="set-password" value="Set">
<p><strong>Switchers</strong></p>
<textarea id="switchers"></textarea>
<input class="button" type="button" id="set-switchers" value="Set">
</fieldset>
<fieldset id="max-happenings">
<legend>Max Happenings Count</legend>
<p>The number of happenings in these sections will not exceed this number. Used for saving screen space.</p>
<p>
<label>Endorse</label>
<input type="radio" name="max-happenings-section" value="endorsehappeningscount">
</p>
<p>
<label>Dossier</label>
<input type="radio" name="max-happenings-section" value="dossierhappeningscount">
</p>
<p>
<label>Region</label>
<input type="radio" name="max-happenings-section" value="regionhappeningscount">
</p>
<p>
<label>World</label>
<input type="radio" name="max-happenings-section" value="worldhappeningscount">
</p>
<input type="number" id="max-happenings-count" min="1" max="20">
<input class="button" type="button" id="set-max-happenings" value="Set">
</fieldset>
<fieldset id="keys">
<legend>Change Keys</legend>
<p id="current-key"></p>
<p>
<label for="movekey">Move Key</label>
<input type="radio" name="key-to-change" value="movekey">
</p>
<p>
<label for="jpkey">Jump Point Key</label>
<input type="radio" name="key-to-change" value="jpkey">
</p>
<p>
<label for="refreshkey">Refresh Key</label>
<input type="radio" name="key-to-change" value="refreshkey">
</p>
<p>
<label for="reportskey">Main Page Key</label>
<input type="radio" name="key-to-change" value="mainpagekey">
</p>
<p>
<label for="resignkey">Resign Key</label>
<input type="radio" name="key-to-change" value="resignkey">
</p>
<p>
<label for="dossierkey">View/Clear Dossier Key</label>
<input type="radio" name="key-to-change" value="dossierkey">
</p>
<p>
<label for="dossiernationkey">Dossier Nation Key</label>
<input type="radio" name="key-to-change" value="dossiernationkey">
</p>
<p>
<label for="endorsekey">Endorse Key</label>
<input type="radio" name="key-to-change" value="endorsekey">
</p>
<p>
<label for="gcrkey">GCR Updating Key</label>
<input type="radio" name="key-to-change" value="gcrkey">
</p>
<p>
<label for="regionajax2key">View Region Ajax2</label>
<input type="radio" name="key-to-change" value="regionajax2key">
</p>
<p>
<label for="viewregionkey">View Region</label>
<input type="radio" name="key-to-change" value="viewregionkey">
</p>
<p>
<label for="rokey">RO Key</label>
<input type="radio" name="key-to-change" value="rokey">
</p>
<p>
<label for="banjectkey">Banject Key</label>
<input type="radio" name="key-to-change" value="banjectkey">
</p>
<p>
<label for="worldactivitykey">World Activity Key</label>
<input type="radio" name="key-to-change" value="worldactivitykey">
</p>
<p>
<label for="didiupdatekey">Did I Update? Key</label>
<input type="radio" name="key-to-change" value="didiupdatekey">
</p>
<p>
<label for="delegatekey">Endorse Delegate/Endorse Vinny Key</label>
<input type="radio" name="key-to-change" value="delegatekey">
</p>
<p>
<label for="toggletemplatekey">Toggle Template Key</label>
<input type="radio" name="key-to-change" value="toggletemplatekey">
</p>
<p>
<label for="prepkey">Prep Key</label>
<input type="radio" name="key-to-change" value="prepkey">
</p>
<p>
<label for="detagkey">Detag Key</label>
<input type="radio" name="key-to-change" value="detagkey">
</p>
<p>
<label>Settings Key</label>
<input type="radio" name="key-to-change" value="settingskey">
</p>
<input type="text" id="new-key" maxlength="1">
<input class="button" type="button" id="set-key" value="Set">
</fieldset>
</form>
<h2>Current Switcher Set</h2>
<p id="current-switcher-set"></p>
`;

/*
 * Event Listeners
 */

document.querySelector('#set-key').addEventListener('click', setKey);
document.querySelector('#set-jump-point').addEventListener('click', setJumpPoint);
document.querySelector('#set-ro-name').addEventListener('click', setRoName);
document.querySelector('#set-max-happenings').addEventListener('click', setMaxHappeningsCount);
document.querySelector('#set-switchers').addEventListener('click', setSwitchers);
document.querySelector('#set-password').addEventListener('click', setPassword);
document.querySelector('#clear-wa-apps').addEventListener('click', clearStoredWaApplications);

/*
 * Handlers
 */

function setKey(e: MouseEvent): void
{
    let keyToSet: string;
    const key: string = document.querySelector('#new-key').value.toUpperCase();
    const radioButtons: NodeList = document.querySelector('#keys').querySelectorAll('input[type=radio]');
    for (let i = 0; i != radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            keyToSet = radioButtons[i].value;
            break;
        }
    }
    document.querySelector('#new-key').value = '';
    chrome.storage.local.set({[keyToSet]: key});
}

function setJumpPoint(e: MouseEvent): void
{
    const newJumpPoint: string = canonicalize(document.querySelector('#new-jump-point').value);
    chrome.storage.local.set({'jumppoint': newJumpPoint});
}

function setRoName(e: MouseEvent): void
{
    const newRoName: string = document.querySelector('#new-ro-name').value;
    chrome.storage.local.set({'roname': newRoName});
}

function setMaxHappeningsCount(e: MouseEvent): void
{
    const maxHappeningsCount = document.querySelector('#max-happenings-count').value;
    const radioButtons = document.querySelector('#max-happenings').querySelectorAll('input[type=radio]');
    let happeningSetting: string;
    for (let i = 0; i != radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            happeningSetting = radioButtons[i].value;
            break;
        }
    }
    chrome.storage.local.set({[happeningSetting]: maxHappeningsCount});
}

function setSwitchers(e: MouseEvent): void
{
    let switchers: string[] = document.querySelector('#switchers').value.split('\n');
    for (let i = 0; i != switchers.length; i++)
        switchers[i] = canonicalize(switchers[i]);
    chrome.storage.local.set({'prepswitchers': switchers});
}

function setPassword(e: MouseEvent): void
{
    const password = document.querySelector('#my-password').value;
    chrome.storage.local.set({'password': password});
}

function clearStoredWaApplications(e: MouseEvent): void
{
    chrome.storage.local.set({'switchers': []});
}

chrome.storage.local.get('prepswitchers', (result) =>
{
    const currentSwitcherSet = document.querySelector('#current-switcher-set');
    const prepSwitchers: string[] = result.prepswitchers;
    for (let i = 0; i != prepSwitchers.length; i++)
        currentSwitcherSet.innerHTML += `${prepSwitchers[i]}<br>`;
});