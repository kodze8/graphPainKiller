export function addRow(val) {
    var table = document.getElementById("stack"); 
    var newRow = table.insertRow(); 
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = val;
}

export function clearStack(){
    var table = document.getElementById("stack");
    while (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1); 
    } 
}

export function removeRow() {
    var table = document.getElementById("stack");
    var rowCount = table.rows.length; 
    if (rowCount > 1) {
        table.deleteRow(rowCount - 1); 
    } else {
        alert("No more rows to remove");
    }
}