var totalCities = config.totalCities;

var recordDistance = Infinity;
var population = [];
var popTotal = 100;


var iter = 0;

function updateRoute(pops){
  order = pops.order;
  var pointList = [];
  for (let i = 0; i < order.length; i++) {
    var to_add = new L.LatLng(coords[order[i]].long, coords[order[i]].lat);
    pointList.push(to_add);
  }
  firstpolyline.remove()
    firstpolyline = new L.Polyline(pointList, {
      color: 'blue',
      weight: 3,
      opacity: 1,
      smoothFactor: 1
    });
    window.config.KM.bestPath = (firstpolyline.getDistance());
    firstpolyline.addTo(mymap);
}

function updateTrialRoute(pops){
  order = pops.order;
  var pointList = [];
  for (let i = 0; i < order.length; i++) {
    var to_add = new L.LatLng(coords[order[i]].long, coords[order[i]].lat);
    pointList.push(to_add);
  }
  trial.remove();
  trial = new L.Polyline(pointList, {
    color: 'black',
    weight: 3,
    opacity: 0.3,
    smoothFactor: 1
  });
  trial.addTo(mymap);
}

function removeTrialRoute(){
  trial.remove();
}

function updateRouteWorst(pops){
  order = pops.order;
  var pointList = [];
  for (let i = 0; i < order.length; i++) {
    var to_add = new L.LatLng(coords[order[i]].long, coords[order[i]].lat);
    pointList.push(to_add);
  }
  secondPolyline.remove()
  secondPolyline = new L.Polyline(pointList, {
      color: 'red',
      weight: 3,
      opacity: 1,
      smoothFactor: 1
    });
    window.config.KM.worstPath = (secondPolyline.getDistance());
    secondPolyline.addTo(mymap);
}

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('canvas');
  addToLog('Generating ' + totalCities + " cities with random coordinate");
  for (var i = 0; i < totalCities; i++) {
    
    var v = createVector(coords[i].x, coords[i].y);
    config.cities[i] = v;
    addToLog("City #" + (i + 1) + " coordinate(x,y) = (" + v.x + "," + v.y + ")")
    //console.log("City #" + (i + 1) + " coordinate(x,y) = (" + v.x + "," + v.y + ")")
  }
  printCities();

  addToLog("Generating " + popTotal + " Population..");
  for (var i = 0; i < popTotal; i++) {
    population[i] = new DNA(totalCities);
    addToLog((i + 1) + ". " + population[i].order);
    //print(population[i].order);
  }
  addToLog("\n\n");


}

function draw() {
  background("#fff");
  addToLog("Itearation " + (config.iter + 1));
  var minDist = Infinity;
  var maxDist = 0;

  var bestNow;
  var sum = 0;
  for (var i = 0; i < population.length; i++) {
    var d = population[i].calcDistance();
    addToLog("Pop# " + (i + 1) + ": " + population[i].order + " d : " + d);
    updateTrialRoute(population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      config.bestPath = population[i];
      updateRoute(population[i]);
      
      
    }

    if (d < minDist) {
      minDist = d;
      bestNow = population[i];
    }
    if (config.worstPath === null) {
      config.worstPath = population[i];
      updateRouteWorst(population[i]);
    } else {
      if (config.worstPath.dist < population[i].dist) {
        config.worstPath = population[i];
        updateRouteWorst(population[i])
      }
    }
    if (d > maxDist) {
      maxDist = d;
    }
    sum += population[i].mapFitness(minDist, maxDist);
  }




  /*for (var i = 0; i < population.length; i++) {
    sum += population[i].mapFitness(minDist, maxDist);
  }*/

  for (var i = 0; i < population.length; i++) {
    population[i].normalizeFitness(sum);
  }



  var newPop = [];
  addToLog("Doing Crossover");
  for (var i = 0; i < population.length; i++) {

    var a = pickOne();
    var b = pickOne(a);
    a = population[a];
    b = population[b];
    var txt = ntoa(b.order);
    var order = a.crossover(b);
    newPop[i] = new DNA(totalCities, order);
    addToLog((i + 1) + ". " + ntoa(a.order) + " X " + txt + " = " + ntoa(newPop[i].order));
  }

  population = newPop;
  config.iter++;

  printIterationInfo();
  if (config.iter >= config.maxIter) {
    translate(0, 0);
    config.bestPath.show();
    translate(0, height / 2);
    line(0, 0, width, 0);
    config.bestPath.show();
    removeTrialRoute();
    noLoop();
  } else {
    bestNow.show();
    translate(0, height / 2);
    line(0, 0, width, 0);
    config.bestPath.show();
  }
}

function pickOne(ind = -1) {
  var index = 0;

  var r = random(1);

  while (r > 0) {
    if (index == ind) {
      index += 2;
      continue;
    }
    r -= population[index].fitness;
    index += 1;
  }

  index -= 1;

  return index;
}
/*function pickOne() {
  var index = 0;

  var r = random(1);

  while (r > 0) {
    r -= population[index].fitness;
    index += 1;
  }

  index -= 1;

  return population[index];
}*/
