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

import { 
    clearEdgeTable, 
    createEdgeTable, 
    createTableHeaders, 
    addRow, 
    clearTable, 
    colorEdgeCell
} from './general/test.js';


const svg = d3.select("svg")
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

function belmanFord(edges, n, src, dst, callback){
    
    async function helper(edges, n, src) {
        var distances = new Array(n).fill(Infinity);

        var previous_neighbours = new Map();
        previous_neighbours.set(src, [src]);

        distances[src] = 0;
        markNode(src);

        
        var negativeCycleDetected = false;

        for(var i =0; i<n; i++){
            var row =  addRow(distances, i, document)
            var cell = row.cells[src+1];  
            cell.textContent = 0;

            var changeHappened = false
            
           

            for(var e = 0; e<edges.length; e++){   


                colorEdgeCell(document, e)
                var cell = row.cells[edges[e][1]+1];  
           
                if(distances[edges[e][1]] > distances[edges[e][0]]+edges[e][2]){
                    markNode(edges[e][1])
                    distances[edges[e][1]] = distances[edges[e][0]]+edges[e][2]
                    changeHappened = true

                    var temporary = Array.from(previous_neighbours.get(edges[e][0]));
                    temporary.push(edges[e][1]);
                    previous_neighbours.set(edges[e][1], temporary);
                    
                }
                await waitForTimeout()
                cell.textContent = distances[edges[e][1]] === Infinity ? '∞' : distances[edges[e][1]]; 
               
            }
            colorEdgeCell(document, null)

            for (var c = 0; c < row.cells.length; c++) {
                var empty_cell = row.cells[c];  
                if(empty_cell.textContent == ""){  
                    empty_cell.textContent = "∞";  
                }
            }
            await waitForTimeout()
            if(changeHappened && i == n-1){
                negativeCycleDetected = true;
            }
           
            if(!changeHappened)
                break        
        }
        showPaths(negativeCycleDetected,src, dst, previous_neighbours, distances);      
    }    
    (async () => {
        await helper(edges, n, src);
        callback();
    })();
}


function showPaths(negativeCycleDetected,src, dst, previous_neighbours, distances){
    if(negativeCycleDetected){
        msg.innerHTML += "<br>Negtaive Cycle Detected !"
    }else{
        const transformFn = (x) => NODE_MAP.get(x);

        function stringBuilder(map, transformFn) {
            var res = ""
            if(dst){
                if(map.has(dst)){
                    res += `${NODE_MAP.get(dst)} (${distances[dst]}): `;
                    res += map.get(dst).map(transformFn).join(", "); 
                }
                else{
                    res = `No path from ${NODE_MAP.get(src)} to  ${NODE_MAP.get(dst)}: `
                }
            }
            else{
                for (const [key, value] of map) {
                    res += `${NODE_MAP.get(key)} (${distances[key]}): `;
                    res += value.map(transformFn).join(", "); 
                    res += "<br>";
                }
            }
            return res;
        }
        const str = stringBuilder(previous_neighbours, transformFn);
        msg.innerHTML+="<br>"
        msg.innerHTML += str
    }        
}






function startBelmanFord(){
    if(!process_goes){
        process_goes = true;
        svg.selectAll("circle")
            .data(graph.nodes)
            .attr("fill", NATURAL)
            .attr('stroke', 'none')
      
        
        clearTable(document);
        createTableHeaders(n, document)
        
        var src = parseInt(src_selector.value, 10);  
        var dst = parseInt(dst_selector.value, 10);  
        
        msg.innerHTML = `Shortest Paths from ${NODE_MAP.get(src)}`;
        if(dst){
            msg.innerHTML +=  ` to ${NODE_MAP.get(dst)}`
        }

       

        belmanFord(edges, n, src, dst, ()=>{
            process_goes = false; 
        });
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
        

        createTableHeaders(n, document);  
        createEdgeTable(edges, document);

        generateSrcInput(src_selector, n)
        generateDstInput(dst_selector, n );

    }catch {
        errorPage();
    }
}


function changeGraph() {
    if (!process_goes) {
        svg.selectAll("*").remove(); 
       
        src_selector.innerHTML = "";
        dst_selector.innerHTML = "";
        msg.innerHTML = `Shortest Paths from A`;
        clearTable(document);
        clearEdgeTable(document);
        vizualize();
    }
} 



vizualize()
document.getElementById("refresh").addEventListener("click", changeGraph);
document.getElementById("start").addEventListener("click", startBelmanFord);



