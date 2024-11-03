export default class Paint {
  constructor(template, place, body) {
    this.template = template;
    this.place = place;
    this.isMobile = false;
    this.drawing;
    this.isDraw = false;
    this.lastTime = true;
    this.time;
    this.times = [500, 1000, 1500, 2000, 2500, 3000];
    this.lineWid;
    this.lineInterval;
    this.downInterval;
    this.upperInterval;
    this.averageLine = [];
    this.stop = false;
    this.isIOS = null;
    this.body = body;
    this.previousTouch;
    this.gradient = ["#FAF001", "#E7DE0F", "#F01515", "#F07115"];
  }
  _createPaint() {
    let width = window.innerWidth;
    if (width < 900) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.clone = this.template.content.cloneNode(true);
    this.canvas = document.createElement("canvas");
    this.averageText = document.createElement("p");
    this.averageText.classList.add("average-text");
    this.averageText.textContent = 0;

    this.canvas.width = !this.isMobile ? 300 : 240;
    this.canvas.height = !this.isMobile ? 280 : 250;
    this.canvas.classList.add("canvas");
    this.container = this.clone.querySelector(".paint-container");
    this.wall = this.clone.querySelector(".paint-wall");
    this.ctx = this.canvas.getContext("2d");

    this.timer = this.clone.querySelector(".timer");
    this.second = this.clone.querySelector(".second");
    this.milSecond = this.clone.querySelector(".milsecond");
    // this.reset = this.clone.querySelector(".reset");
    // this.sparkles = this.clone.querySelector(".sparkles");

    this._getRandomTime(this.times);
    let endTime = Date.now() + this.time;
    let remainingTime = endTime - Date.now();
    let futseconds = Math.floor(remainingTime / 1000);
    let futmilliseconds = remainingTime % 1000;

    this.second.textContent = `0${futseconds}`;
    this.milSecond.textContent = futmilliseconds;

    // this.reset.addEventListener("click", () => this._reset());

    this.canvas.addEventListener("mouseup", (e) => this._stopDrawing(e));
    this.canvas.addEventListener("mousedown", (e) => this._startDrawing(e));
    this.canvas.addEventListener("mousemove", (e) => this._draw(e));
    this.canvas.addEventListener("touchstart", (e) => this._startDrawing(e));
    this.canvas.addEventListener("touchmove", (e) => this._draw(e));
    this.canvas.addEventListener("touchend", (e) => this._stopDrawing(e));
    document.addEventListener("mouseup", (e) => {
      e.stopPropagation;
      if (this.isDraw) {
        this._stopDrawing(e);
      }
    });
    document.addEventListener("mousemove", (e) => {
      e.stopPropagation;
      if (this.isDraw && !e.target.classList.contains("canvas")) {
        this._stopDrawing(e);
      }
    });
    document.addEventListener("touchmove", (e) => {
      e.stopPropagation;
      if (this.isDraw && !e.touches[0].target.classList.contains("canvas")) {
        this._stopDrawing(e);
      }
    });
    return this.clone;
  }
  renderPaint() {
    this.paint = this._createPaint();
    this.timer.insertAdjacentElement("afterend", this.averageText);
    this.timer.insertAdjacentElement("afterend", this.canvas);
    this.place.appendChild(this.paint);
  }
  _draw(e) {
    e.preventDefault();
    if (!this.drawing) {
      return;
    }
    if (!this.lastTime) {
      return;
    } else {
      if (this.isMobile) {
        this.x =
          e.touches[0].pageX -
          this.canvas.parentNode.parentNode.offsetLeft -
          40;
        this.y =
          e.touches[0].pageY -
          this.canvas.parentNode.parentNode.offsetTop -
          105;
        if (this.x < 0 || this.x > 235 || this.y < 0 || this.y > 240) {
          this._stopDrawing();
        }
        // this.sparkles.style.top = this.y + 32 + "px";
        // this.sparkles.style.left = this.x - 37 + "px";
        // this.sparkles.style.display = "block";
      } else {
        this.x = e.pageX - this.canvas.parentNode.parentNode.offsetLeft;
        this.y = e.pageY - this.canvas.parentNode.parentNode.offsetTop - 98;
        // this.sparkles.style.top = this.y + 67 + "px";
        // this.sparkles.style.left = this.x - 35 + "px";
        // this.sparkles.style.display = "block";
      }
      this._setLineWidth(e);
      this.isDraw = true;
      // let cords = this.canvas.getBoundingClientRect();
      // console.log({
      //   left: cords.x,
      //   right: cords.x + cords.width,
      //   top: cords.y,
      //   bottom: cords.y + cords.height,
      // });

      /**
       * Когда-нибудь я научусь документировать код, а пока импровизация
       * Настройка кисти
       */

      this.ctx.lineCap = "round";
      this.ctx.strokeStyle = "red";
      const ua = navigator.userAgent;

      if (
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
      ) {
        this.ctx.setShadow(0, 0, 10, "red");
      } else {
        this.ctx.shadowColor = "red";
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
      }
      this.ctx.lineTo(this.x, this.y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.lineWidth = this.lineWid;
      this.ctx.moveTo(this.x, this.y);
    }
  }
  _startDrawing(e) {
    this._getInfo();
    if (this.isMobile) {
      this.x =
        e.touches[0].clientX - this.canvas.parentNode.parentNode.offsetLeft;
      this.y =
        e.touches[0].clientY - this.canvas.parentNode.parentNode.offsetTop;
      // this.sparkles.style.top = this.y - 40 + "px";
      // this.sparkles.style.left = this.x - 60 + "px";
    } else {
      this.x = e.clientX - this.canvas.parentNode.parentNode.offsetLeft;
      this.y = e.clientY - this.canvas.parentNode.parentNode.offsetTop;
      // this.sparkles.style.top = this.y + 67 + "px";
      // this.sparkles.style.left = this.x - 35 + "px";
    }
    if (this.stop) {
      this._reset();
      this.stop = false;
    } else {
      if (this.lastTime) {
        this.lineWid = 1;
        this.index = 0;
      }
      if (!this.isDraw) {
        this._countdownTimer(this.time);
        this.timerset = setTimeout(() => {
          this.lastTime = false;
        }, this.time);
      }
      this.wall.src = "./source/wall.svg";
      this.isDraw = true;
      this.drawing = true;
    }
  }

  _countdownTimer(milliseconds) {
    console.log({ milliseconds });
    let endTime = Date.now() + milliseconds;

    this.timerInterval = setInterval(() => {
      let remainingTime = endTime - Date.now();
      if (remainingTime <= 0) {
        clearInterval(this.timerInterval);
        clearInterval(this.lineInterval);
        this.second.textContent = "00";
        this.milSecond.textContent = "00";
        this.averageText.textContent = this._getAverageValue(this.averageLine);
        this.averageLine.length = 0;
        this.wall.src = "./source/red-wall.svg";
        this.stop = true;
        this.drawing = false;
        // this.sparkles.style.display = "none";
      } else {
        let seconds = Math.floor(remainingTime / 1000);
        let milliseconds = remainingTime % 1000;
        this.second.textContent = seconds;
        this.milSecond.textContent = milliseconds;
      }
    }, 1); // Проверяем каждую миллисекунду
  }
  _getRandomTime(items) {
    this.time = 3500;
  }
  _reset() {
    this._getRandomTime(this.times);
    let endTime = Date.now() + this.time;
    let remainingTime = endTime - Date.now();
    let futseconds = Math.floor(remainingTime / 1000);
    let futmilliseconds = remainingTime % 1000;
    this.wall.src = "./source/wall.svg";

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lastTime = true;
    this.isDraw = false;
    this.drawing = false;
    this.averageText.textContent = 0;

    clearInterval(this.upperInterval, this.downInterval);
    clearInterval(this.timerInterval);
    clearInterval(this.lineInterval);
    clearTimeout(this.timerset);
    this.second.textContent = `0${futseconds}`;
    this.milSecond.textContent = futmilliseconds;
  }

  again() {
    this.drawing = false;
    this.lastTime = true;
  }

  _stopDrawing() {
    if (this.isDraw) {
      this.drawing = false;
      if (this.lastTime) {
        this.lastTime = false;
        clearInterval(this.timerInterval);
        clearInterval(this.lineInterval);
        this.second.textContent = "00";
        this.milSecond.textContent = "00";
        this.drawing = false;
        this.stop = true;
        // this.sparkles.style.display = "none";
        this.ctx.shadowColor = "transparent";
        this.ctx.fillStyle = "transparent";
        this.wall.src = "./source/red-wall.svg";
        this.averageText.textContent = this._getAverageValue(this.averageLine);
        this.averageLine.length = 0;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.ctx.beginPath();
      this._getInfo();
    }
  }
  _setLineWidth(e) {
    if (this.isMobile) {
      let touch = e.touches[0];
      if (this.previousTouch) {
        e.movementX = touch.pageX - this.previousTouch.pageX;
        e.movementY = touch.pageY - this.previousTouch.pageY;
      }
      this.previousTouch = touch;
    }
    let { movementX, movementY } = e;

    if (movementX > 8 || movementY > 8 || movementX < -8 || movementY < -8) {
      this.averageLine.push(this.lineWid);
      if (this.lineWid < 3.5) {
        this.lineWid += 0.3;
      }
    } else {
      this.averageLine.push(this.lineWid);

      if (this.lineWid > 1) {
        this.lineWid -= 0.3;
      }
    }
  }
  _getInfo() {
    console.log({
      lastTime: this.lastTime,
      drawing: this.drawing,
      isDraw: this.isDraw,
    });
  }
  _getGradient() {
    this.gradientInterval = setInterval(() => {
      if (this.index < this.gradient.length) {
        this.index++;
      } else {
        this.index = 0;
      }
    }, 300);
  }
  _getRundNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // _getAverageValue(arr) {
  //   let sum = 0;
  //   let countOfElements = arr.length;
  //   for (let i = 0; i < countOfElements; i++) {
  //     sum += arr[i];
  //   }
  //   return Math.floor((sum / countOfElements).toFixed(2)*100/3);
  // }
//  _getAverageValue(arr) {
//     let sum = 0;
//     let countOfElements = arr.length;
//     for (let i = 0; i < countOfElements; i++) {
//     sum += arr[i];
//     }
//     let average = sum / countOfElements;
//     let normalizedValue = (average * 10) ;
//     return Math.min(Math.max(normalizedValue, 10), 100).toFixed(2);
//     }
 _getAverageValue(arr) {
  let sum = 0; // Initialize a variable to store the sum of array elements
  let countOfElements = arr.length; // Get the total number of elements in the array
  
  // Loop through each element in the array
  for (let i = 0; i < countOfElements; i++) {
      sum += arr[i]; // Add the current element to the sum
  }

  let average = sum / countOfElements; // Calculate the average value
  let normalizedValue = (average * 10*3.6)-28; // Multiply the average by 10

  //  Limit the normalized value to be between 10 and 100 
  let result = Math.min(Math.max(normalizedValue, 10), 100);
  let newResult = Math.round(result/5)*5 +result/100;

  // Return the result rounded to 2 decimal places
  return newResult.toFixed(1); 
}


  doNotStop() {
    console.log("сработала");
    this.isDraw = false;
    this.lastTime = true;
    this.stop = false;
  }
}
