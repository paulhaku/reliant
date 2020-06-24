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
document.querySelector('#content').appendChild(detaggingDiv);
const sidePanel: Element = document.querySelector('#panel');
sidePanel.innerHTML += '<ul id="endorse-list"></ul>';

const endorseList: Element = document.querySelector('#endorse-list');
