import { 
    edges_to_adj,
    transform_for_vizualization, 
    visualizeStaticGraph, 
    generate_valid_graph,
    generateSrcInput, 
    errorPage, 
    NODE_MAP, 
    LIGHT_BLUE,YELLOW, NATURAL, 
    INCEREMENT
} from './general/graphUtils.js';

import { 
    edgesToAdjDirected,
    setDirection,
    visualizeStaticGraphDirected
} from './general/directedGraphUtils.js';




const svg = d3.select("svg")
let n, edges, nodes; 
var graph;

const update = document.getElementById("update")


var direction = document.getElementById('direction');
direction.addEventListener("change", changeDirection);
var DIRECTED = true




// marks the visited nodes
function markNode(val, color = YELLOW) {
   svg.selectAll('circle')
        .filter(d => d.id === val)
        .attr('stroke', color)
        .attr('stroke-width', 8);
}

function cyclePath(neighbour,path){
    var include = false
    for(var node of path){
        if(node == neighbour){
            include = true;
        }
        if(include){
            svg.selectAll('circle')
            .filter(d => d.id === node)
            .attr('fill', YELLOW)
            .attr('stroke-width', 8);
        }
    }
}


function waitForTimeout() {
    return new Promise(resolve => {
        setTimeout(resolve, INCEREMENT);  
    });
}


// --------- UNDIRECTED ---------
function detectCycle(edges, n, callback) {
    var adj = edges_to_adj(n, edges);

    // Make the recursive function async to use await
    async function rec(src, adj, path, prev) {
        path.push(src);
        markNode(src, LIGHT_BLUE)
        //update.innerHTML = `path: ${path}`;
        addRow(NODE_MAP.get(src))
        

        for (var neighbour of adj.get(src)) {
            if (path.includes(neighbour)) {               
                if (prev !== neighbour) {
                    await waitForTimeout();
                    cyclePath(neighbour, path)
                    return true;
                }
            } 
            else {
                await waitForTimeout();
                if (await rec(neighbour, adj, path, src)) { 
                    return true;
                }
                // emptify the whole path
                if (path.length > 0) {       
                    await waitForTimeout();
                    var removed = path.pop();
                    markNode(removed, null)
                    removeRow()
                }
            }
        }
        return false;
    }


    (async () => {
        const cycle_exists = await rec(0, adj, [], 0);
        update.innerHTML = `<br>finished with ${cycle_exists ? "cycle" : "no cycle"}`;
        callback();
    })();
}




// --------- UNDIRECTED ---------
function detectCycleDirected(edges, n, callback) {
    async function rec(adj, src, path, visited) {
        path.push(src);
        visited.add(src);
        markNode(src, LIGHT_BLUE);
        addRow(NODE_MAP.get(src))
        

        for (var nei of adj.get(src)) {
            if (path.includes(nei)) {
                await waitForTimeout();
                cyclePath(nei, path); 
                return true;
            } else if (!visited.has(nei)) {
                await waitForTimeout();
                if (await rec(adj, nei, path, visited)) { 
                    return true;
                }
            }
        }
        await waitForTimeout();
        path.pop();
        markNode(src, null);
        removeRow();
        return false; 
    }

    (async () => {
        var adj = edgesToAdjDirected(n, edges);
        var visited = new Set();

        for (var i = 0; i < n; i++) {
            if (!visited.has(i)) {
                if(i!=0)
                    await waitForTimeout();
                var cycle_exists = await rec(adj, i, [], visited);
                if (cycle_exists) {
                    update.innerHTML = `<br>finished with "cycle"`;
                    // update  add cycle 
                    callback();
                    return; 
                }
            }
        }
        update.innerHTML = `<br>finished with no cycle`;
        callback();
    })();
}










// function for start detecting cycle. 
var process_goes = false;
function startCycleDectection(){
   if(!process_goes){
       process_goes = true;
       svg.selectAll("circle")
            .data(graph.nodes)
            .attr("fill", NATURAL)
            .attr('stroke', 'none')

        clearStack()
        update.innerHTML = ""
        var dir  = parseInt(direction.value, 10); 

        if(dir==0){
            detectCycle(edges, n, ()=>{
                process_goes = false; 
            });

        } else{
            detectCycleDirected(edges, n, ()=>{
                process_goes = false; 
            });
           
        }
   }
}





function changeGraph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
        update.innerHTML = ""
        clearStack()
        generateGraph();
        vizualize();
    }
}
function changeDirection(){
    if(!process_goes){
        var dir  = parseInt(direction.value, 10); 
        if(dir==0){
            DIRECTED = false   
        }else{
            DIRECTED = true   
        }
        vizualize()
    }
}



function vizualize(){
    try {
        // UNDIRECTED
        if(!DIRECTED){
            graph = transform_for_vizualization(edges, nodes);
            visualizeStaticGraph(graph, svg);

        // DIRECTED    
        }else{
            edges = setDirection(edges)
            graph = transform_for_vizualization(edges, nodes);
            visualizeStaticGraphDirected(graph, svg);
        }
    } catch (error) {
        errorPage()
    }
}

function generateGraph(){
    graph = generate_valid_graph();
    [n, edges, nodes] = graph
}



generateGraph()
vizualize()
document.getElementById("start").addEventListener("click", startCycleDectection);
document.getElementById("refresh").addEventListener("click", changeGraph);

