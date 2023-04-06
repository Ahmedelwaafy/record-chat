const record = document.querySelector(".record-btn");
const stop = document.querySelector(".stop-btn");
const close = document.querySelector(".close-btn");
const chatArea = document.querySelector(".chat-area");
const input = document.querySelector(".input-text input");
const uploadBtn = document.querySelector(".upload");
const sendBtn = document.querySelector(".send");
const embedImgInput = document.querySelector("#embed-img");
const chat = document.querySelector(".chat-icon");
const chatFixed = document.querySelector(".chat-fixed");
const recordArea = document.querySelector(".record");
const inputArea = document.querySelector(".input-text");
const uploadArea = document.querySelector(".upload-image");
const timer = document.querySelector(".timer");

let seconds = 1;
let minutes = 0;
let secondsWithZero;
let minutesdWithZero;
let counter;
let showStopCloseBtns;
let items = [];
let recorder;
let stream;

function startRecording() {
  record.classList.toggle("hide");
  
  input.setAttribute("disabled", "");
  recordArea.style.width = "100%";
  recordArea.style.backgroundColor = "#cba4f0";
  inputArea.style.display = "none";
  uploadArea.style.display = "none";
  stop.classList.toggle("hide");
  showStopCloseBtns=setTimeout(() => {
    close.classList.toggle("hide");
    timer.classList.toggle("hide");

}, 1000);

  //timer
  counter = setInterval(() => {
    seconds++;
    if (seconds / 60 == 1) {
      seconds = 0;
      minutes++;
      if (minutes == 2) {
        stopRecording();
        clearInterval(counter);
        seconds = 1;
        minutes = 0;
        timer.innerHTML ="00:01";
        timer.classList.toggle("hide");
      }
    }
    if (seconds < 10) {
      secondsWithZero = "0" + seconds.toString();
    } else {
      secondsWithZero = seconds;
    }

    if (minutes < 10) {
      minutesdWithZero = "0" + minutes.toString();
    } else {
      minutesdWithZero = minutes;
    }
    timer.innerHTML = minutesdWithZero + ":" + secondsWithZero;
  }, 1000);

  //recorder
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
  close.classList.toggle("hide");
  recordArea.style.width = "10%";
  recordArea.style.backgroundColor = "transparent";
  inputArea.style.display = "block";
  uploadArea.style.display = "block";

  //timer
  clearInterval(counter);
  seconds = 1;
  minutes = 0;
          timer.innerHTML = "00:01";

  timer.classList.toggle("hide");


  recorder.stop();

  recorder.onstop = (e) => {
    let blob = new Blob(items, { type: "audio/webm" });
    items = [];
    let audioUrl = URL.createObjectURL(blob);
    console.log(audioUrl);
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

function closeRecording() {
  record.classList.toggle("hide");
  stop.classList.toggle("hide");
  input.removeAttribute("disabled");
  close.classList.toggle("hide");
  recordArea.style.width = "10%";
  recordArea.style.backgroundColor = "transparent";
  inputArea.style.display = "block";
  uploadArea.style.display = "block";

  //timer
  clearInterval(counter);
  seconds = 1;
  minutes = 0;
          timer.innerHTML = "00:01";

  timer.classList.toggle("hide");

  recorder.stop();
  recorder.onstop = (e) => {
    items = [];
    stream.getAudioTracks().forEach((track) => track.stop());
    stream = null;
  };
}

record.addEventListener("click", startRecording);
stop.addEventListener("click", stopRecording);
close.addEventListener("click", closeRecording);

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
                    <p >` +
      text +
      `</p>
     
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
