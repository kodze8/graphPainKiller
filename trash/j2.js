 function depthFirstSearch(edges, src, n) {
    const adj = edgesToAdj(n, edges);
    const seen = new Set();
    const path = [];

    function rec(start) {
        path.push(start);
        seen.add(start);
        adj[start].forEach(i => {
            if (!seen.has(i)) {
                rec(i);
            }
        });
        return path;
    }

    return rec(src);
}

function edgesToAdj(n, edges) {
    const adj = {};
    for (let i = 0; i < n; i++) {
        adj[i] = [];
    }
    edges.forEach(edge => {
        adj[edge[0]].push(edge[1]);
        adj[edge[1]].push(edge[0]);
    });
    return adj;
}
function graphGenerator() {
    const n_vertices = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // Random number between 6 and 10
    let vertices = new Set();
    for (let i = 0; i < n_vertices; i++) {
        vertices.add(i);
    }

    let edges = [];
    const degrees = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3];
    shuffleArray(degrees);

    const src = getRandomElement(Array.from(vertices));
    let seen = new Set([src]);

    while (vertices.size > 0) {
        const v = Array.from(seen)[Math.floor(Math.random() * seen.size)];
        vertices.delete(v);
        seen.delete(v);

        const degree = Math.min(vertices.size, getRandomElement(degrees));

        for (let i = 0; i < degree; i++) {
            let neighbor = getRandomElement(Array.from(vertices));
            while (edges.some(e => (e[0] === v && e[1] === neighbor) || (e[0] === neighbor && e[1] === v))) {
                neighbor = getRandomElement(Array.from(vertices));
            }
            edges.push([v, neighbor]);
            seen.add(neighbor);
        }
    }

    // Convert vertices and edges to the format expected by D3.js
    const nodes = Array.from({ length: n_vertices }, (_, i) => ({ id: i }));
    const links = edges.map(edge => ({ source: edge[0], target: edge[1] }));

    return { nodes, links };
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}











function visualizeGraph(graph) {
    const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("fill", "steelblue");

    // Add text labels (optional)
    node.append("title")
        .text(d => d.id);

    // Force simulation
    const simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

const graph = graphGenerator();
visualizeGraph(graph);