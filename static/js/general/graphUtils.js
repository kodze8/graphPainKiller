// Graph DIMENSIONS
export const WIDTH = 500
export const HEIGHT = 300

export const LIGHT_BLUE = "#3972D5"
export const YELLOW = "#BAD80F"
export const NATURAL = "#EFF2CD"

export const INCEREMENT = 100;
export const NODE_MAP = new Map();


for (let i = 0; i < 10; i++) {
    const letter = String.fromCharCode(65 + i); 
    NODE_MAP.set(i, letter);
}


// transforms n, edges to adjacency Map. 
// Output: node -> neighbours
export function edges_to_adj(n, edges) {
    const adj = new Map();
    for (let i = 0; i < n; i++) {
        adj.set(i, []);
    }
    for (let edge of edges) {
        adj.get(edge[0]).push(edge[1]);
        adj.get(edge[1]).push(edge[0]);
    }
    return adj;
}

// shuffle array
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// returns random element from array
export function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}



// transforms n, edges to graph object
export function transform_for_vizualization(edges, nodes){
    const links =[]
    for (var edge of edges){
        links.push({ source: edge[0], target: edge[1] })
    } 
    return {nodes: nodes,links: links};
}


// Output :
// n, 
// nodes[]: {id: src, x: INITIAL_POSITION, y: INITIAL_POSITION}
// edges[] : [u, v] 

// NEVER USE IT !
export function graphGenerator() {
    const DIRECTIONS = [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1]];
    const DEGREES = [1,1,1,1,1,2,2,2];
    const MAX_X = WIDTH-50;
    const MAX_Y = HEIGHT-50;
    const MIN_Y = 0;
    const RADIUS = 100;  
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
                    // Check diagonal; 
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


// GENERATOR THAT GENERATES VALID GRAph
export function generate_valid_graph(){
    for (var i = 0; i < 1000; i++) {
        try {
            var [n, edges, nodes] = graphGenerator();
            return [n, edges, nodes]
         }catch (error) {
            continue; 
        }
    }
    return null;
}




// vizualizes graph
export function visualizeStaticGraph(graph, svg) {
   
    const width = +svg.attr("width"),
        height = +svg.attr("height"),
        nodeRadius = 20;
 
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#AE2626")
        .attr("rx", 20)  
        .attr("ry", 20);
 
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

        .attr("id", d => {
            const a = graph.nodes.find(node => node.id === d.source).id;
            const b = graph.nodes.find(node => node.id === d.target).id;
            return `${a}${b}`;
        });
 
    
    svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("id", d => d.id) 
        .attr("class", "node")
        .attr("r", nodeRadius)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", "#FDFFE9")
 
 
    svg.append("g")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => d.x )
        .attr("y", d => d.y+1)
        .attr("text-anchor", "middle") 
        .attr("dominant-baseline", "middle") 
        // .text(d => d.id);
        .text(d => NODE_MAP.get(d.id));
}

export function vizualizeNumericGraph(graph, svg){
    visualizeStaticGraph(graph, svg)
    svg.selectAll(".label")
    .text(d => d.id);
}

export function generateSrcInput(src_selector, n){
    // Default value for src is 0
    const defaultOption_src = new Option("Choose SRC", 0, true, true);
    defaultOption_src.hidden = true; 
    src_selector.appendChild(defaultOption_src);

    for (let i = 0; i < n; i++) {
        const option = new Option(NODE_MAP.get(i), i);
        if(i==0){
            src_selector.appendChild(new Option(NODE_MAP.get(i) +" (default)", i));
        }else{
            src_selector.appendChild(option.cloneNode(true));
        }
  
    }
}

export function generateDstInput(dst_selector, n){
    // Default value for dst is null
    const defaultOption = new Option("Choose DST", null, true, true);
    defaultOption.hidden = true; 
    dst_selector.appendChild(defaultOption);

    
    for (let i = 0; i < n; i++) {
        const option = new Option(NODE_MAP.get(i), i);
        if(i==0){ 
            dst_selector.appendChild(new Option("Furtherest (default)", null));
        }
        dst_selector.appendChild(option);
  
    }
}


export function errorPage(){
    document.body.innerHTML = ''; 
    const errorMessage = document.createElement('div');
    errorMessage.innerText = 'An error has occurred. Please try again later.';
    errorMessage.style.color = 'red';
    document.body.appendChild(errorMessage);
}