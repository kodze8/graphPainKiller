function unionFind(edges, n){
  function findParnet(a, parents){
    if(parents[a] == a)
      return a;
    else
      return findParnet(parents[a],parents)
  }


  function union(a, b, parents){
    var great_parent = parents[a];
    var temp = parents[b];

    for(var i=0; i<parents.length; i++){

      if(parents[i]==temp){
        parents[i] = great_parent
      }
    }
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


var lst = [[2,0],[0,7], [1, 5], [6, 0], [5, 7]]

unionFind(lst, 8)




// (2, 0) - 0,1,0,3,4,5,6,7
// (0, 7) - 7,1,0,3,4,5,6,7
// (1, 5) - 7,5,0,3,4,5,6,7
// (6, 0) - 7,5,0,3,4,5,7,7
// (5, 7) - 7,7,0,3,4,7,7,7
// (4, 6) - 7,7,0,3,7,7,7,7
// (6, 2) - 7,7,7,3,7,7,7,7
// CYCLE!!!
// (2, 1) - 7,7,7,3,7,7,7,7
// (5, 3) - 3,3,3,3,3,3,3,3
// CYCLE!!!
// (3, 7) - 3,3,3,3,3,3,3,3