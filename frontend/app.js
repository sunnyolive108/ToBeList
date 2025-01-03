const API_BASE_URL = "http://127.0.0.1:8000"; // URL of the backend API

// Fetch the habit list from the API and display them
async function fetchHabits() {
  const habitList = document.getElementById("habit-list"); // Get the habit list container
  habitList.innerHTML = ""; // Clear any existing habits before rendering new ones

  try {
    const response = await fetch(`${API_BASE_URL}/habits`); // Fetch habits from API
    const habits = await response.json(); // Parse the JSON response into a JavaScript object

    habits.forEach(habit => {
      const habitItem = document.createElement("div"); // Create a new div for each habit
      habitItem.classList.add("habit-item"); // Add habit-item class for styling
      habitItem.setAttribute("data-id", habit.id); // Set the habit ID for future reference

      habitItem.innerHTML = ` /* Add HTML structure for each habit item */
        <h3>${habit.name}</h3>
        <p>${habit.description}</p>
        <p><strong>Frequency:</strong> ${habit.frequency}</p>
        <p><strong>Next Due:</strong> ${habit.next_due}</p>
        <button class="log-progress-btn">Log Progress</button> 
        <span class="progress" id="progress-${habit.id}"></span>
      `;

      const logButton = habitItem.querySelector(".log-progress-btn"); // Select the log progress button
      logButton.addEventListener("click", () => logProgress(habit.id)); // Add event listener to log progress

      habitList.appendChild(habitItem); // Append the new habit item to the habit list
    });
  } catch (error) {
    console.error("Error fetching habits:", error); // Handle any errors during fetch
  }
}

// Log the progress for a specific habit
async function logProgress(habitId) {
  const progressElement = document.getElementById(`progress-${habitId}`); // Get the progress element for the habit
  try {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}/log`, { // POST request to log progress
      method: "POST", // Specify that it's a POST request
    });

    if (response.ok) {
      progressElement.textContent = "Progress logged!"; // Show success message
      setTimeout(() => progressElement.textContent = "", 2000); // Reset message after 2 seconds
    } else {
      throw new Error("Failed to log progress"); // Handle failure
    }
  } catch (error) {
    console.error("Error logging progress:", error); // Handle any errors during the logging process
    progressElement.textContent = "Error logging progress"; // Show error message
    setTimeout(() => progressElement.textContent = "", 2000); // Reset message after 2 seconds
  }
}

// Add a new habit
async function addHabit(habitData) {
  try {
    const response = await fetch(`${API_BASE_URL}/habits`, { // Send POST request to add a new habit
      method: "POST", 
      headers: {
        "Content-Type": "application/json", // Ensure content is in JSON format
      },
      body: JSON.stringify(habitData), // Send the habit data as the body of the request
    });

    if (response.ok) {
      const newHabit = await response.json(); // Parse the response to get the new habit
      const habitList = document.getElementById("habit-list"); // Get the habit list container
      const habitItem = document.createElement("div"); // Create a new div for the new habit
      habitItem.classList.add("habit-item"); // Add habit-item class for styling
      habitItem.setAttribute("data-id", newHabit.id); // Set the habit ID for future reference

      habitItem.innerHTML = ` /* Add HTML structure for the new habit item */
        <h3>${newHabit.name}</h3>
        <p>${newHabit.description}</p>
        <p><strong>Frequency:</strong> ${newHabit.frequency}</p>
        <p><strong>Next Due:</strong> ${newHabit.next_due}</p>
        <button class="log-progress-btn">Log Progress</button> 
        <span class="progress" id="progress-${newHabit.id}"></span>
      `;

      const logButton = habitItem.querySelector(".log-progress-btn"); // Select the log progress button
      logButton.addEventListener("click", () => logProgress(newHabit.id)); // Add event listener to log progress

      habitList.appendChild(habitItem); // Append the new habit item to the habit list

      // Reset the form and hide it
      document.getElementById("add-habit-form").reset(); // Reset the form fields
      document.getElementById("add-habit-form-container").style.display = "none"; // Hide the form
    } else {
      throw new Error("Failed to add habit"); // Handle failure
    }
  } catch (error) {
    console.error("Error adding habit:", error); // Handle any errors during the habit addition
  }
}

// Handle the form submission for adding a new habit
document.getElementById("add-habit-form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  const name = document.getElementById("habit-name").value; // Get the habit name from the input
  const description = document.getElementById("habit-description").value; // Get the habit description
  const frequency = document.getElementById("habit-frequency").value; // Get the habit frequency
  const next_due = document.getElementById("habit-next-due").value; // Get the next due date

  if (name && description && frequency && next_due) {
    const habitData = { name, description, frequency, next_due }; // Create habit data object
    addHabit(habitData); // Add the habit using the addHabit function
  }
});

// Show the habit form when the "Add New Habit" button is clicked
document.getElementById("add-habit-button").addEventListener("click", () => {
  document.getElementById("add-habit-form-container").style.display = "block"; // Show the form
  document.getElementById("add-habit-button").style.display = "none"; // Hide the "Add New Habit" button
});

// Hide the form if the cancel button is clicked
document.getElementById("cancel-add-habit").addEventListener("click", () => {
  document.getElementById("add-habit-form-container").style.display = "none"; // Hide the form
  document.getElementById("add-habit-button").style.display = "inline-block"; // Show the "Add New Habit" button
});

// Initialize the app by fetching and displaying habits
document.addEventListener("DOMContentLoaded", fetchHabits); // When the document is loaded, fetch habits
