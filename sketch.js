let earthworms = [];
let total_number = 50;
let effective_radius = 200;



function setup() {
    // createCanvas(width, height);
    createCanvas(window.innerWidth, window.innerHeight);
    for (let i = 0; i < total_number; i++) {
      earthworms.push(new Earthworm(random(width), random(height)));
    }
}
function draw() {
    let boundary = new Rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight);
    let qtree = new QuadTree(boundary, total_number);
    background(51);

    for (let worm of earthworms) {
        let point = new Point(worm.position.x, worm.position.y, worm);
        qtree.insert(point);
    }

    for (let worm of earthworms) {
        let range = new Circle(worm.position.x, worm.position.y, effective_radius);
        // let surrounding_worms = qtree.query(range);
        let closest = qtree.closest(new Point(worm.position.x, worm.position.y), 2, effective_radius);
        worm.applyBehaviors(closest);
        worm.update();
        worm.display();
        worm.borders();
    }





    let fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);


}
