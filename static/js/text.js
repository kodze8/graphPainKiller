 function unionFind(edges, n){
  function findParnet(a, parents){
    if(parents[a] == a)
      return a;
    else
      return findParnet(parents[a],parents)
  }


  function union(a, b, parents){
    var great_parent = findParnet(b, parents);
    var temp = findParnet(a, parents)

    for(var i=0; i<parents.length; i++){
      if(findParnet(i, parents)==temp){
        parents[i] = great_parent
      }
    }
    parents[a] = great_parent
  }

  var parents = new Array(n);
  for(var i=0; i<n; i++){
    parents[i] = i;
  }

  for(var edge of edges){
    console.log(edge)
    if(parents[edge[0]]==parents[edge[1]])
      console.log("cycle")

    union(edge[0], edge[1], parents)
    console.log(parents);
  }

}


var lst = [[1,2],[3,2], [3,4], [4,5], [1,5]]
unionFind(lst, 6)