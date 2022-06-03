chrome.webRequest.onBeforeRedirect.addListener(details =>
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {redirecturl: details.redirectUrl}, function(response) {

        });
    });
}, {
    urls: ["https://www.nationstates.net/page=error/err=endorse_already_endorsed",
    "https://www.nationstates.net/page=error/err=endorse_region_mismatch"]
});