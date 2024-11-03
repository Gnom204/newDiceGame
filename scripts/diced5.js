import Dice from "./dice.js";

export class DiceD5 extends Dice {
  constructor(
    diceSrc,
    place,
    template,
    diceValue,
    name,
    mechanicsTemplate,
    healContainer,
    form
    // healText
  ) {
    super(diceSrc, place, template, diceValue, name);
    this.mechanicsTemplate = mechanicsTemplate;
    this.mechanicsNode;
    this.resultNode;
    this.result;
    this.atack = 26;
    this.isDef = false;
    this.healContainer = healContainer;
    this.form = form;
    this.oneAction = true;
    // this.healText = healText;
  }
  renderDice() {
    super.renderDice();
    this._createMechanics();
    this.place.insertAdjacentElement("afterbegin", this.mechanicsNode);
  }
  _rollDice(result, container) {
    super._rollDice(result, container);
    this.healContainer.classList.add("heal-invis");
    this.oneAction = true;
    // healText.textContent = "Введите ваше текущее здоровье"
  }
  _createMechanics() {
    const clone =
      this.mechanicsTemplate.content.firstElementChild.cloneNode(true);
    const atack = clone.querySelector(".attack");
    const defense = clone.querySelector(".defense");
    // const heal = clone.querySelector(".heal");
    super.getResult();
    atack.addEventListener("click", () => {
      if (this.oneAction) {
        console.log(parseInt(this.result) + 10);
        this.result = parseInt(this.result) + this.atack;
        this.resultNode.textContent = this.result;
        console.log("Атака");
        this.oneAction = false;
      }
    });
    defense.addEventListener("click", () => {
      if (this.oneAction) {
        this.isDef = true;
        this.result = Math.round(parseInt(this.result) / 2);
        this.resultNode.textContent = this.result;
        console.log("Защита");
        this.oneAction = false;
      }
    });
    // heal.addEventListener("click", () => {
    //   console.log(this.place.firstElementChild);
    //   console.log("Лечение");
    //   if (this.oneAction) {
    //     this.form.classList.remove("heal-invis");
    //     this._healRender();
    //     this.oneAction = false;
    //   }
    //   // this._plusRender();
    // });
    this.mechanicsNode = clone;
  }

  // _plusRender() {
  //   let value = Math.round(Math.random() * 60);
  //   let x = 0;
  //   const plusContainer = document.createElement("div");
  //   plusContainer.classList.add("plus-container");
  //   while (x < value) {
  //     let xCor = Math.round(Math.random() * 150);
  //     let yCor = Math.round(Math.random() * 150);
  //     const plus = document.createElement("div");
  //     plus.classList.add("plus");
  //     plus.style.top = `${yCor}px`;
  //     plus.style.left = `${xCor}px`;
  //     plusContainer.insertAdjacentElement("afterbegin", plus);
  //     this.place.insertAdjacentElement("beforeend", plusContainer);
  //     x++;
  //   }
  //   setTimeout(() => {
  //     this.place.removeChild(plusContainer);
  //   }, 1000);
  // }
  _healRender() {
    this.healContainer.classList.remove("heal-invis");
  }
}
