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
Current:
<b id="currentmovekey"></b>
</p>
<p>
<label for="jpkey">Jump Point Key</label>
<input type="radio" name="key-to-change" value="jpkey">
Current:
<b id="currentjpkey"></b>
</p>
<p>
<label for="refreshkey">Refresh Key</label>
<input type="radio" name="key-to-change" value="refreshkey">
Current:
<b id="currentrefreshkey"></b>
</p>
<p>
<label for="mainpagekey">Main Page Key</label>
<input type="radio" name="key-to-change" value="mainpagekey">
Current:
<b id="currentmainpagekey"></b>
</p>
<p>
<label for="resignkey">Resign Key</label>
<input type="radio" name="key-to-change" value="resignkey">
Current:
<b id="currentresignkey"></b>
</p>
<p>
<label for="dossierkey">View/Clear Dossier Key</label>
<input type="radio" name="key-to-change" value="dossierkey">
Current:
<b id="currentdossierkey"></b>
</p>
<p>
<label for="dossiernationkey">Dossier Nation Key</label>
<input type="radio" name="key-to-change" value="dossiernationkey">
Current:
<b id="currentdossiernationkey"></b>
</p>
<p>
<label for="endorsekey">Endorse Key</label>
<input type="radio" name="key-to-change" value="endorsekey">
Current:
<b id="currentendorsekey"></b>
</p>
<p>
<label for="gcrkey">GCR Updating Key</label>
<input type="radio" name="key-to-change" value="gcrkey">
Current:
<b id="currentgcrkey"></b>
</p>
<p>
<label for="viewregionkey">View Region</label>
<input type="radio" name="key-to-change" value="viewregionkey">
Current:
<b id="currentviewregionkey"></b>
</p>
<p>
<label for="rokey">RO Key</label>
<input type="radio" name="key-to-change" value="rokey">
Not Implemented
</p>
<p>
<label for="worldactivitykey">World Activity Key</label>
<input type="radio" name="key-to-change" value="worldactivitykey">
Current:
<b id="currentworldactivitykey"></b>
</p>
<p>
<label for="didiupdatekey">Did I Update? Key</label>
<input type="radio" name="key-to-change" value="didiupdatekey">
Current:
<b id="currentdidiupdatekey"></b>
</p>
<p>
<label for="delegatekey">Endorse Delegate Key</label>
<input type="radio" name="key-to-change" value="delegatekey">
Current:
<b id="currentdelegatekey"></b>
</p>
<p>
<label for="prepkey">Prep Key</label>
<input type="radio" name="key-to-change" value="prepkey">
Current:
<b id="currentprepkey"></b>
</p>
<p>
<label>Settings Key</label>
<input type="radio" name="key-to-change" value="settingskey">
Current:
<b id="currentsettingskey"></b>
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

/*
 * Initialization
 */

(() =>
{
    async function getCurrentKey(key: string): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            chrome.storage.local.get(key, (result) =>
            {
                resolve(result[key]);
            });
        });
    }

    async function displayCurrentKeys()
    {
        const currentKeys = await Promise.all([
            getCurrentKey('movekey'),
            getCurrentKey('jpkey'),
            getCurrentKey('refreshkey'),
            getCurrentKey('mainpagekey'),
            getCurrentKey('resignkey'),
            getCurrentKey('dossierkey'),
            getCurrentKey('dossiernationkey'),
            getCurrentKey('endorsekey'),
            getCurrentKey('gcrkey'),
            getCurrentKey('viewregionkey'),
            getCurrentKey('worldactivitykey'),
            getCurrentKey('didiupdatekey'),
            getCurrentKey('delegatekey'),
            getCurrentKey('prepkey'),
            getCurrentKey('settingskey')
        ]);

        document.querySelector('#currentmovekey').innerHTML = currentKeys[0] || 'X';
        document.querySelector('#currentjpkey').innerHTML = currentKeys[1] || 'V';
        document.querySelector('#currentrefreshkey').innerHTML = currentKeys[2] || 'C';
        document.querySelector('#currentmainpagekey').innerHTML = currentKeys[3] || 'Space';
        document.querySelector('#currentresignkey').innerHTML = currentKeys[4] || "'";
        document.querySelector('#currentdossierkey').innerHTML = currentKeys[5] || 'M';
        document.querySelector('#currentdossiernationkey').innerHTML = currentKeys[6] || 'N';
        document.querySelector('#currentendorsekey').innerHTML = currentKeys[7] || 'Z';
        document.querySelector('#currentgcrkey').innerHTML = currentKeys[8] || 'G';
        document.querySelector('#currentviewregionkey').innerHTML = currentKeys[9] || 'D';
        document.querySelector('#currentworldactivitykey').innerHTML = currentKeys[10] || 'F';
        document.querySelector('#currentdidiupdatekey').innerHTML = currentKeys[11] || 'U';
        document.querySelector('#currentdelegatekey').innerHTML = currentKeys[12] || 'A';
        document.querySelector('#currentprepkey').innerHTML = currentKeys[13] || 'P';
        document.querySelector('#currentsettingskey').innerHTML = currentKeys[14] || '0';
    }

    displayCurrentKeys();
})();