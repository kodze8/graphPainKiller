import { 
    edges_to_adj, 
    transform_for_vizualization, 
    visualizeStaticGraph, 
    generate_valid_graph,
    generateSrcInput, 
    errorPage, 
    NODE_MAP, 
    YELLOW, 
    NATURAL, 
} from './general/graphUtils.js';

import {
    addRow, 
    clearStack, 
    removeRow
} from "./general/stack_tracker.js"

const svg = d3.select("svg")
let n, edges, nodes; 
var graph;

var src_selector = document.getElementById('src');
var tempInput = document.getElementById('temp');


// marks the visited nodes
function markNode(val, color = YELLOW) {
   svg.selectAll('circle')
        .filter(d => d.id === val)
        .attr('stroke', color)
        .attr('stroke-width', 8);
}

// dfs algorithm 
function waitForTimeout() {
    return new Promise(resolve => {
        setTimeout(resolve, -(tempInput.value-tempInput.max)); 
    });
}
function dfs(edges, src, n, callback){
    var adj = edges_to_adj(n, edges)

    async function rec(start, seen, path){
        path.push(start)
 
        await waitForTimeout()
        addRow(NODE_MAP.get(start))
        markNode(start);

        seen.add(start)
        for(var neigbour of adj.get(start)){
            if(!seen.has(neigbour)){
                await rec(neigbour, seen, path)
            }
        }
        return path
    }
    (async () => {
        await rec(src, new Set(), []);
        callback(); 
    })();
 }


// function for start dfs. 
var process_goes = false;
function startDFS(){
   if(!process_goes){
       process_goes = true;
       svg.selectAll("circle")
            .data(graph.nodes)
            .attr("fill", NATURAL)
            .attr('stroke', 'none')

        clearStack();

       var src = parseInt(src_selector.value, 10);  
       dfs(edges, src, n, ()=>{
           process_goes = false; 
       });
   }
}

function changeGraph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
        src_selector.innerHTML = "";
        clearStack();
        vizualize();
    }
}



function vizualize(){
    try {
        graph = generate_valid_graph();
        [n, edges, nodes] = graph
        graph = transform_for_vizualization(edges, nodes);
        visualizeStaticGraph(graph, svg);
        generateSrcInput(src_selector, n);
    } catch (error) {
        errorPage()
    }
}

vizualize()
document.getElementById("start").addEventListener("click", startDFS);
document.getElementById("refresh").addEventListener("click", changeGraph);