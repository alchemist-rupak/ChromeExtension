class LinkedInEasyApplyAutomator {
    constructor() {
      this.isRunning = false;
      this.applicationCount = 0;
      this.preferences = null;
    }
  
    async initialize() {
      // Load preferences and settings
      const { jobPreferences } = await chrome.storage.local.get('jobPreferences');
      this.preferences = jobPreferences;
    }
  
    async startAutomation() {
      this.isRunning = true;
      await this.initialize();
      
      console.log('Starting LinkedIn Job Application Automation');
      
      // Periodic job application attempt
      this.automationInterval = setInterval(() => {
        this.processJobApplications();
      }, 5000); // Check every 5 seconds
      
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'startAutomation') {
          startAutomation();
        }
      });
    }
  
    stopAutomation() {
      this.isRunning = false;
      clearInterval(this.automationInterval);
      console.log('Stopped LinkedIn Job Application Automation');
    }
  
    async processJobApplications() {
      if (!this.isRunning) return;
  
      // Find all job cards
      const jobCards = document.querySelectorAll('.job-card-container');
      
      for (const jobCard of jobCards) {
        if (this.shouldApplyToJob(jobCard)) {
          await this.applyToJob(jobCard);
        }
      }
    }
  
    shouldApplyToJob(jobCard) {
      // Implement job filtering logic based on preferences
      const jobTitle = jobCard.querySelector('.job-card-title')?.textContent || '';
      const jobLocation = jobCard.querySelector('.job-card-location')?.textContent || '';
  
      return this.preferences.roles.some(role => 
        jobTitle.toLowerCase().includes(role.toLowerCase())
      ) && this.preferences.locations.some(loc => 
        jobLocation.toLowerCase().includes(loc.toLowerCase())
      );
    }
  
    async applyToJob(jobCard) {
      const easyApplyButton = jobCard.querySelector('.jobs-apply-button');
      
      if (easyApplyButton) {
        easyApplyButton.click();
        
        // Wait for modal to open
        await this.delay(2000);
        
        try {
          await this.fillApplicationForm();
          this.applicationCount++;
          
          // Update daily application count
          await this.updateApplicationCount();
        } catch (error) {
          console.error('Application submission failed', error);
        }
      }
    }
  
    async fillApplicationForm() {
      // Implement dynamic form filling
      const formFields = document.querySelectorAll('input, select, textarea');
      
      formFields.forEach(field => {
        if (field.required) {
          // Basic auto-fill logic
          if (field.type === 'text') field.value = 'Auto Fill';
          if (field.type === 'email') field.value = 'autoapply@example.com';
        }
      });
  
      // Submit application
      const submitButton = document.querySelector('button[aria-label="Submit application"]');
      if (submitButton) submitButton.click();
    }
  
    async updateApplicationCount() {
      const today = new Date().toDateString();
      const data = await chrome.storage.local.get(['dailyApplicationCount', 'lastResetDate']);
  
      // Reset count if it's a new day
      if (data.lastResetDate !== today) {
        await chrome.storage.local.set({
          dailyApplicationCount: 1,
          lastResetDate: today
        });
      } else {
        await chrome.storage.local.set({
          dailyApplicationCount: (data.dailyApplicationCount || 0) + 1
        });
      }
    }
  
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  
  // Automation instance
  const automator = new LinkedInEasyApplyAutomator();
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
      automator.startAutomation();
    } else if (request.action === 'stop') {
      automator.stopAutomation();
    }
  });