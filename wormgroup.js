class Wormgroup {
  constructor(worm_0, worm_1) {
    this.position = p5.Vector.add(worm_0.position, worm_1.position).div(2);
    this.r = 50;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.worms = [worm_0, worm_1];
    this.relative_distances = [];
    this.color = createVector(random(255), random(255), random(255));
    this.alpha = 50;
    this.earthworm_group_maxSpeed = 3;
    this.earthworm_group_maxForce = 0.1;
  }

  reset_worms_info() {
      this.relative_distances = []; //clear
    for (let worm of this.worms) {
      worm.velocity = createVector(0, 0);
      worm.acceleration = createVector(0, 0);
      this.relative_distances.push(p5.Vector.sub(this.position, worm.position));
      // worm.position = this.position;
    }
  }

  applyBehaviors(earthworms_groups) {
    let earthworms_group_seekForce = this.seek_group(earthworms_groups);
    this.applyForce(earthworms_group_seekForce);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  seek_group(earthworms_groups) {
    let target;
    for (let i = 0; i < earthworms_groups.length; i++) {
      let earth_worm_group = earthworms_groups[i].userData;
      let d = p5.Vector.dist(this.position, earth_worm_group.position);
      if (d > 0) {
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
      this.velocity.limit(this.earthworm_group_maxSpeed);
      for (let i=0; i<this.worms.length; i++){
          this.worms[i].position = p5.Vector.add(this.relative_distances[i], this.position);
      }
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

    borders() {
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
    }

    swallow(other_group){
      for (let worm of other_group.worms){
          this.worms.push(worm);
      }
      this.reset_worms_info();
    }


}
