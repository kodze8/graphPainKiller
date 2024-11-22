import { 
    generate_valid_weighted_graph,  
    transform_for_vizualization, 
    visualizeStaticGraph_2, 
    get_weights
} from './general/weightedGraphUtils.js';

import { 
    edges_to_adj,
    errorPage,
    generateDstInput,
    generateSrcInput,
    NODE_MAP, 
    LIGHT_BLUE,
    YELLOW, 
    NATURAL, 
    INCEREMENT
} from './general/graphUtils.js';



const svg = d3.select("svg")
const update = document.getElementById("visited")
const msg = document.getElementById("msg")
let n, edges, nodes; 
var graph;

const src_selector = document.getElementById('src');
const dst_selector = document.getElementById('dst');

var process_goes = false;
var temp =  document.getElementById('temp')

function markNode(val, color) {
    svg.selectAll('circle')
        .filter(d => d.id === val)
        .attr('stroke', color)
        .attr('stroke-width', 8);
}


function waitForTimeout(){
    return new Promise(resolve => {
        setTimeout(resolve, -(temp.value-temp.max)); 
    });
}

function dijkstra(edges, n, src, dst, callback){
    var adj = edges_to_adj(n, edges)
    var distances_between  = get_weights(edges, n)

    var distances = new Array(n).fill(Infinity);
    distances[src] = 0;
   
    var seen = new Set();
    var shortestPath = []    

    var previous_neighbours = new Map();
    previous_neighbours.set(src, [])

    async function rec(){
        if(seen.size==n){
            let last = shortestPath[shortestPath.length-1]
            previous_neighbours.get(last).push(last)
            msg.innerHTML = previous_neighbours.get(last)
            .map(element => NODE_MAP.get(element))
            .join(", "); 
            return
        }

        let minDistance = Infinity;
        let minNode = null;

        for(var key=0; key<distances.length; key++){           
            if (distances[key] <= minDistance && !seen.has(key)) {
                minDistance = distances[key];
                minNode = key; 
            }
        }
        shortestPath.push(minNode)
        seen.add(minNode)

        updateTable(distances)
        markNode(minNode,YELLOW);  
        update.innerHTML += `${NODE_MAP.get(minNode)}: ${minDistance} `;

        // idk is it nice idea
        if(minNode===dst){
            previous_neighbours.get(dst).push(dst)
            msg.innerHTML = previous_neighbours.get(dst)
            .map(element => NODE_MAP.get(element))
            return
        }

        for (const neighbour of adj.get(minNode)) {
            if (!seen.has(neighbour)) {
                markNode(neighbour, LIGHT_BLUE);  
                if(distances[neighbour]>minDistance+distances_between[minNode][neighbour]){
                    if (previous_neighbours.has(minNode)) {
                        let updatedArray = previous_neighbours.get(minNode).slice(); 
                        updatedArray.push(minNode);
            
                        previous_neighbours.set(neighbour, updatedArray);
                    }else{
                    
                        previous_neighbours.set(neighbour,[minNode])
                    }

                    distances[neighbour] = minDistance+distances_between[minNode][neighbour]
                }
            }
        }
        await waitForTimeout();
        await rec()
    }
    (async  () => {
        await rec();
        callback();
    })();
    
}


function startDijkstra(){
    if(!process_goes){
        process_goes = true;
        svg.selectAll("circle")
            .data(graph.nodes)
            .attr("fill", NATURAL)
            .attr('stroke', 'none')
        update.innerHTML = '';
        msg.innerHTML = '';
        
        clearTable()
        createTableHeaders(n)
        
        var src = parseInt(src_selector.value, 10);  
        var dst = parseInt(dst_selector.value, 10);      

        dijkstra(edges, n,src,dst, ()=>{
            process_goes = false; 
        });
    }
}


// Function to create table headers
function createTableHeaders(n) {
    var lst = []
    for( var i=0; i<n; i++){
        lst.push(NODE_MAP.get(i))
    }
    const headers = lst;

    const headerRow = document.querySelector('#data-table thead tr');

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.color = LIGHT_BLUE;
        headerRow.appendChild(th);
    });
}

function updateTable(distances){
    const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    for(var i=0; i<distances.length; i++){
        var cell = newRow.insertCell(i);
        
        cell.textContent = distances[i] === Infinity ? '∞' : distances[i]; 


        if (distances[i] === Infinity) {
            cell.style.color = NATURAL; 
        } else {
            cell.style.color = YELLOW; 
        }
    }
}
function clearTable() {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const headerRow = document.querySelector('#data-table thead tr');

    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }

    while (headerRow.cells.length > 0) {
        headerRow.deleteCell(0);
    }
}



function vizualize(){
    try{
        graph = generate_valid_weighted_graph();
        [n, edges, nodes] = graph
        graph = transform_for_vizualization(edges, nodes);
        visualizeStaticGraph_2(graph, svg);
        createTableHeaders(n);  
        // generateInputButton();
        generateSrcInput(src_selector, n)
        generateDstInput(dst_selector, n );

    }catch {
        errorPage();
    }
}


function changeGraph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
        update.innerHTML = '';
        msg.innerText='';
        src_selector.innerHTML = "";
        dst_selector.innerHTML = "";
        clearTable()
        vizualize();
    }
} 



vizualize()
document.getElementById("refresh").addEventListener("click", changeGraph);
document.getElementById("start").addEventListener("click", startDijkstra);