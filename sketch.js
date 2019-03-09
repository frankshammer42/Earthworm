let slider1, slider2, slider3;
let vehicles = [];
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  slider1 = createSlider(0, 8, 4);
  slider2 = createSlider(0, 8, 4);
  slider3 = createSlider(0, 8, 4);
  for (let i = 0; i < 1000; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
}
function draw() {
  background(51);
  for (let v of vehicles) {
    v.applyBehviors(vehicles);
    v.update();
    v.display();
    v.borders();
  }
}
