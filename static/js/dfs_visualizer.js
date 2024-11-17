import { 
    edges_to_adj, 
    transform_for_vizualization, 
    visualizeStaticGraph, 
    generate_valid_graph,
    generateSrcInput, 
    errorPage, 
    NODE_MAP, 
    LIGHT_BLUE,
    YELLOW, 
    NATURAL, 
    INCEREMENT, 
} from './general/graphUtils.js';

import {addRow, clearStack, removeRow} from "./general/stack_tracker.js"

const svg = d3.select("svg")
let n, edges, nodes; 
var graph;

var src_selector = document.getElementById('src');


// marks the visited nodes
function markNode(val, color = YELLOW) {
   svg.selectAll('circle')
        .filter(d => d.id === val)
        .attr('stroke', color)
        .attr('stroke-width', 8);
}

// dfs algorithm 
function dfs(edges, src, n, callback){
   var adj = edges_to_adj(n, edges)
   let delay = 0;

   function rec(start, seen, path){
       path.push(start)

       setTimeout(() => {
            addRow(NODE_MAP.get(start))
            markNode(start);
        }, delay);

       delay += INCEREMENT; 

       seen.add(start)
       for(var neigbour of adj.get(start)){
           if(!seen.has(neigbour)){
               rec(neigbour, seen, path)
           }
       }
       return path
   }
   var res = rec(src, new Set(), [])

   setTimeout(() => {callback();}, delay);

   return res
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