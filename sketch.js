let ungrouped_earthworms = [];
let worm_groups = [];
let total_number = 50;
let w2w_effective_radius = 200; //For Ungrouped Worm
let worm_group_radius_threshold = 20; //If lower than this, group worms
let g2g_effective_radius = 500; // For Worm Group -> what is the range group should check
let g2g_swallow_threshold = 30; // If below threshold, combine two groups together
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
                worm_group.reset_worms_info();
                worm_groups.push(worm_group);
                ungrouped_earthworms = arrayRemove(ungrouped_earthworms, worm_0_ref.position);
                ungrouped_earthworms = arrayRemove(ungrouped_earthworms, worm_1_ref.position);
            }
        }
    }

    for (let worm_group of worm_groups){
        //Go to the group that contains the most worms
        let range = new Circle(worm_group.position.x, worm_group.position.y, g2g_effective_radius);
        let in_radius_wormgroups_points = worm_group_qtree.query(range);
        //Make sure we have points
        if (in_radius_wormgroups_points.length > 1){
            //Sort to find the group that has the most points
            let size = in_radius_wormgroups_points.length;
            in_radius_wormgroups_points.sort(function (group_0, group_1) {
                let worm_group_0 = group_0.userData;
                let worm_group_1 = group_1.userData;
                return worm_group_0.worms.length - worm_group_1.worms.length;
            });
            let group_to_apply = in_radius_wormgroups_points[size-1];
            //Check if we should swallow the other group
            let current_worm_group_to_apply = group_to_apply.userData;
            let distance = p5.Vector.sub(current_worm_group_to_apply.position, worm_group.position).mag();
            if (distance < g2g_swallow_threshold && distance !== 0){
                worm_group.swallow(current_worm_group_to_apply);
                // worm_group.update();
                worm_group.borders();
                worm_groups = arrayRemove(worm_groups, current_worm_group_to_apply.position);
            }
            else{
                group_to_apply  = [group_to_apply]; //Need to pass in array
                worm_group.applyBehaviors(group_to_apply);
                worm_group.update();
                worm_group.borders();
            }
        }
    }

    for (let worm of ungrouped_earthworms) {
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
function arrayRemove(arr, position) {
    return arr.filter(function(ele){
        return ele.position != position;
    });
}














