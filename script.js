//your JS code here. If required.
const fetchDataBtn = document.getElementById("fetchDataBtn");
const clickCountDisplay = document.getElementById("clickCount");
const resultsDiv = document.getElementById("results");

let clickCount = 0;
let apiQueue = [];
let lastExecutionTime = Date.now();
let processedClicks = 0;

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

// Function to limit the API calls to 5 per second
function rateLimiter() {
  const now = Date.now();
  
  // Check if we should process a new batch of requests
  if (now - lastExecutionTime >= 1000 && apiQueue.length > 0) {
    lastExecutionTime = now;
    let toProcess = Math.min(apiQueue.length, 5); // Process a maximum of 5 requests

    for (let i = 0; i < toProcess; i++) {
      const task = apiQueue.shift(); // Remove the task from the queue
      task(); // Execute the API call
    }
  }

  // Keep running the rate limiter
  if (apiQueue.length > 0) {
    setTimeout(rateLimiter, 100); // Check every 100ms
  }
}

// Function to handle the button click
function handleButtonClick() {
  clickCount++;
  clickCountDisplay.textContent = clickCount;
  
  // Add the API call to the queue
  apiQueue.push(fetchAPIData);
  
  // Start the rate limiter if it's not already running
  if (apiQueue.length === 1) {
    rateLimiter();
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
fetchDataBtn.addEventListener("click", handleButtonClick);
