import { 
    edges_to_adj,
    transform_for_vizualization, 
    visualizeStaticGraph, 
    generate_valid_graph,
    generateSrcInput, 
    errorPage, 
    NODE_MAP, 
    LIGHT_BLUE,YELLOW, NATURAL, 
    INCEREMENT,
    graphGenerator,
    getRandomElement
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



// marks the visited nodes
function markEdge(a, b, color = 'yellow') {
    svg.selectAll('line')  
        .filter(function(d) {
            
            const sourceNode = graph.nodes.find(node => node.id === d.source);
            const targetNode = graph.nodes.find(node => node.id === d.target);
            const linkId = `${sourceNode.id}${targetNode.id}`;
            return linkId === `${a}${b}`;
        })
        .attr('stroke', color)
        .attr('stroke-width', 8);
}

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
        setTimeout(resolve, 1000);  
    });
}


function randomRGBColor() {
    const r = Math.floor(Math.random() * 256); // Random red value (0-255)
    const g = Math.floor(Math.random() * 256); // Random green value (0-255)
    const b = Math.floor(Math.random() * 256); // Random blue value (0-255)
    return `rgb(${r}, ${g}, ${b})`;
}


function unionFind(edges, n){

    function findParnet(a, parents){
      if(parents[a] == a)
        return a;
      else
        return findParnet(parents[a],parents)
    }
  

    async function union(a, b, parents, colors){
        var great_parent = parents[a];
        var temp = parents[b];
        markNode(great_parent, colors[great_parent])
        // markEdge(a, b, colors[great_parent])

        for(var i=0; i<parents.length; i++){
            if(parents[i]==temp){
              parents[i] = great_parent
              markNode(i, colors[great_parent])
            }
        }
    }
  
    async function runner(){
        var parents = new Array(n);
        var colors = new Array(n);
        for(var i=0; i<n; i++){
          parents[i] = i;
          colors[i] = randomRGBColor()
          markNode(i, colors[i])
        }
    
        for(var edge of edges){
            await waitForTimeout()
            var cycle_detected = false
            if(parents[edge[0]]==parents[edge[1]])
                cycle_detected = true
                
        
            union(edge[0], edge[1], parents, colors)
            update.innerHTML+=`(${edge[0]}, ${edge[1]}) - ${parents}<br>`
            if(cycle_detected)
                update.innerHTML+="CYCLE!!!<br>"
           
        }
        process_goes = false;

    }
    runner()
}




function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
        update.innerHTML = ""
        unionFind(edges,n);
    
   }
}





function changeGraph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
        update.innerHTML = ""
        generateGraph();
        vizualize();
    }
}




function vizualize(){
    try {
        graph = transform_for_vizualization(edges, nodes);
        visualizeStaticGraph(graph, svg);
    } catch (error) {
        errorPage()
    }
}



function generateGraph(){
    graph = generate_valid_graph();

    function disconnect(links){
        var remove = [0,0,1,1,1,2,3,3,4,4,4,4]

        var remove_amount= getRandomElement(remove)
        links = shuffle(links)


        return links.splice(0, edges.length-remove_amount);
    }
    // disconnect()
    [n,  edges, nodes] = graph

    edges = disconnect(edges)
}






generateGraph()
vizualize()
document.getElementById("start").addEventListener("click", startCycleDectection);
document.getElementById("refresh").addEventListener("click", changeGraph);

