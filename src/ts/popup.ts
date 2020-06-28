(() =>
{
    async function getNumSwitchers(): Promise<number>
    {
        return new Promise((resolve, reject) =>
        {
            chrome.storage.local.get('switchers', (result) =>
            {
                if (result.switchers)
                    resolve(result.switchers.length);
                else
                    resolve(0);
            });
        });
    }

    async function getCurrentWa(): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            chrome.storage.local.get('currentwa', (result) =>
            {
                if (result.currentwa)
                    resolve(result.currentwa);
                else
                    resolve('N/A');
            });
        });
    }

    async function getPassword(): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            chrome.storage.local.get('password', (result) =>
            {
                resolve(result.password);
            });
        });
    }

    async function init(): Promise<void>
    {
        const values = await Promise.all([getNumSwitchers(), getCurrentWa()]);
        document.querySelector('#switchers-left').innerHTML = String(values[0]);
        document.querySelector('#current-wa-nation').innerHTML = values[1];
    }

    init();
})();