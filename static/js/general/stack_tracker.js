export function addRow(val, table) {
    var newRow = table.insertRow(); 
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = val;
}

export function clearStack(table){
    while (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1); 
    } 
}

export function removeRow(table) {
    var rowCount = table.rows.length; 
    if (rowCount > 1) {
        table.deleteRow(rowCount - 1); 
    } else {
        alert("No more rows to remove");
    }
}