import { generate_valid_weighted_graph,  transform_for_vizualization, visualizeStaticGraph_2, get_weights} from './weightedGraphUtils.js';
import { edges_to_adj,errorPage,generateDstInput, generateSrcInput,   NODE_MAP, LIGHT_BLUE,YELLOW, NATURAL } from './general/graphUtils.js';



let n, edges, nodes; 
var graph;


// works well
function belmanFord(edges, n, src, dst, callback){
    var distances = new Array(n).fill(Infinity);
    distances[src] = 0;
  
    for(var i =0; i<n; i++){
        for(var e = 0; e<edges.length; e++){

            if(distances[edges[e][0]] > distances[edges[e][1]]+edges[e][2]){
                distances[edges[e][0]] = distances[edges[e][1]]+edges[e][2]
            }
            if(distances[edges[e][1]] > distances[edges[e][0]]+edges[e][2]){
                distances[edges[e][1]] = distances[edges[e][0]]+edges[e][2]
            }
        }
    }
    return distances
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

    function rec(){
        let minDistance = Infinity;
        let minNode = null;




        for(var key=0; key<distances.length; key++){           
            if (distances[key] <= minDistance && !seen.has(key)) {
                minDistance = distances[key];
                minNode = key; 
            }
        }
        if(seen.size==n){
            return;
        }

        shortestPath.push(minNode)
        seen.add(minNode)

       
        for (const neighbour of adj.get(minNode)) {
            if (!seen.has(neighbour)) {
               
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
       rec()
    }
    rec()
    // console.log(distances)
    return distances
}

var k = 0;


function areListsEqual(list1, list2) {
    if (list1.length !== list2.length) {
        return false; // Different lengths means different content
    }

    for (let i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[i]) {
            return false; // If any element is different, return false
        }
    }

    return true; // All elements are the same==
}

var  k = 0; 
graph = generate_valid_weighted_graph();
[n, edges, nodes] = graph
console.log(edges)
console.log(n)

// for(var i=0; i<10000; i++){

//     graph = generate_valid_weighted_graph();
//     [n, edges, nodes] = graph
//     if(!areListsEqual(belmanFord(edges, n, 0, null, null),  dijkstra(edges, n, 0, null, null))){
//         k++
//     }
// }
// console.log(k)

