document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById('start-btn');
  const clipboardBtn = document.getElementById('clipboard-btn');
  const copiedMessage = document.getElementById('copied-message');
  const totalHoursElement = document.querySelector('.bis-p');

  // Retrieve and display the total hours from chrome storage when the popup is opened
  chrome.storage.local.get(['totalHours'], function (result) {
    const totalHours = result.totalHours || 0;
    totalHoursElement.textContent = `Total Hours: ${totalHours}`;
  });

  console.log('DOM fully loaded');
  console.log('Start button:', startBtn);
  console.log('Clipboard button:', clipboardBtn);
  console.log('Copied message:', copiedMessage);

  if (startBtn) {
    startBtn.addEventListener('click', function () {
      console.log('Start button clicked');
      // Send a message to the content script to start calculation
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'start' },
          function (response) {
            // Update the total hours display with the response from the content script
            if (response && response.totalHours !== undefined) {
              totalHoursElement.textContent = `Total Hours: ${response.totalHours}`;
              // Store the updated total hours in chrome storage
              chrome.storage.local.set(
                { totalHours: response.totalHours },
                function () {
                  console.log(
                    'Total hours updated in storage:',
                    response.totalHours
                  );
                }
              );
            }
          }
        );
      });
    });
  } else {
    console.error('Start button not found');
  }

  if (clipboardBtn && copiedMessage) {
    clipboardBtn.addEventListener('click', function () {
      // Log the action
      console.log('Clipboard button clicked');

      // Copy the total hours to clipboard
      const totalHours = totalHoursElement.textContent.replace(
        'Total Hours: ',
        ''
      );
      navigator.clipboard
        .writeText(totalHours)
        .then(() => {
          // Show the copied message
          copiedMessage.style.display = 'block';

          // Hide the message after 2 seconds
          setTimeout(() => {
            copiedMessage.style.display = 'none';
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    });
  } else {
    console.error('Clipboard button or copied message element not found');
  }
});
