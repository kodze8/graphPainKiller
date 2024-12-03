

function tarjan(n, edges){
    function rec(v, adj, stack, visited){
        visited.add(v);
        stack.add(v);
        for(var nei of adj.get(v)){
            if(!visited.has(nei)){
                rec(nei, adj, stack, visited);
            }else if(stack.has(nei)){
                return true;
            }
        }
    }


    var visited = new Set()
    for(var i=0; i<n; i++){
        if(!visited.has(i)){
            rec(v, edges, stack, visited)
        }
    }

}