function swap(a, i, j) {
  let temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function DNA(total, order) {

  this.dist = Infinity;
  this.fitness = 0;


  this.init = function () {
    if (order instanceof Array) {
      this.order = order.slice();
      if (random(1) < 0.05) {
        this.shuffle();
      }
    } else {

      this.order = [];
      for (let i = 0; i < total; i++) {
        this.order[i] = i;
      }

      for (let n = 0; n < 100; n++) {
        this.shuffle();
      }
    }
  }
  this.shuffle = function () {
    
    let i = floor(random(this.order.length)) + 1;
    let j = floor(random(this.order.length)) + 1;
    if (i >= this.order.length) {
      i--;
    }

    if (j >= this.order.length) {
      j--;
      j--;
    }
    

    /*let i = floor(random(this.order.length));
    let j = floor(random(this.order.length));*/
    swap(this.order, i, j);
  }
  this.calcDistance = () => {
    let sum = 0;
    for (let i = 0; i < this.order.length - 1; i++) {
      let cityAIndex = this.order[i];
      let cityA = config.cities[cityAIndex];
      let cityBIndex = this.order[i + 1];
      let cityB = config.cities[cityBIndex];
      let d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
      sum += d;
    }
    this.dist = sum;
    return this.dist;
  }

  this.mapFitness = (minD, maxD) => {
    this.fitness = map(this.dist, minD, maxD, 1, 0);
    return this.fitness;
  }
  this.normalizeFitness = (total) => {
    this.fitness /= total;
  }

  this.show = function () {

    stroke("#00f");
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < this.order.length; i++) {
      let n = this.order[i];
      vertex(config.cities[n].x, config.cities[n].y);
    }
    endShape();

    fill(255);
    for (let i = 0; i < this.order.length; i++) {
      let n = this.order[i];
      fill(0, 0, 0);
      ellipse(config.cities[n].x, config.cities[n].y, 10, 10);
      text(String.fromCharCode(this.order[i] + 97), config.cities[n].x + 10, config.cities[n].y);
    }
  }

  this.crossover = function (other) {

    let order1 = this.order;
    let order2 = other.order;

    let start = floor(random(order1.length));
    let end = floor(random(start + 1, order1.length + 1));

    /*if (start = 0) {
      start++;
    }

    if (end == this.order.length - 1) {
      end--;
    }*/
    let neworder = order1.slice(start, end);

    let leftover = order1.length - neworder.length;

    let count = 0;
    let i = 0;
    while (count < leftover) {
      let city = order2[i];
      if (!neworder.includes(city)) {
        neworder.push(city);
        count++;
      }
      i++;
    }

    if (neworder[0] != order1[0]) {
      var tmp = neworder[0];
      var indexnya = neworder.indexOf(order1[0])
      neworder[0] = order1[0];
      neworder[indexnya] = tmp;

    }
    return neworder;
  }

  this.init();
}


