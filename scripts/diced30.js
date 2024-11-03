import Dice from "./dice.js";

export class DiceD30 extends Dice {
  constructor(
    diceSrc,
    place,
    template,
    diceValue,
    name,
    gameAlert,
    needImg,
    diceRender,
    pasivedice1,
    pasivedice2,
    sound
  ) {
    super(diceSrc, place, template, diceValue, name);
    this.gameAlert = gameAlert;
    this.needImg = needImg;
    this.diceRender = diceRender;
    this.canClick = false;
    this.isRoll = false;
    this.sound = sound;
    this.pasivedice1 = pasivedice1;
    this.pasivedice2 = pasivedice2;
  }
  /**
   *
   * @param  result span элемент с выпавшим значением
   * @param  container самый главный контейнер, в который мы кидаем кубик/холст
   */
  _rollDice(result, container) {
    if (this.canClick) {
      // this._playSoundD30();
      this.getResult();
      super._rollDice(result, container);
      this.canClick = false;
      setTimeout(() => {
        this.isRoll = true;
      }, 1500);
    }
    if (this.isRoll) {
      this.place.firstElementChild.remove();
      this.diceRender();
      this.gameAlert.textContent = "";
      this.needImg.classList.add("blocked-dice");
      this.isRoll = false;
      this.pasivedice1.classList.remove("blocked-dice");
      this.pasivedice2.classList.remove("blocked-dice");
    }
  }
  setClick() {
    this.canClick = true;
  }
  getResult() {
    super.getResult();
    let res;
    console.log(res);
    let description = document.createElement("p");
    description.classList.add("description-ability");
    res = this._getDescription();
    setTimeout(() => {
      this.gameAlert.textContent = res.name;
      this.gameAlert.insertAdjacentElement("beforeend", description);
      description.textContent = res.description;
    }, 500);
  }
  _playSoundD30() {
    this.sound.play();
  }
  _getDescription() {
    let res;
    switch (this.result) {
      case "1":
        res = {
          name: "Оглушение",
          description: "пропуск броска",
        };
        break;
      case "3":
        res = {
          name: "Оглушение (2)",
          description: "пропуск броска два раза подряд",
        };
        break;
      case "5":
        res = {
          name: "Назад дороги нет (5)",
          description:
            "невозможность ходить назад на протяжении пяти своих бросков",
        };
        break;
      case "7":
        res = {
          name: "Одноногий странник (2)",
          description:
            "выпавшие значения вдове меньше на протяжении двух бросков (если выпало значение 1 или 2, то ходить нельзя)",
        };
        break;
      case "9":
        res = {
          name: "Марионетка",
          description: "захват управления чужим броском и ходом",
        };
        break;
      case "11":
       
      res = {
        name: "Точка возврата",
        description: "возвращение на 7 точек по прямой к краю лабиринта, находящемуся противоположно стороне портала",
      };

        break;
      case "13":
        res = {
          name: "Занесенный странник",
          description:
            "отправление игрока на любую клетку в радиусе 10х10 клеток от него",
        };
        break;
      case "15":
        res = {
          name: "В минус один",
          description: "ход на одно значение меньше от выпавшего (если выпало значение 1, то ходить нельзя)",
        };

        break;
      case "17":
        res = {
          name: "Один к одному",
          description:
            "ход на одну клетку в независимости от того, какое значение выпало",
        };
        break;
      case "19":
        res = {
          name: "Один к одному (3)",
          description:
            "ход три броска подряд на одну клетку в независимости от того, какое значение выпало",
        };
        break;
      case "21":
        res = {
          name: "Невидимая атака",
          description: "каждый ход наносит -20 ед. здоровья в течение броска",
        };

        break;
      case "23":
       
      res = {
        name: "Лишение",
        description:
          "возможность лишить игрока его усиления",
      };

        break;
      case "25":
        res = {
          name: "Забрать чужое",
          description:
            "возможность забрать у игрока его усиление и воспользоваться им в любой момент",
        };

        break;
      case "27":
        res = {
          name: "Больная рулетка",
          description: "-50 ед. здоровья за каждый ход",
        };
        break;
      case "29":
        res = {
          name: "Жизнь или смерть",
          description:
            "от -100 до -400 ед. урона в зависимости от выпавшего значения (где значение 1=100 ед. урона и т.д.)",
        };
        break;
      case "2":
        res = {
          name: "Режим скорости",
          description: "двойной бросок",
        };
        break;
      case "4":
        res = {
          name: "Диаго-шаг",
          description: "ход по диагонали",
        };
        break;
      case "6":
        res = {
          name: "Гиг-шаг",
          description: "ход через клетку",
        };
        break;
      case "8":
        res = {
          name: "Иммунитет свыше",
          description: "неуязвимость",
        };
        break;
      case "10":
        res = {
          name: "Целевой переброс",
          description:
            "перемещение в любую клетку в радиусе 10х10 клеток от себя",
        };
        break;
      case "12":
        res = {
          name: "Курс лечения",
          description: "+20 ед. здоровья в течение каждого хода",
        };
        break;
      case "14":
       
      res = {
        name: "Диаго-шаг (2)",
        description:
          "ход по диагонали два броска подряд",
      };

        break;
      case "16":
        res = {
          name: "Двойные действия",
          description:
            "применение одновременно двух усилений за бросок (не считая это усиление)",
        };
        break;
      case "18":
        res = {
          name: "Вынужденный привал",
          description: "возможность пропустить свой бросок",
        };
        break;
      case "20":
        res = {
          name: "Вынужденный привал(2)",
          description: "возможность пропустить два броска подряд",
        };
        break;
      case "22":
        res = {
          name: "Четыре икса",
          description: "выпавшие значения 1 и 2 умножаются на 4",
        };
        break;
      case "24":
        res = {
          name: "Безопасная дорога",
          description:
            "ход в любом направлении через любые препятствия (кроме стен)",
        };
        break;
      case "26":
        res = {
          name: "Дай пять",
          description: "ход на 5 клеток",
        };
        break;
      case "28":
      res = {
        name: "Нет отрицаниям",
        description: "возможность снять с себя наложенное отрицание",
      };
        break;
      case "30":
        res = {
          name: "Реабилитация",
          description: "мгновенно +250 ед. здоровья",
        };
        break;
    }
    console.log({ res });
    return res;
  }
}
