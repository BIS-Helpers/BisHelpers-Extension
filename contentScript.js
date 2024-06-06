function checkCourseGradesPage() {
  const navElement = document.getElementById('js_navToApp');
  if (navElement) {
    const activeElement = navElement.querySelector('li a.active');
    if (activeElement) {
      const gotoAttribute = activeElement.getAttribute('goto');
      if (gotoAttribute && gotoAttribute.startsWith('education/grades')) {
        return true;
      }
    }
  }
  return false;
}

function displayErrorMessage() {
  alert('Please go to the Course Grades page (النتائج الدراسية).');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    console.log('Start message received');

    if (!checkCourseGradesPage()) {
      displayErrorMessage();
      sendResponse({ error: 'Not on the Course Grades page' });
      return;
    }

    const tfootElements = document.querySelectorAll('tfoot');
    console.log('tfoot elements:', tfootElements);
    let totalHours = 0;

    tfootElements.forEach((tfoot) => {
      const divs = tfoot.querySelectorAll('div');
      if (divs.length > 0) {
        const lastDiv = divs[divs.length - 1];
        console.log('last div:', lastDiv);
        const textContent = lastDiv.textContent.trim();

        if (textContent) {
          // Extract numbers from the text content
          const numbers = textContent.match(/-?\d+(\.\d+)?/g);

          if (numbers) {
            numbers.forEach((number) => {
              const numericValue = parseFloat(number.replace(/,/g, ''));
              if (!isNaN(numericValue)) {
                totalHours += numericValue;
              }
            });
          }
        }
      }
    });

    // Store the total hours in chrome storage
    chrome.storage.local.set({ totalHours }, function () {
      console.log('Total hours stored:', totalHours);
      // Send the total hours back to the popup
      sendResponse({ totalHours });
    });

    // Return true to indicate you want to send a response asynchronously
    return true;
  }
});
