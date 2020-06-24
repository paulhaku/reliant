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
detaggingDiv.setAttribute('style', 'position: fixed; right: 0px; bottom: 0px;');
if (!(urlParameters['template-overall'])) {
    document.querySelector('#content').appendChild(detaggingDiv);
    const sidePanel: Element = document.querySelector('#panel');
    sidePanel.innerHTML += '<ul id="endorse-list"></ul>';
}

const endorseList: Element = document.querySelector('#endorse-list');

/*
 * Event Handlers
 */

async function moveToRegion(e: MouseEvent): Promise<void>
{
    e.preventDefault();
    const localId: string = document.querySelector('input[name=localid]').getAttribute('value');
    let formData: FormData = new FormData();
    formData.set('localid', localId);
    formData.set('region_name', currentRegionName);
    formData.set('move_region', '1');
    let response: string = await makeAjaxQuery('/page=change_region', 'POST', formData);
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

    }
}

/*
 * Event Listeners
 */

actionButton.addEventListener('click', actionButtonClick);