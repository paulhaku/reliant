document.head.innerHTML = '<title>Reliant</title><meta charset="utf-8">';

const pageContent = document.createElement('div');
pageContent.id = "content";
pageContent.innerHTML = `
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
<span id="current-wa-nation" class="information">N/A</span>
</div>
`;
document.body.appendChild(pageContent);