import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;
import Rule = chrome.declarativeNetRequest.Rule;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.userAgent === undefined) return;
    const RELIANT_VERSION: string = chrome.runtime.getManifest().version;
    const userAgent = `Reliant ${RELIANT_VERSION} / In Use By ${message.userAgent} / Developed By Haku`;

    const rule = {
        id: 1,
        priority: 1,
        action: {
            type: 'modifyHeaders',
            requestHeaders: [
                {
                    header: 'User-Agent',
                    operation: HeaderOperation.SET,
                    value: userAgent
                }
            ]
        },
        condition: {
            urlFilter: 'https://*.nationstates.net/*',
            resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
        }
    } as Rule;

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [rule]
    });
});