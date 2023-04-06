const record = document.querySelector(".record-btn");
const stop = document.querySelector(".stop-btn");
const chatArea = document.querySelector(".chat-area");
const input = document.querySelector(".input-text input");
const uploadBtn = document.querySelector(".upload");
const sendBtn = document.querySelector(".send");
const embedImgInput = document.querySelector("#embed-img");
const chat = document.querySelector(".chat-icon");
const chatFixed = document.querySelector(".chat-fixed");



let items = [];
let recorder;
let stream;

function startRecording() {
  record.classList.toggle("hide");
  stop.classList.toggle("hide");
  input.setAttribute("disabled", "");

  let device = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  device
    .then((streamobj) => {
      stream = streamobj;
      recorder = new MediaRecorder(streamobj);

      recorder.ondataavailable = (e) => {
        items.push(e.data);
      };
      recorder.start();
    })
    .catch((Error) => console.log(Error.name, Error.message));
}

function stopRecording() {
  record.classList.toggle("hide");
  stop.classList.toggle("hide");
  input.removeAttribute("disabled");

  recorder.stop();

  recorder.onstop = (e) => {
    let blob = new Blob(items, { type: "audio/webm" });
    items = [];
    newMessage = document.createElement("div");
    newMessage.classList.add("message");
    newMessage.innerHTML =
      `
                    <audio controls src="` +
      URL.createObjectURL(blob) +
      `" type="video/webm"></audio>
                    <div class="user-img">
                        <img src="./user.svg" >
                    </div>
`;
    chatArea.appendChild(newMessage);
    stream.getAudioTracks().forEach((track) => track.stop());
    stream = null;
  };
}

record.addEventListener("click", startRecording);
stop.addEventListener("click", stopRecording);

uploadBtn.addEventListener("click", () => {
  record.classList.add("hide");
  sendBtn.classList.remove("hide");
});

sendBtn.addEventListener("click", () => {
  record.classList.remove("hide");
  sendBtn.classList.add("hide");
});

function toggleRecordSend(e) {
  if (e.target.value !== "") {
    record.classList.add("hide");
    sendBtn.classList.remove("hide");
  } else {
    record.classList.remove("hide");
    sendBtn.classList.add("hide");
  }
}
input.addEventListener("keyup", (e) => toggleRecordSend(e));

function sendTextOrImage() {
  let text = input.value;
  let imgFiles = embedImgInput.files;
 

  if (text !== "") {
    textMessage = document.createElement("div");
    textMessage.classList.add("text-message");
    textMessage.innerHTML =
      `
                    <p >` +text+`</p>
     
                    <div class="user-img">
                        <img src="./user.svg" >
                    </div>
`;
    chatArea.appendChild(textMessage);
    input.value = "";
  }

  if (imgFiles.length > 0) {
     let imgsrc = URL.createObjectURL(embedImgInput.files[0]);
    imgMessage = document.createElement("div");
    imgMessage.classList.add("img-message");
    imgMessage.innerHTML =
      `
         <img class="img"  src="` +
      imgsrc +
      `" >

                        <div class="user-img">
                            <img src="./user.svg" >
                         </div>
`;
    chatArea.appendChild(imgMessage);
  }
  
}

sendBtn.addEventListener("click", sendTextOrImage);
chat.addEventListener("click", () => chatFixed.classList.toggle("hide"));
