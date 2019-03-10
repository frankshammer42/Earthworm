let ungrouped_earthworms = [];
let worm_groups = [];
let total_number = 100;
let w2w_effective_radius = 200; //For Ungrouped Worm
let worm_group_radius_threshold = 20; //If lower than this, group worms
let g2g_effective_radius = 200; // For Worm Group
//TODO: Create move effective way to filter out elements



function setup() {
    // createCanvas(width, height);
    createCanvas(window.innerWidth, window.innerHeight);
    for (let i = 0; i < total_number; i++) {
      ungrouped_earthworms.push(new Earthworm(random(width), random(height)));
    }
}

function draw() {
    let boundary = new Rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight);
    let worm_qtree = new QuadTree(boundary, total_number);
    let worm_group_qtree = new QuadTree(boundary, total_number);
    background(51);


    //Insert Ungrouped Worm to its own quadtree
    for (let worm of ungrouped_earthworms) {
        let point = new Point(worm.position.x, worm.position.y, worm);
        worm_qtree.insert(point);
    }

    //Insert worm group to its own quadtree
    for (let worm_group of worm_groups){
        let point = new Point(worm_group.position.x, worm_group.position.y, worm_group);
        worm_group_qtree.insert(point);
    }


    //Create Worm Group
    for (let worm of ungrouped_earthworms) {
        let closest = worm_qtree.closest(new Point(worm.position.x, worm.position.y), 2, worm_group_radius_threshold);
        //If we have closest neighbor in radius
        if (closest.length === 2){
            let worm_0_ref = closest[0].userData;
            let worm_0_clone = Object.assign( Object.create( Object.getPrototypeOf(worm_0_ref)), worm_0_ref);
            let worm_1_ref = closest[1].userData;
            let worm_1_clone = Object.assign( Object.create( Object.getPrototypeOf(worm_1_ref)), worm_1_ref);
            let distance = p5.Vector.sub(worm_0_ref.position, worm_1_ref.position).mag();
            if (distance < worm_group_radius_threshold){
                let worm_group = new Wormgroup(worm_0_clone, worm_1_clone);
                worm_group.init();
                worm_groups.push(worm_group);
                ungrouped_earthworms = wormArrayRemove(ungrouped_earthworms, worm_0_ref.position);
                ungrouped_earthworms = wormArrayRemove(ungrouped_earthworms, worm_1_ref.position);
            }
        }
    }

    for (let worm of ungrouped_earthworms) {
        let range = new Circle(worm.position.x, worm.position.y, w2w_effective_radius); // let surrounding_worms = qtree.query(range);
        let closest = worm_qtree.closest(new Point(worm.position.x, worm.position.y), 2, w2w_effective_radius);
        worm.applyBehaviors(closest);
        worm.update();
        worm.display();
        worm.borders();
    }

















    for (let worm_group of worm_groups){
        worm_group.display();
    }

    let fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);

}

//Utility Function
function wormArrayRemove(arr, position) {
    return arr.filter(function(ele){
        return ele.position != position;
    });
}














