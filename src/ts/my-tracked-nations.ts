(async () =>
{
    document.querySelector('#content').innerHTML = `<h1>Tracked Nations</h1>
<button id="clear-tracked-nations">Clear Tracked Nations</button><table id="tracked-nations"></table>`;
    const trackedNations: string[] = (await getStorageValue('trackednations')) || [];
    trackedNations.forEach((nation, i) => {
        const row: HTMLTableRowElement = document.createElement('tr');
        const cell: HTMLTableCellElement = document.createElement('td');
        cell.innerHTML = `<a target="_blank" href="/nation=${trackedNations[i]}">${trackedNations[i]}</a>`;
        row.appendChild(cell);
        const removeButton: HTMLInputElement = document.createElement('input');
        removeButton.setAttribute('type', 'button');
        removeButton.setAttribute('value', 'Remove');
        removeButton.setAttribute('class', 'button');
        removeButton.addEventListener('click', async (e: MouseEvent) =>
        {
            // Find the correct index at click-time, not at loop-time
            const currentIndex = trackedNations.indexOf(nation);
            if (currentIndex !== -1) {
                trackedNations.splice(currentIndex, 1);
                await chrome.storage.local.set({ trackednations: trackedNations });
                row.remove();
            }
        });
        row.appendChild(removeButton);
        document.querySelector('#tracked-nations').appendChild(row);
    });
    const clearButton: HTMLInputElement = document.querySelector('#clear-tracked-nations');
    clearButton.addEventListener('click', async () =>
    {
        await setStorageValue('trackednations', []);
        document.querySelector('#tracked-nations').innerHTML = '';
        let notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });
        notyf.success('Cleared tracked nations');
    });
})();