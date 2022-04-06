const chatLog = document.querySelector("#chat-log");
const roomName = JSON.parse(document.getElementById("room-name").textContent);

if (!chatLog.hasChildNodes()) {
    const emptyText = document.createElement("h3");
    emptyText.innerText = "No messages yet";
    emptyText.id = "emptyText";
    chatLog.appendChild(emptyText);
}

const chatSocket = new WebSocket(
  "ws://" + window.location.host + "/ws/chat/" + roomName + "/"
);

chatSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  console.log(data)
  const messageElement = document.createElement("div");
  const user_id = data.user_id;
  const loggedInUserId = JSON.parse(document.getElementById("user_id").textContent);
  messageElement.innerText = data.user_username + ": " + data.message;
  if (user_id === loggedInUserId) {
    messageElement.classList.add("message", "sender");
  }
  else {
    messageElement.classList.add("message", "receiver");
  }
  chatLog.appendChild(messageElement);

  if (document.querySelector("#emptyText")) {
    chatLog.removeChild(document.getElementById("emptyText"));
  }
};

chatSocket.onclose = function (e) {
  console.error("Chat socket closed unexpectedly");
};

document.querySelector("#chat-message-input").focus();
document.querySelector("#chat-message-input").onkeyup = function (e) {
  if (e.keyCode === 13) {
    // enter, return
    document.querySelector("#chat-message-submit").click();
  }
};

document.querySelector("#chat-message-submit").onclick = function (e) {
  const messageInputDom = document.querySelector("#chat-message-input");
  const message = messageInputDom.value;
  if (message){
  chatSocket.send(
    JSON.stringify({
      message: message,
    })
  );
  }
  messageInputDom.value = "";
};