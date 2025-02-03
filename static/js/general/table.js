// Edge Table/Stack
import { NODE_MAP, NATURAL, YELLOW, LIGHT_BLUE} from "./graphUtils.js";


export function clearEdgeTable(document) {
    const tableBody = document
        .getElementById('edge-table')
        .getElementsByTagName('tbody')[0];

    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
}
export function createEdgeTable(edges, document){
    const table = document.getElementById('edge-table').getElementsByTagName('tbody')[0];
    for(var e = 0; e<edges.length; e++){    
        var newRow = table.insertRow(); 
        var cell = newRow.insertCell(0); 
        cell.textContent = `(${NODE_MAP.get(edges[e][0])},${NODE_MAP.get(edges[e][1])})`; 
    }
}

export function colorEdgeCell(document, e = null){
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



// vertiec Table

// #data-table thead tr
// header with iteartion column 
export function createTableHeaders(n, document, include_iter = true) {
    var lst = []
    if(include_iter)
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
export function addRow(distances, iteration, document, content = false, include_iter = true){
    const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    var step = 0;
    if(include_iter){
        step++;
        var cell = newRow.insertCell(0);
        cell.textContent = iteration;
        cell.style.color = LIGHT_BLUE; 
    }

    for(var i=0; i<distances.length; i++){
        var cell = newRow.insertCell(i+step);
        cell.style.color = NATURAL; 
        if(content){
            cell.textContent = distances[i] === Infinity ? '∞' : distances[i]
        }

    }
    return newRow
}

export function clearTable(document) {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const headerRow = document.querySelector('#data-table thead tr');

    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }

    while (headerRow.cells.length > 0) {
        headerRow.deleteCell(0);
    }
}

