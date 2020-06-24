const changeRegionForm: Element = document.querySelector('form[action="page=change_region"]');
const moveButton: Element = document.querySelector('button[name=move_region]');
if (moveButton) {
    moveButton.classList.add('ajaxbutton');
    moveButton.addEventListener('click', moveToRegion);
}
const currentRegionName: string = urlParameters['region'];

const detaggingDiv: Element = document.createElement('div');

const actionButton: Element = document.createElement('input');
const regionStatus: Element = document.createElement('p');
regionStatus.innerHTML = 'Awaiting region update.';

actionButton.setAttribute('type', 'button');
actionButton.setAttribute('id', 'action-button');
actionButton.setAttribute('class', 'ajaxbutton');
actionButton.setAttribute('style', 'padding: 20px;');
actionButton.setAttribute('value', 'Refresh');

detaggingDiv.appendChild(regionStatus);
detaggingDiv.appendChild(actionButton);
detaggingDiv.setAttribute
('style', 'background-color: #1F202D; color: #fff; position: fixed; right: 0px; bottom: 0px;');

let endorseList: Element;

if (!(urlParameters['template-overall'])) {
    document.querySelector('#content').appendChild(detaggingDiv);
    const sidePanel: Element = document.querySelector('#panel');
    sidePanel.innerHTML += '<p id="endorse-status">Awaiting localid update.</p>';
    sidePanel.innerHTML += '<input class="ajaxbutton" type="button" value="Refresh" id="refresh-endorse">';
    sidePanel.innerHTML += '<input class="ajaxbutton" type="button" value="Update Localid" id="update-localid">';
    sidePanel.innerHTML += '<ul id="endorse-list"></ul>';
    endorseList = document.querySelector('#endorse-list');
    document.querySelector('#refresh-endorse').addEventListener('click', refreshEndorseList);
    document.querySelector('#update-localid').addEventListener('click', manualLocalIdUpdate);
}

/*
 * Event Handlers
 */

async function moveToRegion(e: MouseEvent): Promise<void>
{
    e.preventDefault();
    const localId: string = document.querySelector('input[name=localid]').getAttribute('value');
    chrome.storage.local.set({'localid': localId});
    let formData: FormData = new FormData();
    formData.set('localid', localId);
    formData.set('region_name', currentRegionName);
    formData.set('move_region', '1');
    await makeAjaxQuery('/page=change_region', 'POST', formData);
    moveButton.parentElement.removeChild(moveButton);
    changeRegionForm.innerHTML += `
    <p class="smalltext"><a href="page=change_region">Tired of life in ${pretty(currentRegionName)}?</a>
    </p>
    `;
}

