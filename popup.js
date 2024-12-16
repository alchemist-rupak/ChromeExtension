// document.addEventListener('DOMContentLoaded', () => {
//     const toggleButton = document.getElementById('toggleAutomation');
//     const statusDiv = document.getElementById('status');
//     let isAutomating = false;
  
//     // Load saved state
//     chrome.storage.local.get('automationState', (data) => {
//       isAutomating = data.automationState || false;
//       updateButtonState();
//     });
  
//     toggleButton.addEventListener('click', () => {
//       isAutomating = !isAutomating;
      
//       // Save state
//       chrome.storage.local.set({ automationState: isAutomating });
  
//       // Send message to content script
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { 
//           action: isAutomating ? 'start' : 'stop' 
//         });
//       });
//   // 
//       updateButtonState();
//     });
  
//     function updateButtonState() {
//       toggleButton.textContent = isAutomating ? 'Stop Automation' : 'Start Automation';
//       statusDiv.textContent = isAutomating 
//         ? 'Automation is running...' 
//         : 'Automation is stopped';
//     }
//   });

//////////////////////////////////////////////////////////////////////////////////////////
// document.getElementById("automation-form").addEventListener("submit", (e) => {
//   e.preventDefault();

//   const email = document.getElementById("email").value;
//   const url = document.getElementById("url").value;

//   // Save data to config.json or storage
//   chrome.storage.local.set({ email, url });

//   // Notify background script to start Puppeteer automation
//   chrome.runtime.sendMessage({ action: "startAutomation", email, url }, (response) => {
//     if (response.success) {
//       alert("Automation started successfully!");
//     } else {
//       alert("Failed to start automation.");
//     }
//   });
// });


document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const statusDiv = document.getElementById('status');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const jobUrl = document.getElementById('jobUrl').value;

    try {
      // Save credentials securely
      await chrome.storage.local.set({
        linkedinCredentials: {
          email,
          password,
          jobUrl
        }
      });

      // Send message to background script to start automation
      chrome.runtime.sendMessage({
        action: 'startAutomation',
        email,
        password,
        jobUrl
      }, (response) => {
        if (response && response.success) {
          statusDiv.textContent = 'Automation Started! Logging into LinkedIn...';
          statusDiv.className = 'success';
        } else {
          statusDiv.textContent = 'Automation Failed';
          statusDiv.className = 'error';
        }
      });
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
      statusDiv.className = 'error';
    }
  });
});
