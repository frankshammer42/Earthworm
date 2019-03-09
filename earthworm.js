class Earthworm {
  constructor(x, y, ms, mf) {
      this.position = createVector(x, y);
      this.velocity = createVector(random(-1, 1), random(-1, 1));
      this.acceleration = createVector(0, 0);
      this.r = 12;

      //Seek Max Speed
      this.seek_maxspeed = ms || 1;
      this.seek_maxforce = mf || 0.4;
      //Separation Max Speed
      this.sep_maxspeed = ms || 0.42;
      this.sep_maxforce = mf || 0.4;


      //Temporary Control Parameters
      this.desired_separation = 30;

  }

  applyBehaviors(earthworms) {
      let seperateForce = this.separate(earthworms);
      let seekForce = this.seek(earthworms);
      // seperateForce.mult(slider1.value());
      // seekForce.mult(slider2.value());
      this.applyForce(seekForce);
      this.applyForce(seperateForce);
      // this.cluster(earthworms);
  }


  applyForce(force){
    this.acceleration.add(force);
  }
  //add separate force to objects
  separate(earthworms){
    let sum = createVector();
    let count = 0;
    for (let i = 0; i < earthworms.length; i++) {
        let earth_worm = earthworms[i].userData;
      let d = p5.Vector.dist(this.position, earth_worm.position);
      if (d > 0 && d < this.desired_separation) {
        let diff = p5.Vector.sub(this.position, earth_worm.position);
        diff.normalize();
        diff.div(d);
        sum.add(diff); //sum the forces
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.sep_maxspeed);
      sum.sub(this.velocity);
      sum.limit(this.sep_maxspeed);
    }
    return sum;
  }

  //TODO: compare changes to find shortest
  seek(earthworms) {
    let target;
    let desiredattraction = 100;
    for (let i = 0; i < earthworms.length; i++) {
        let earth_worm = earthworms[i].userData;
      let d = p5.Vector.dist(this.position, earth_worm.position);
      if (d > 0 && d < desiredattraction) {
        target = earth_worm.position;
        let desired = p5.Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.seek_maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.seek_maxforce);
        return steer;
      }
    }
  }

  cluster(earthworms) {
    let staydistance = 5;
    for (let i = 0; i < earthworms.length; i++) {
        earthworms[i] = earthworms[i].userData;
      let d = p5.Vector.dist(this.position, earthworms[i].position);
      if (d > 0 && d < staydistance) {
        this.velocity = earthworms[i].velocity;
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