async function actionButtonClick(e: MouseEvent): Promise<void>
{
    const value: string = e.target.value;
    if (value === 'Refresh') {
        const delegateRegex: RegExp = new RegExp('nation=(.+)');
        const response = await makeAjaxQuery(`/region=${currentRegionName}`, 'GET');
        const responseElement = document.createRange().createContextualFragment(response);
        const updateTime = responseElement.querySelector('time').innerHTML;
        let strongs: NodeList = document.querySelectorAll('strong');
        let waDelegate: string;
        if (strongs[0].parentElement.querySelector('a')) {
            waDelegate = delegateRegex.exec(strongs[0]
                .parentElement.querySelector('a').getAttribute('href'))[1];
        }
        else
            waDelegate = '0';
        if (updateTime === 'Seconds ago') {
            chrome.storage.local.get('currentwa', (result) =>
            {
                if (result.currentwa === waDelegate) {
                    regionStatus.innerHTML = 'Updated! You <b>are</b> the delegate.';
                    actionButton.setAttribute('value', 'Appoint Self as RO');
                }
                else {
                    regionStatus.innerHTML = 'Updated! You are <b>not</b> the delegate.';
                    actionButton.setAttribute('value', 'Resign From the WA');
                }
            });
        }
    }
    else if (value === 'Appoint Self as RO') {
        chrome.storage.local.get(['chk', 'roname'], async (result) =>
        {
            const currentNation = document.querySelector('#loggedin').getAttribute('data-nname');
            const chk: string = result.chk;
            const roName: string = result.roname;
            let formData = new FormData();
            formData.set('page', 'region_control');
            formData.set('region', currentRegionName);
            formData.set('chk', chk);
            formData.set('nation', currentNation);
            formData.set('office_name', roName);
            formData.set('authority_A', '1');
            formData.set('authority_B', '0');
            formData.set('authority_C', '1');
            formData.set('authority_E', '1');
            formData.set('authority_P', '1');
            formData.set('editofficer', '1');
            const response =
                await makeAjaxQuery(`/page=region_control/region=${currentRegionName}`, 'POST', formData);
            const responseElement = document.createRange().createContextualFragment(response);
            const responseInfo = responseElement.querySelector('.info') || responseElement.querySelector('.error');
            if (responseInfo.innerHTML.indexOf('with authority') !== -1)
                regionStatus.innerHTML = 'Successfully appointed as RO.';
            else
                regionStatus.innerHTML = 'Failed to appoint self as RO.';
        });
    }
    else if (value === 'Resign From the WA') {
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
                regionStatus.innerHTML = `Resigned from the WA on ${match[1]}`;
                actionButton.setAttribute('value', 'Admit on Next Switcher');
            }
        });
    }
    else if (value === 'Admit on Next Switcher') {
        chrome.storage.local.get('switchers', async (result) =>
        {
            let switchers: Switcher[] = result.switchers;
            let formData = new FormData();
            formData.set('nation', switchers[0].name);
            formData.set('appid', switchers[0].appid);
            const response = await makeAjaxQuery('/cgi-bin/join_un.cgi', 'POST', formData);
            if (response.indexOf('Welcome to the World Assembly, new member') !== -1) {
                regionStatus.innerHTML = `Admitted to the WA on ${switchers[0].name}`;
                getChk(response);
            }
            else
                regionStatus.innerHTML = `Failed to admit to the WA on ${switchers[0].name}`;
            switchers.shift();
            chrome.storage.local.set({'switchers': switchers});
        });
    }
}

async function refreshEndorseList(e: MouseEvent): Promise<void>
{
    const currentNation: string = document.querySelector('#loggedin').getAttribute('data-nname');
    let response = await makeAjaxQuery(`/page=ajax2/a=reports/view=region.${currentRegionName}/filter=move+member+endo`,
        'GET');
    const nationNameRegex = new RegExp('nation=([A-Za-z0-9_-]+)');
    // only so we can use queryselector on the response DOM rather than using regex matching
    let responseElement = document.createRange().createContextualFragment(response);
    let lis = responseElement.querySelectorAll('li');
    let resigned: string[] = [];
    for (let i = 0; i != lis.length; i++) {
        const nationNameMatch = nationNameRegex.exec(lis[i].querySelector('a:nth-of-type(1)').href);
        const nationName = nationNameMatch[1];
        // don't allow us to endorse ourself
        if (canonicalize(nationName) === canonicalize(currentNation))
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
                            document.querySelector('#endorse-status')
                                .innerHTML = `Failed to endorse ${nationName}.`;
                        else {
                            document.querySelector('#endorse-status').innerHTML = `Endorsed ${nationName}.`;
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
                endorseList.appendChild(endorseLi);
            }
        }
    }
}

async function manualLocalIdUpdate(e: MouseEvent): Promise<void>
{
    console.log('manually updating localid');
    let response = await makeAjaxQuery('/region=rwby', 'GET');
    getLocalId(response);
    document.querySelector('#endorse-status').innerHTML = 'Updated localid.';
}

/*
 * Event Listeners
 */

actionButton.addEventListener('click', actionButtonClick);