function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() *arr.length)];
}

function update_RESTRICETD(restricted_positions, x, y){
    if (!restricted_positions.has(x))
        restricted_positions.set(x, new Set([y]))
    else{
        let updated = restricted_positions.get(x).add(y)
        restricted_positions.set(x, updated)
    }
    return restricted_positions

}



// function graphGenerator() {
//     const DIRECTIONS  = [[0,1], [0,-1], [1,0], [1,1], [1, -1]]
//     const DEGREES = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2];
//     MAX_X = 600;
//     MAX_Y = 400;
//     MIN_Y = 0;


//     const RADIOUS = 70;
//     shuffleArray(DEGREES);

//     const INITIAL_POSITION = 50

//     // const n_vertices = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
//     const n_vertices =10;
//     var nodes = []

//     let vertices = new Set();
//     for (let i = 0; i < n_vertices; i++) {
//         vertices.add(i);
//     }

//     let edges = [];
//     const src = getRandomElement(Array.from(vertices));
//     let seen = new Set([src]);
//     nodes.push({id:src, x:INITIAL_POSITION, y:INITIAL_POSITION})


//     var restricted_positions = new Map();
//     restricted_positions.set(INITIAL_POSITION, new Set([INITIAL_POSITION]))


//     while (vertices.size > 0) {

        
//         const v = getRandomElement(Array.from(seen));
//         vertices.delete(v);
//         seen.delete(v);

//         const degree = Math.min(vertices.size, getRandomElement(DEGREES));

//         for (let i = 0; i < degree; i++) {
//             do {
//                 var neighbor = getRandomElement(Array.from(vertices));
//             } while (edges.includes([v, neighbor]) || edges.includes([neighbor, v]));
    

//             edges.push([v, neighbor]);
//             if (!seen.has(neighbor)){
//                 // console.log("neighbbor not in seen")
//                 var v_node = nodes.filter(n => n.id === v)[0];


//                 let iterationLimit = 1000;
//                 let attemptCount = 0;
//                 do {
//                     if (attemptCount >= iterationLimit) {
//                         throw new Error("Exceeded maximum iterations trying to find a valid position.");
//                     }
//                     var direction = getRandomElement(Array.from(DIRECTIONS))
//                     var x = v_node.x+RADIOUS*direction[0]
//                     var y = v_node.y+RADIOUS*direction[1]
//                     attemptCount++;
                    
//                 } while ((restricted_positions.has(x) && restricted_positions.get(x).has(y))
//                 || x>MAX_X || y>MAX_Y || y<MIN_Y);

//                 restricted_positions = update_RESTRICETD(restricted_positions, x, y)

//                 seen.add(neighbor);
//                 nodes.push({id:neighbor, x:x, y: y})
//             }
        

            
//         }
//     }
//     return [n_vertices, edges, nodes];
// }


function graphGenerator() {
    const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1]];
    const DEGREES = [1,1,1,1,1,2,2,2];
    const MAX_X = WIDTH;
    const MAX_Y = HEIGHT;
    const MIN_Y = 0;
    const RADIUS = 70;  
    const INITIAL_POSITION = 50;
    
    shuffleArray(DEGREES);  

    const n_vertices = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
    const nodes = [];
    const vertices = new Set(Array.from({length: n_vertices}, (_, i) => i)); 
    const edges = [];
    const src = getRandomElement(Array.from(vertices));
    const seen = new Set([src]);
    nodes.push({id: src, x: INITIAL_POSITION, y: INITIAL_POSITION});
    
    const restricted_positions = new Map([[INITIAL_POSITION, new Set([INITIAL_POSITION])]]);

    while (vertices.size > 0) {
        const v = getRandomElement(Array.from(seen));
        vertices.delete(v);
        seen.delete(v);

        const degree = Math.min(vertices.size, getRandomElement(DEGREES));

        for (let i = 0; i < degree; i++) {
            let neighbor;

            let counter = 0;
            do {
                if(counter>100) throw new Error("Exceeded maximum iterations trying to find a valid position.");
                counter++;

                neighbor = getRandomElement(Array.from(vertices));
                var do_not_add = false;
            
                if (seen.has(neighbor)) {
                    const v_node = nodes.find(n => n.id === v); 
                    const nei = nodes.find(n => n.id === neighbor); 
            
                    // Check horizontal 
                    if (v_node.x === nei.x) {
                        var min = Math.min(v_node.y, nei.y);
                        var max = Math.max(v_node.y, nei.y);
                        for (var r = min + RADIUS; r < max; r += RADIUS) {
                            if (restricted_positions.get(v_node.x).has(r)) {
                                do_not_add = true;
                                break;
                            }
                        }
                    }
            
                    // Check vertical 
                    else if (v_node.y === nei.y) {
                        var min = Math.min(v_node.x, nei.x);
                        var max = Math.max(v_node.x, nei.x);
                        for (var r = min + RADIUS; r < max; r += RADIUS) {
                            if (restricted_positions.has(r) && restricted_positions.get(r).has(v_node.y)) {
                                do_not_add = true;
                                break;
                            }
                        }
                    }
                    // Check diagona; 
                    else if ((v_node.y - nei.y) % RADIUS === 0 && (v_node.x - nei.x) % RADIUS === 0) {
                        var min_y = Math.min(v_node.y, nei.y);
                        var max_y = Math.max(v_node.y, nei.y);
                        var min_x = Math.min(v_node.x, nei.x);
                        var max_x = Math.max(v_node.x, nei.x);
            
                        let k = 1;
                        while (min_x + k * RADIUS < max_x && min_y + k * RADIUS < max_y) {
                            if (restricted_positions.has(min_x + k * RADIUS) && restricted_positions.get(min_x + k * RADIUS).has(min_y + k * RADIUS)) {
                                do_not_add = true;
                                break;
                            }
                            k++;
                        }
                    }
                }
            } while (edges.some(edge => 
                (edge[0] === v && edge[1] === neighbor) || 
                (edge[0] === neighbor && edge[1] === v) || 
                do_not_add
            ));
            
            edges.push([v, neighbor]);
            if (!seen.has(neighbor)) {
                const v_node = nodes.find(n => n.id === v); 
                
                let attemptCount = 0;
                let positionFound = false;
                let x, y;

                // Try to find a valid position for the neighbor
                while (attemptCount < 100) {
                    const direction = getRandomElement(DIRECTIONS);
                    x = v_node.x + RADIUS * direction[0];
                    y = v_node.y + RADIUS * direction[1];

                    // Check position validity
                    if (!(restricted_positions.has(x) && restricted_positions.get(x).has(y)) && x <= MAX_X && y <= MAX_Y && y >= MIN_Y) {
                        restricted_positions.set(x, (restricted_positions.get(x) || new Set()).add(y));
                        seen.add(neighbor);
                        nodes.push({ id: neighbor, x: x, y: y });
                        positionFound = true;
                        break; // Exit if valid
                    }
                    attemptCount++;
                }

                if (!positionFound) {
                    throw new Error("Exceeded maximum iterations trying to find a valid position.");
                }
            }
        }
    }

    return [n_vertices, edges, nodes];
}
const WIDTH = 500
const HEIGHT = 300




var general_succes = 0
for (var k = 0; k < 10000000; k++) {
    var success = 0
    for (var i = 0; i < 100000; i++) {
        try {
            success++;
            graphGenerator();
            break
        } catch (error) {
            continue; 
        }
    }
    if(success>10){
        general_succes++;
    }

}
console.log(general_succes)



