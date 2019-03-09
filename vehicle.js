class Vehicle {
  constructor(x, y, ms, mf) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.r = 12;
    this.maxspeed = ms || 4;
    this.maxforce = mf || 0.3;
  }

  applyBehviors(vehicles) {
    let seperateForce = this.seperate(vehicles);
    let seekForce = this.seek(vehicles);

    // seperateForce.mult(slider1.value());
    // seekForce.mult(slider2.value());

    this.applyForce(seperateForce);
    this.applyForce(seekForce);
    this.stay(vehicles);
  }
  applyForce(force) {
    this.acceleration.add(force);
  }
  //add seperate force to objects
  seperate(vehicles) {
    let desiredseperation = slider3.value;
    let sum = createVector();
    let count = 0;
    for (let i = 0; i < vehicles.length; i++) {
      let d = p5.Vector.dist(this.position, vehicles[i].position);
      if (d > 0 && d < desiredseperation) {
        let diff = p5.Vector.sub(this.position, vehicles[i].position);
        diff.normalize();
        diff.div(d);
        sum.add(div); //sum the forces
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      sum.sub(this.velocity);
      sum.limit(this.maxspeed);
    }
    return sum;
  }
  seek(vehicles) {
    let target;
    let desiredattraction = 20;
    for (let i = 0; i < vehicles.length; i++) {
      let d = p5.Vector.dist(this.position, vehicles[i].position);
      if (d > 0 && d < desiredattraction) {
        target = vehicles[i].position;
        let desired = p5.Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        return steer;
      }
    }
  }

  stay(vehicles) {
    let staydistance = 5;
    for (let i = 0; i < vehicles.length; i++) {
      let d = p5.Vector.dist(this.position, vehicles[i].position);
      if (d > 0 && d < staydistance) {
        this.velocity = vehicles[i].velocity;
      }
    }
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.acceleration.mult(0);
  }

  display() {
    fill(255);
    stroke(200);
    strokeWeight(2);
    push();
    translate(this.position.x, this.position.y);
    ellipse(0, 0, this.r, this.r);
    pop();
  }
  borders() {
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
  }
}
