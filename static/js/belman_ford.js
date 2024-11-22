import { 
    generate_valid_weighted_graph,  
    transform_for_vizualization, 
    get_weights
} from './general/weightedGraphUtils.js';

import { 
    setDirection,
    addNegativeValues,
    visualizeStaticGraphDirectedWeighted
} from './general/directedGraphUtils.js';

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
// const update = document.getElementById("visited")
const msg = document.getElementById("msg")
let n, edges, nodes; 
var graph;

const src_selector = document.getElementById('src');
const dst_selector = document.getElementById('dst');

const tempInput = document.getElementById('temp')

var process_goes = false;

function markNode(val, color = YELLOW) {
    svg.selectAll('circle')
        .filter(d => d.id === val)
        .attr('stroke', color)
        .attr('stroke-width', 8);
}


function waitForTimeout() {
    return new Promise(resolve => {
        setTimeout(resolve, -(tempInput.value-tempInput.max)); 
    });
}



// works well
function belmanFord(edges, n, src, dst, callback){
    
    async function helper(edges, n, src) {
        var distances = new Array(n).fill(Infinity);

        var previous_neighbours = new Map();
        previous_neighbours.set(src, [src]);

        distances[src] = 0;
        markNode(src);

        
        var negativeCycleDetected = false;

        for(var i =0; i<n; i++){
            var row =  addRow(distances, i)
            var cell = row.cells[src+1];  
            cell.textContent = 0;

            var changeHappened = false
            
           

            for(var e = 0; e<edges.length; e++){   


                changeEdgeCell(e)
                var cell = row.cells[edges[e][1]+1];  
           
                if(distances[edges[e][1]] > distances[edges[e][0]]+edges[e][2]){
                    markNode(edges[e][1])
                    distances[edges[e][1]] = distances[edges[e][0]]+edges[e][2]
                    changeHappened = true

                    // if(!previous_neighbours.has(edges[e][0])){
                    //     previous_neighbours.set(edges[e][0],[]);
                    // }
                    var temporary = Array.from(previous_neighbours.get(edges[e][0]));
                    temporary.push(edges[e][1]);
                    previous_neighbours.set(edges[e][1], temporary);
                    
                }
                await waitForTimeout()
                cell.textContent = distances[edges[e][1]] === Infinity ? '∞' : distances[edges[e][1]]; 
               
            }
            changeEdgeCell(null)

            for (var c = 0; c < row.cells.length; c++) {
                var empty_cell = row.cells[c];  
                if(empty_cell.textContent == ""){  
                    empty_cell.textContent = "∞";  
                }
            }
            await waitForTimeout()
            if(changeHappened && i==n-1){
                negativeCycleDetected = true;
            }
           
            if(!changeHappened)
                break        
        }


        // Paths 
        if(negativeCycleDetected){
            msg.innerHTML = "Negtaive Cycle Detected !"
        }else{
            const transformFn = (x) => NODE_MAP.get(x);
            function stringBuilder(map, transformFn) {
                var res = ""
                for (const [key, value] of map) {
                    res += `${NODE_MAP.get(key)} (${distances[key]}): `;
                    res += value.map(transformFn).join(", "); // Join the array into a string with commas
                    res += "<br>";
                    
                }
                return res;
            }
            const str = stringBuilder(previous_neighbours, transformFn);
            msg.innerHTML = str

        }        
    }    
    (async () => {
        await helper(edges, n, src);
        callback();
    })();
}



function changeEdgeCell(e = null){
    const edge_table = document.getElementById('edge-table').getElementsByTagName('tbody')[0];
    if(e==null){
        for (let i = 0; i < edge_table.rows.length; i++) {
            const edge_cell = edge_table.rows[i].cells[0];
            edge_cell.style.color = NATURAL;
        }
    }else{
        var edge_cell = edge_table.rows[e].cells[0]; 
        edge_cell.style.color = YELLOW;
    }

}


function startBelmanFord(){
    if(!process_goes){
        process_goes = true;
        svg.selectAll("circle")
            .data(graph.nodes)
            .attr("fill", NATURAL)
            .attr('stroke', 'none')
        msg.innerHTML = '';
        
        clearTable();
        createTableHeaders(n)
        
        var src = parseInt(src_selector.value, 10);  
        var dst = parseInt(dst_selector.value, 10);    

        belmanFord(edges, n, src, dst, ()=>{
            process_goes = false; 
        });
    }
}




function AddEdges(edges){
    const table = document.getElementById('edge-table').getElementsByTagName('tbody')[0];
    for(var e = 0; e<edges.length; e++){    
        var newRow = table.insertRow(); 
        var cell = newRow.insertCell(0); 
        cell.textContent = `(${NODE_MAP.get(edges[e][0])},${NODE_MAP.get(edges[e][1])})`; 
        cell.style.color = NATURAL; 
    }
}

// Function to create table headers
function createTableHeaders(n) {
    var lst = []
    lst.push("iter")
    for( var i=0; i<n; i++){
        lst.push(NODE_MAP.get(i))
    }
    const headers = lst;

    const headerRow = document.querySelector('#data-table thead tr');

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.color = NATURAL;
        headerRow.appendChild(th);
    });
}



function addRow(distances, iteration){
    const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    var cell = newRow.insertCell(0);
    cell.textContent = iteration;
    cell.style.color = LIGHT_BLUE; 

    for(var i=0; i<distances.length; i++){
        var cell = newRow.insertCell(i+1);
        cell.style.color = NATURAL; 
    }
    return newRow
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
function clearEdgeTable(){
    const tableBody = document.getElementById('edge-table').getElementsByTagName('tbody')[0];

    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }

}



function vizualize(){
    try{
        do {
            graph = generate_valid_weighted_graph();
            [n, edges, nodes] = graph
        } while (n>9);

      
        edges = setDirection(edges)
        edges = addNegativeValues(edges)
        graph = transform_for_vizualization(edges, nodes);
        visualizeStaticGraphDirectedWeighted(graph, svg);
        

        createTableHeaders(n);  
        AddEdges(edges);

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
        // update.innerHTML = '';
        msg.innerText='';
        src_selector.innerHTML = "";
        dst_selector.innerHTML = "";
        clearTable();
        clearEdgeTable();

        vizualize();
    }
} 



vizualize()
document.getElementById("refresh").addEventListener("click", changeGraph);
document.getElementById("start").addEventListener("click", startBelmanFord);



