chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    if (url.hostname === 'myhu.helwan.edu.eg') {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          }
        }
      );
    } else {
      console.log('This extension only works on myhu.helwan.edu.eg');
    }
  }
});
