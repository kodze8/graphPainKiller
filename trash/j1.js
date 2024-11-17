

async function graph_generator() {
    const nVertices = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
    const vertices = Array.from({ length: nVertices }, (_, i) => i);

    const edges = {};
    const degrees = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 5];

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for(let i = 0; i<vertices.length; i++){
        const v = vertices[i];
        edges[v] = [];

        const degree= degrees[Math.floor(Math.random()*degrees.length)];
        for(let k=0; k<degree; k++){
            let to_add;
            do{
                to_add = vertices[Math.floor(Math.random()*vertices.length)]
            }while(edges[v].includes(to_add)||to_add==v);
            edges[v].push(to_add);
        }
        document.write(v + ": " + edges[v] + "<br>");
        await sleep(1000);
        
    }

    const randomVertex = vertices[Math.floor(Math.random() * nVertices)];
    return {edges, randomVertex};
}
const graph = graph_generator();
console.log(graph.edges);
console.log("Random Vertex:", graph.randomVertex);
