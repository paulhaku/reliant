document.head.innerHTML = '<title>Reliant</title><meta charset="utf-8">';

const pageContent = document.createElement('div');
pageContent.id = "content";
pageContent.innerHTML = `
<div id="top">
    <!-- Status -->
    <div id="status-container">
    <span id="status-header" class="header">Status</span>
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

<div id="middle">
    <!-- Endorsing -->
    <div id="endorse-container">
        <span id="endorse-header" class="header">Endorse</span>
        <div class="information">
            <ul>
                <li><a href="/nation=nation1">Nation 1</a></li>
                <li><a href="/nation=nation2">Nation 2</a></li>
                <li><a href="/nation=nation3">Nation 3</a></li>
            </ul>
        </div>
    </div>
    
    <!-- Dossier -->
    <div id="dossier-container">
        <span id="dossier-header" class="header">Dossier</span>
        <div>
            <label for="raider-jp">Raider Jump Point</label>
            <input type="text" id="raider-jp">
            <input type="button" id="set-raider-jp" value="Set">
        </div>
        <div class="information">
            <ul>
                <li><a href="/nation=nation1">Nation 1</a></li>
                <li><a href="/nation=nation2">Nation 2</a></li>
                <li><a href="/nation=nation3">Nation 3</a></li>
            </ul>
        </div>
    </div>
</div>

<div id="bottom">
    <!-- Chasing -->
    <div id="chasing-container">
        <span id="chasing-header" class="header">Chasing</span>
        <br>
        <input type="button" id="chasing-button" value="Refresh">
    </div>
</div>
`;
document.body.appendChild(pageContent);