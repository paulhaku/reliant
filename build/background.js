chrome.webRequest.onBeforeRedirect.addListener(details => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { redirecturl: details.redirectUrl, message: "redirecturl" }, function (response) {
        });
    });
}, {
    urls: ["<all_urls>"]
});
