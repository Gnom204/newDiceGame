import { DiceD30 } from "./scripts/diced30.js";
import { DiceD5 } from "./scripts/diced5.js";
import { DiceD6 } from "./scripts/diced6.js";
import Paint from "./scripts/paint.js";

const root = document.querySelector(".root");

const mechanicsTemplate = document.querySelector("#mechanics");

const form = document.querySelector(".form");

const healContainer = document.querySelector("#heal-con");
const healText = document.querySelector(".heal-text");

const diceD6Url = "./source/cub.svg";
const diceD30Url = "./source/D30.svg";
const diceD5Url = "./source/diced5.png";

const template = document.querySelector("#template");
const choiceTemplate = document.querySelector("#dice-choice");
const paintTemplate = document.querySelector("#paint");

const gameAlert = document.querySelector(".game-alert");

const place = document.querySelector(".dices");
const choisePlace = document.querySelector(".choose-dice");

const d6Sound = document.getElementById("D6Sound");
const d30Sound = document.getElementById("D30Sound");

let diceD6Arr = ["1", "2", "3", "4", "5", "—"];
let diceD5Arr = [
  "2",
  "4",
  "10",
  "14",
  "20",
  "24",
  "30",
  "34",
  "40",
  "44",
  "40",
  "44",
  "60",
  "64",
  "70",
  "74",
  "80",
  "84",
  "90",
  "94",
  "100",
];

const fillArr = (num) => {
  let arr = [];
  let x = 1;
  while (x < num) {
    arr.push(x.toString());
    x++;
  }
  return arr;
};

let diceD30Arr = fillArr(30);

let diceCount = [
  {
    src: "./source/silement.svg",
    name: "silement",
  },
  // {
  //   src: "./source/diced5.png",
  //   name: "D5",
  // },
  {
    src: "./source/cub.svg",
    name: "D6",
  },
  {
    src: "./source/D30.svg",
    name: "D30",
  },
];
let needImg;
function createChoice(src, name) {
  const cloneChoice = choiceTemplate.content.cloneNode(true);

  const img = cloneChoice.querySelector(".choice-img");
  const text = cloneChoice.querySelector(".choice-name");
  img.id = name;
  img.src = src;
  if (img.id === "D30") {
    needImg = img;
    img.classList.add("blocked-dice");
  }
  text.textContent = name;

  img.addEventListener("click", postDice);
  return cloneChoice;
}

function choiseDice() {
  diceCount.forEach((dice) => {
    const choise = createChoice(dice.src, dice.name);
    choisePlace.appendChild(choise);
  });
}

function postDice(e) {
  const { id } = e.target;
  if (e.target.classList.contains("blocked-dice")) {
    console.log("Нельзя выбрать");
  } else if (id === place.firstElementChild.id) {
    console.log("Выбран тот же кубик");
    console.log(place.firstElementChild.firstElementChild.classList);
    return;
  } else if (id === "D6" && place.firstElementChild.id != "D5") {
    place.firstElementChild.remove();
    gameAlert.textContent = "";
    diceD6.renderDice();
    needImg.classList.add("blocked-dice");
  } else if (id === "D6" && place.firstElementChild.id === "D5") {
    gameAlert.textContent = "";
    place.firstElementChild.remove();
    place.firstElementChild.remove();
    healContainer.classList.add("heal-invis");
    healText.textContent = "Введите ваше текущее здоровье";
    diceD6.renderDice();
  } else if (
    id === "D30" &&
    !needImg.classList.contains("blocked-dice") &&
    place.firstElementChild.id != "D5"
  ) {
    place.firstElementChild.remove();
    diceD30.renderDice();
  } else if (
    id === "D30" &&
    place.firstElementChild.id === "D5" &&
    !needImg.classList.contains("blocked-dice")
  ) {
    healContainer.classList.add("heal-invis");
    healText.textContent = "Введите ваше текущее здоровье";
    place.firstElementChild.remove();
    place.firstElementChild.remove();
    diceD30.renderDice();
  } else if (id === "D5" && place.firstElementChild.id != "D5") {
    console.log(place.firstElementChild);
    gameAlert.textContent = "";
    place.firstElementChild.remove();
    diceD5.renderDice();
  } else if (id === "silement" && place.firstElementChild.id === "D5") {
    gameAlert.textContent = "";
    place.firstElementChild.remove();
    place.firstElementChild.remove();
    needImg.classList.add("blocked-dice");
    paint.again();
    paint.renderPaint();
  } else if (id === "silement" && place.firstElementChild.id != "silement") {
    place.firstElementChild.remove();
    gameAlert.textContent = "";
    paint.renderPaint();
    paint.doNotStop();
  }
}
function d30Can() {
  paint.doNotStop();
}

// function heal() {
//   const healInput = healContainer.querySelector("#heal-input");
//   const healBtn = healContainer.querySelector(".heal-btn");
//   let hp;
//   healInput.addEventListener("input", () => {
//     hp = parseInt(healInput.value) + (parseInt(healInput.value) / 100) * 40;
//   });
//   healBtn.addEventListener("click", () => {
//     if (healInput.value != "") {
//       healInput.value = "";
//       healText.textContent = `Ваше здоровье восполнено до ${Math.round(hp)}`;
//       form.classList.add("heal-invis");
//     } else {
//       healText.textContent = "Введите ваше текущее здоровье";
//     }
//   });
// }

// heal();

choiseDice();

const pasiveDice1 = document.querySelector("#D5");
const pasiveDice2 = document.querySelector("#D6");

const paint = new Paint(paintTemplate, place, root);

const diceD6 = new DiceD6(
  diceD6Url,
  place,
  template,
  diceD6Arr,
  "D6",
  needImg,
  gameAlert,
  () => diceD30.renderDice(),
  pasiveDice1,
  pasiveDice2,
  () => diceD30.setClick(),
  d6Sound
);
const diceD30 = new DiceD30(
  diceD30Url,
  place,
  template,
  diceD30Arr,
  "D30",
  gameAlert,
  needImg,
  () => diceD6.renderDice(),
  pasiveDice1,
  pasiveDice2,
  d30Sound
);
const diceD5 = new DiceD5(
  diceD5Url,
  place,
  template,
  diceD5Arr,
  "D5",
  mechanicsTemplate,
  healContainer,
  form,
  healText
);
diceD6.renderDice();
