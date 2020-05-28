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
    <input type="button" id="resign" value="Resign">
    <input type="button" id="admit" value="Admit on Next Switcher">
    <br>
    <span id="current-wa-nation" class="information">N/A</span>
    </div>
</div>

<div id="group2">
    <!-- Endorsing -->
    <div id="endorse-container">
        <span id="endorse-header" class="header">Endorse</span>
        <br>
        <input type="button" id="refresh-endorse" value="Refresh">
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
        <input type="button" id="refresh-dossier" value="Refresh">
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
        <input type="button" id="move-to-jp" value="Move to JP">
        <input type="button" id="chasing-button" value="Refresh">
    </div>
</div>

<div id="group4">
    <!-- Switchers -->
    <div id="switchers-container">
        <span id="switchers-container" class="header">Switchers Left</span>
        <input type="button" id="refresh-switchers" value="Refresh">
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
const currentWaNation: HTMLElement = document.querySelector("#current-wa-nation");
const nationsToEndorse: HTMLElement = document.querySelector("#nations-to-endorse");
const nationsToDossier: HTMLElement = document.querySelector("#nations-to-dossier");
const switchers: HTMLElement = document.querySelector("switchers");