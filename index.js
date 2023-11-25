const baseURL = "https://chatbot-goodspace.onrender.com";
// const baseURL = "http://localhost:3020";
const socket = io(baseURL);

const getChatsUrl = `${baseURL}/api/v1/getMessages`;
const deleteChatUrl = `${baseURL}/api/v1/deleteMessages`;

// Get DOM elements
const chatForm = document.getElementById("chat-form");
const questionInput = document.getElementById("question-input");
const chatContainer = document.getElementById("chat-container");
const deleteChatBtn = document.getElementById("delete-btn");

async function fetchData() {
  try {
    const response = await fetch(getChatsUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const content = data.message.map((item, index) => {
      const div = document.createElement("div");

      if (index % 2 == 0) div.textContent = `You:  ${item.message}`;
      else div.textContent = `Bot:  ${item.message}`;
      return div;
    });

    chatContainer.innerHTML = ""; // Clear the container first (if needed)

    content.forEach((element) => {
      chatContainer.appendChild(element); // Append each created div element to the container
    });
    return data; // You can return the data if needed for further processing
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throwing the error for handling at a higher level if necessary
  }
}

// Call the async function
fetchData();

// const content = data.map(item => `<p>${item}</p>`).join('');

// Submit form event
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();

  if (question !== "") {
    // Send the question to the server
    socket.emit("ask-question", { userPrompt: question });
    // Add the question to chat display
    chatContainer.innerHTML += `<div>YOU:  ${question}</div>`;
    // Clear the input
    questionInput.value = "";
  }
});

// Receive response from server
socket.on("bot-response", (response) => {
  // Display the response in the chat area
  chatContainer.innerHTML += `<div>BOT:  ${response.answer.content}</div>`;
  // Scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

deleteChatBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(deleteChatUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throwing the error for handling at a higher level if necessary
  }
});
