class Wormgroup {
  constructor(worm_0, worm_1) {
    this.position = p5.Vector.add(worm_0.position, worm_1.position).div(2);
    this.r = 30;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.worms = [worm_0, worm_1];
    this.color = createVector(random(255), random(255), random(255));
    this.alpha = 50;
    this.earthworm_group_maxSpeed = 3;
    this.earthworm_group_maxForce = 0.1;
    this.g2g_effective_radius = 200;
  }

  init() {
    for (let worm of this.worms) {
      worm.velocity = createVector(0, 0);
      worm.acceleration = createVector(0, 0);
    }
  }

  applyBehaviors(earthworms_groups) {
    let earthworms_group_seperateForce = this.separate(earthworms_groups);
    let earthworms_group_seekForce = this.seek(earthworms_groups);
    // seperateForce.mult(slider1.value());
    // seekForce.mult(slider2.value());
    this.applyForce(earthworms_group_seekForce);
    this.applyForce(earthworms_group_seperateForce);
    // this.cluster(ungrouped_earthworms);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  seek(earthworms_groups) {
    let target;
    for (let i = 0; i < earthworms_groups.length; i++) {
      let earth_worm_group = earthworms_groups[i].userData;
      let d = p5.Vector.dist(this.position, earth_worm_group.position);
      if (d > 0 && d < this.g2g_effective_radius) {
        target = earth_worm_group.position;
        let desired = p5.Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.earthworm_group_maxSpeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.earthworm_group_maxForce);
        return steer;
      }
    }
  }
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
    this.velocity.limit(this.maxSpeed);
  }
  display() {
    for (let worm of this.worms) {
      worm.display();
    }
    fill(this.color.x, this.color.y, this.color.z, this.alpha);
    stroke(200);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    ellipse(0, 0, this.r, this.r);
    pop();
  }
}
