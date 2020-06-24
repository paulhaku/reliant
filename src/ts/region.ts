const changeRegionForm: Element = document.querySelector('form[action="page=change_region"]');
const moveButton: Element = document.querySelector('button[name=move_region]');
moveButton.classList.add('ajaxbutton');
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

async function moveToRegion(e: MouseEvent): void
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

moveButton.addEventListener('click', moveToRegion);