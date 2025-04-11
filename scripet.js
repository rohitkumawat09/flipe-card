const flipCards = document.querySelectorAll('.flip-card');
const name1 = document.querySelector(".name");
const scoreElement = document.querySelector(".score span");
const timerElement = document.querySelector(".timer span");
const clickCountElement = document.querySelector(".click span");
const btnboard = document.querySelector("#btnboard");
const copyData = document.querySelector("#copydata");
const lastDiv = document.querySelector("#lastDiv");

const flipCardsBack = document.querySelectorAll(".flip-card-back");

let score = 0;
let clicks = 0;
let timeLeft = 50;
let timerInterval;

const images = [
  "img/image2.jpg",
  "img/image3.jpg",
  "img/image4.jpg",
  "img/image5.webp",
  "img/image6.avif",
  "img/amitabh.webp",
];

let new_array = [...images, ...images];
let dummy = [];

const button = document.querySelector('.btn button');
const parentDiv = document.getElementById('parent');
const details = document.querySelector(".details");

initializeGameImages();

button.addEventListener('click', function () {
  const value = name1.value.trim();
  if(value=="") return;


  details.style.display = "block";
  name1.style.display = "none";
  button.style.display = 'none';
  parentDiv.style.display = 'flex';

  startTimer();

  let savedData = JSON.parse(localStorage.getItem("localdata")) || [];

  

  let obj = {
    name: value,
    date: new Date().toLocaleString(),
    score: 0,
    time: 0,
    clicks: 0,
  };

  savedData.push(obj);
  localStorage.setItem("localdata", JSON.stringify(savedData));
});

function initializeGameImages() {
  for (let i = 0; i < new_array.length; i++) {
    let image = document.createElement("img");
    image.src = new_array[getUniqueImageIndex()];
    flipCardsBack[i].append(image);
  }
}

function getUniqueImageIndex() {
  let check = Math.floor(Math.random() * new_array.length);
  if (dummy.includes(check)) return getUniqueImageIndex();
  dummy.push(check);
  return check;
}

function startTimer() {
  score = 0;
  timeLeft = 50;
  clicks = 0;
  scoreElement.innerText = score;
  timerElement.textContent = timeLeft;
  clickCountElement.textContent = clicks;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    let getArr = JSON.parse(localStorage.getItem("localdata"));
    getArr[getArr.length - 1].time = timeLeft;
    localStorage.setItem("localdata", JSON.stringify(getArr));

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      setTimeout(() => {
        name1.style.display = "block";
        button.style.display = 'block';
      

    },5000);
    }
  }, 1000);
}

function updateClickCount() {
  clicks++;
  clickCountElement.textContent = clicks;

  let getArr = JSON.parse(localStorage.getItem("localdata"));
  getArr[getArr.length - 1].clicks = clicks;
  localStorage.setItem("localdata", JSON.stringify(getArr));
}

let flippedCards = [];

flipCards.forEach(card => {
  const frontImage = card.querySelector('.flip-card-front img');
  const flipInner = card.querySelector('.flip-card-inner');

  frontImage.addEventListener('click', function () {
    if (flippedCards.length < 2 && !flippedCards.includes(card)) {
      flipInner.style.transform = 'rotateY(180deg)';
      flippedCards.push(card);
      updateClickCount();

      if (flippedCards.length === 2) {
        checkMatch();
      }
    }
  });
});

function checkMatch() {
  const [card1, card2] = flippedCards;
  const img1 = card1.querySelector('.flip-card-back img').src;
  const img2 = card2.querySelector('.flip-card-back img').src;

  if (img1 === img2) {
    score++;
    scoreElement.textContent = score;

    let getArr = JSON.parse(localStorage.getItem("localdata"));
    getArr[getArr.length - 1].score = score;
    localStorage.setItem("localdata", JSON.stringify(getArr));

    flippedCards = [];
  } else {
    setTimeout(() => {
      card1.querySelector('.flip-card-inner').style.transform = 'rotateY(0deg)';
      card2.querySelector('.flip-card-inner').style.transform = 'rotateY(0deg)';
      flippedCards = [];
    }, 1000);
  }
}

btnboard.addEventListener("click", () => {
  lastDiv.style.display="none"
  let CopyDATA = JSON.parse(localStorage.getItem("localdata"));
  copyData.innerHTML = "";
  parentDiv.style.display = 'none';
  details.style.display = "none";
  button.style.display = 'none';
  name1.style.display = "none";



  if (CopyDATA && CopyDATA.length > 0) {
    copyData.style.display = "block";
    CopyDATA.sort((a, b) => b.score - a.score);
  } else {
    copyData.style.display = "block";
    copyData.innerText = "NO DATA TO SHOW YET !!!";
    copyData.classList.add("NoDATA");
    return;
  }

  let table = document.createElement("table");
  table.classList.add("tables");

  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  headerRow.classList.add("headerRow");
  let headers = ["Name", "Date", "Score", "Time", "Clicks"];

  headers.forEach(text => {
    let th = document.createElement("th");
    th.innerText = text;
    th.style.border = "1px solid white";
    th.style.padding = "8px";
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  let tbody = document.createElement("tbody");
  tbody.style.color = "white";
  tbody.style.fontSize = "20px";

  CopyDATA.forEach(val => {
    let dataRow = document.createElement("tr");

    ["name", "date", "score", "time", "clicks"].forEach(key => {
      let cell = document.createElement("td");
      cell.innerText = val[key];
      cell.classList.add("lead");
      cell.style.border = "1px solid white";
      cell.style.padding = "8px";
      dataRow.appendChild(cell);
    });

    tbody.appendChild(dataRow);
  });

  table.append(thead, tbody);
  copyData.appendChild(table);
});
