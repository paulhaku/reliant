(async () =>
{
    document.querySelector('#content').innerHTML = `<h1>Tracked Nations</h1>
<button id="clear-tracked-nations">Clear Tracked Nations</button><table id="tracked-nations"></table>`;
    const trackedNations: string[] = (await getStorageValue('trackednations')) || [];
    for (let i = 0; i < trackedNations.length; i++) {
        const row: HTMLTableRowElement = document.createElement('tr');
        const cell: HTMLTableCellElement = document.createElement('td');
        cell.textContent = trackedNations[i];
        row.appendChild(cell);
        const removeButton: HTMLInputElement = document.createElement('input');
        removeButton.setAttribute('type', 'button');
        removeButton.setAttribute('value', 'Remove');
        removeButton.setAttribute('class', 'button');
        removeButton.addEventListener('click', async (e: MouseEvent) =>
        {
            trackedNations.splice(i, 1);
            await setStorageValue('trackednations', trackedNations);
            (e.target as HTMLInputElement).parentElement.parentElement.removeChild((e.target as HTMLInputElement).parentElement);
        });
        row.appendChild(removeButton);
        document.querySelector('#tracked-nations').appendChild(row);
    }
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