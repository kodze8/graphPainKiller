import {generate_valid_graph, visualizeStaticGraph, NODE_MAP} from './graphUtils.js';



export function generate_valid_weighted_graph(){
    var [n, edges, nodes] = generate_valid_graph()
    for (var i =0; i<edges.length; i++ ){
        edges[i].push(Math.floor(Math.random() * 9)+1)
    }
    return [n, edges, nodes]
}


export function transform_for_vizualization(edges, nodes){
    const links =[]
    for (var edge of edges){
        links.push({ source: edge[0], target: edge[1], weight: edge[2] })
    } 
    return {nodes: nodes,links: links};
}


export function get_weights(edges, n){
    const rows = n;
    const cols = n;
    const arr = new Array(rows);

    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols); 
    }
    for(var edge of edges){
        arr[edge[0]][edge[1]] =edge[2]
        arr[edge[1]][edge[0]] =edge[2]
    }
    return arr
}

export function random_position(x1,x2,y1,y2){
    // y = ax + b 
    const a = (y2 - y1) / (x2 - x1);
    const b = y1 - a * x1;

    var percentiles = [0.3, 0.5]
    var x = x1+(x2-x1)*percentiles[Math.floor(Math.random() * percentiles.length)];
    var y = a*x + b
    return [x, y]
}


// vizualizes graph
export function visualizeStaticGraph_2(graph, svg) {
    visualizeStaticGraph(graph, svg)

    svg.append("g")
        .selectAll("text")
        .data(graph.links)
        .enter().append("text")
        .attr("class", "weight")
        .attr("x", d => {
            const sourceNode = graph.nodes.find(node => node.id === d.source);
            const targetNode = graph.nodes.find(node => node.id === d.target);
            return sourceNode.x + (targetNode.x - sourceNode.x) * 0.35;
        })
        .attr("y", d => {
            const sourceNode = graph.nodes.find(node => node.id === d.source);
            const targetNode = graph.nodes.find(node => node.id === d.target);
            return sourceNode.y + (targetNode.y - sourceNode.y) * 0.35;
        })
        .text(d => d.weight); 
}



export function edges_to_adj(n, edges) {
    const adj = new Map();
    for (let i = 0; i < n; i++) {
        adj.set(i, []);
    }
    for (let edge of edges) {
        adj.get(edge[0]).push(edge[1]);
        adj.get(edge[1]).push(edge[0]);
    }
    return adj;
}

