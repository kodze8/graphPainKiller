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


const svg = d3.select("svg")
let n, edges, nodes; 
var graph;

var src_selector = document.getElementById('src');

const update = document.getElementById("visited")

const temp = document.getElementById('temp')

// marks the visited nodes
function markNode(val, color = YELLOW) {
    svg.selectAll('circle')
         .filter(d => d.id === val)
         .attr('stroke', color)
         .attr('stroke-width', 8);
}


function waitForTimeout(){
   return new Promise(resolve =>{
        setTimeout(resolve, -(temp.value - temp.max));
   });
}


function bfs(edges, src, n, callback){
    var adj = edges_to_adj(n, edges)
    var seen = new Set()

    var queue = [src]
    seen.add(src)
    var path = []

    async function helper(){
        while(queue.length!=0){
            var cur = queue.shift()
            update.innerHTML +=` ${NODE_MAP.get(cur)}`;
            markNode(cur);  
            path.push(cur)
            for (var k of adj.get(cur)){
                if(!seen.has(k)){
                    queue.push(k)
                    seen.add(k)
                }
            }
            await waitForTimeout()
        }
        callback();
    }

    helper();
}



// function for start bfs. 
var process_goes = false;
function startBFS(){
   if(!process_goes){
       process_goes = true;

       svg.selectAll("circle")
        .data(graph.nodes)
        .attr("fill", NATURAL)
        .attr('stroke', 'none')
        update.innerHTML = 'BFS path: ';

       var src = parseInt(src_selector.value, 10);  
       bfs(edges, src, n, ()=>{
           process_goes = false; 
       });
   }
}

function changeGraph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
        update.innerHTML = 'BFS path: ';
        src_selector.innerHTML = "";
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



vizualize();
document.getElementById("start").addEventListener("click", startBFS);
document.getElementById("refresh").addEventListener("click", changeGraph);
