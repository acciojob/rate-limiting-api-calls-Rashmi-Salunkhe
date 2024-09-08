const fetchButton = document.getElementById("fetch-button");
const clickCountDisplay = document.getElementById("click-count");
const resultsDiv = document.getElementById("results");

let clickCount = 0;
let apiQueue = [];
let requestTimes = []; // Track timestamps of API requests

// Function to fetch data from the API and display it
function fetchAPIData() {
  return fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then(response => response.json())
    .then(data => {
      // Display fetched data in the results div
      resultsDiv.innerHTML += `
        <div>
          <p>ID: ${data.id}</p>
          <p>Title: ${data.title}</p>
          <p>Completed: ${data.completed}</p>
        </div>
        <hr />
      `;
    })
    .catch(err => console.error("API call failed", err));
}

// Function to manage rate limiting over 10-second windows
function processApiQueue() {
  const now = Date.now();
  
  // Remove timestamps older than 10 seconds
  requestTimes = requestTimes.filter(time => now - time < 10000);
  
  // If we can process more requests (limit of 5 in 10 seconds)
  if (requestTimes.length < 5 && apiQueue.length > 0) {
    requestTimes.push(now); // Record the time of this request
    const task = apiQueue.shift(); // Remove the task from the queue
    task(); // Execute the API call
  }

  // Continue processing the queue
  if (apiQueue.length > 0) {
    setTimeout(processApiQueue, 100); // Check every 100ms
  }
}

// Function to handle the button click
function handleButtonClick() {
  clickCount++;
  clickCountDisplay.textContent = clickCount;

  // Add the API call to the queue
  apiQueue.push(fetchAPIData);

  // Start processing the queue if it's not already running
  if (apiQueue.length === 1) {
    processApiQueue();
  }

  // Reset the click count after 10 seconds
  if (clickCount === 1) {
    setTimeout(() => {
      clickCount = 0;
      clickCountDisplay.textContent = clickCount;
    }, 10000);
  }
}

// Add click event listener to the button
fetchButton.addEventListener("click", handleButtonClick);
