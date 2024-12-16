// chrome.runtime.onInstalled.addListener(() => {
//     console.log('LinkedIn Easy Apply Automator Installed');
    
//     // Initialize default settings
//     chrome.storage.local.set({
//       jobPreferences: {
//         roles: [],
//         locations: [],
//         maxApplicationsPerDay: 10
//       },
//       // dailyApplicationCount: 0,
//       lastResetDate: new Date().toDateString()
//     });
//   });
  
//   // Handle any background operations or messaging
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     // Potential background communication logic
//   });









// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "startAutomation") {
//     const { email, url } = message;

//     // Spawn Puppeteer process
//     const { exec } = require("child_process");
//     const script = `node automation.js`;
//     exec(script, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error executing script: ${error.message}`);
//         sendResponse({ success: false });
//         return;
//       }
//       console.log(stdout);
//       sendResponse({ success: true });
//     });

//     return true; // Keep the message channel open for async response
//   }
// });





chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAutomation') {
    // Create a new tab and navigate to LinkedIn login
    chrome.tabs.create({ 
      url: 'https://www.linkedin.com/login',
      active: true 
    }, (tab) => {
      // Store credentials in tab's temporary storage
      chrome.storage.local.set({
        automationContext: {
          email: request.email,
          password: request.password,
          jobUrl: request.jobUrl,
          tabId: tab.id
        }
      });
    });

    sendResponse({ success: true });
    return true;
  }
});



