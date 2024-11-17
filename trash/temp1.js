// Helper function tranforms edges to adj matrix
function edges_to_adj(n, edges){
     var adj = new Map();
     for(var i=0; i<n; i++){
         adj.set(i, [])
     }
     for(var edge of edges){
         adj.get(edge[0]).push(edge[1])
         adj.get(edge[1]).push(edge[0])
     }
     return adj
}

const svg = d3.select("svg")
const update = document.getElementById("visited")


const WIDTH = 500
const HEIGHT = 300

// shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// returns random element
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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





// transforms n, edges to graph object
function transform_for_vizualization(edges, nodes){
    const links =[]
    for (var edge of edges){
        links.push({ source: edge[0], target: edge[1] })
    } 
    return {nodes: nodes,links: links};
}


// vizualizes graph
function visualizeStaticGraph(graph) {
    
    const width = +svg.attr("width"),
        height = +svg.attr("height"),
        nodeRadius = 10;

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "green")

    svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => graph.nodes.find(node => node.id === d.source).x)
        .attr("y1", d => graph.nodes.find(node => node.id === d.source).y)
        .attr("x2", d => graph.nodes.find(node => node.id === d.target).x)
        .attr("y2", d => graph.nodes.find(node => node.id === d.target).y)
        .attr("stroke", "#999")
        .attr("stroke-width", 2);

    
    svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("id", d => d.id) 
        .attr("class", "node")
        .attr("r", nodeRadius)
        .attr("fill", "steelblue")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);


    svg.append("g")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => d.x-2.5 )
        .attr("y", d => d.y+2.5)
        .text(d => d.id);
}




// marks the visited nodes
function color_changer(current) {
    update.innerHTML +=`Visited node: ${current}<br>`;
        svg.selectAll('circle')
            .filter(d => d.id === current)
            .attr('fill', 'red');
}

// dfs algorithm that shows updates 
function dfs(edges, src, n, callback){
    var adj = edges_to_adj(n, edges)
    let delay = 0;

    function rec(start, seen, path){
        path.push(start)

        setTimeout(() => {color_changer(start);}, delay);
        delay += 1000; 

        seen.add(start)
        for(var neigbour of adj.get(start)){
            if(!seen.has(neigbour)){
                rec(neigbour, seen, path)
            }
        }
        return path
    }
    var res = rec(src, new Set(), [])

    setTimeout(() => {
        update.innerHTML +=`DFS path: ${res}<br>`;
        update.innerHTML +=`DFS path: ${edges}<br>`;
        callback();
    }, delay);

    return res
}


// function for start dfs. 
var process_goes = false;
function start_dfs(){
    if(!process_goes){
        process_goes = true;

        svg.selectAll("circle")
            .data(graph.nodes)
            .attr("fill", "steelblue")
        update.innerHTML =``;

        dfs(edges, 0, n, ()=>{
            process_goes = false; 
        });
    }
}


function generate_valid_graph(){
    for (var i = 0; i < 100000; i++) {
        try {
            var [n, edges, nodes] = graphGenerator();
            return [n, edges, nodes]
        } catch (error) {
            continue; 
        }
    }
    console.warn("Failed to generate a valid graph after 100,000 attempts.");
    return null;
}


let n, edges, nodes; 
var graph;

function vizualize(){
    [n, edges, nodes] = generate_valid_graph();
    graph = transform_for_vizualization(edges, nodes);
    visualizeStaticGraph(graph);
}


function change_graph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
        update.innerHTML = '';
        vizualize();
    }
}

vizualize()


document.getElementById("start").addEventListener("click", start_dfs);
document.getElementById("refresh").addEventListener("click", change_graph);

