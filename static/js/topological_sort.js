import { 
    transform_for_vizualization, 
    generate_valid_graph,
    errorPage, 
    NATURAL,
    LIGHT_BLUE,
    YELLOW,
} from './general/graphUtils.js';


import { 
    edgesToAdjDirected,
    setDirection,
    vizualizeDirectedNumericGraph
} from './general/directedGraphUtils.js';

import {
    addRow, 
    clearStack, 
    removeRow
} from "./general/stack_tracker.js"

const svg = d3.select("svg")
let n, edges, nodes; 
var graph;

var update = document.getElementById('update')

// CONTINEU FROM HERE 
var temp = document.getElementById('temp')

var visited_stack = document.getElementById('visited')
var sorted_stack = document.getElementById('sorted')


function waitForTimeout(){
    return new Promise(resolve =>{setTimeout(resolve, -(temp.value-temp.max))} )
}


function markNode(val, color = YELLOW) {
    svg.selectAll('circle')
         .filter(d => d.id === val)
         .attr('stroke', color)
         .attr('stroke-width', 8);
 }

function topologicalSort(edges, n, callback){
 
    var adj = edgesToAdjDirected(n, edges);
  

    var visited = new Set();
    var sorted = []
    
    async function rec(v){
        
        visited.add(v);
        addRow(v, visited_stack);
        markNode(v, LIGHT_BLUE)


        var cycle = false

        await waitForTimeout();

        for(var nei of adj.get(v)){
          
            if(visited.has(nei)){
                return true;
            }
            else if (sorted.includes(nei)){
                continue;
            }
            else{

                cycle = cycle || await rec(nei);
            }
        }
        await waitForTimeout();
        sorted.push(v);
        addRow(v, sorted_stack);

        markNode(v)
        visited.delete(v)
        return cycle;

    }

    (async () => {
        var cycle = false

        for( var v=0; v<n; v++){
            if(!sorted.includes(v)){
                cycle =  await rec(v)
                if(cycle){
                    break;
                }
            }
        }
        if(cycle){
            update.innerHTML = `Cycle Detected, topological sorting not possible! `
        }else{
             update.innerHTML = `Topological Sort: ${sorted.reverse().join(', ')} `
        }
        callback();
        
    })();   
}

var process_goes = false;
function startTopologicalSort(){
    if(!process_goes){
        process_goes = true;
        svg.selectAll("circle")
            .data(graph.nodes)
            .attr("fill", NATURAL)
            .attr('stroke', 'none')

        clearStack(visited_stack) 
        clearStack(sorted_stack)

        update.innerHTML = ""
        topologicalSort(edges, n, () => {process_goes = false});
    }

}



function changeGraph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
        update.innerHTML = ""

        clearStack(visited_stack) 
        clearStack(sorted_stack)

        vizualize();
    }
}

function vizualize(){
    try {
        graph = generate_valid_graph();
        [n, edges, nodes] = graph
        edges = setDirection(edges)
        graph = transform_for_vizualization(edges, nodes);
        vizualizeDirectedNumericGraph(graph, svg);
    } catch (error) {
        errorPage()
    }
}



vizualize();
document.getElementById("start").addEventListener("click", startTopologicalSort);
document.getElementById("refresh").addEventListener("click", changeGraph);
