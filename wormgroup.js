class Wormgroup {
    constructor (worm_1, worm_2){
        this.position = p5.Vector.add(worm_1.position, worm_2.position).div(2);
        this.r = 30;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.worms = [worm_1, worm_2];
        this.color = createVector(random(255), random(255), random(255));
        this.alpha = 50;
    }

    init(){
        for (let worm of this.worms){
            worm.velocity = createVector(0, 0);
            worm.acceleration = createVector(0, 0);
        }
    }

    display(){
        for (let worm of this.worms){
            worm.display();
        }
        fill(this.color,x, this.color.y, this.color.z, this.alpha);
        stroke(200);
        strokeWeight(1);
        push();
        translate(this.position.x, this.position.y);
        ellipse(0, 0, this.r, this.r);
        pop();
    }
}