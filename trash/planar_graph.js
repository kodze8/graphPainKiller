
function random_number(start, end){
    return Math.floor(Math.random() * (end - start)) + start; //end is not included

}

function graphGenerator(){
    const n_vertices = random_number(6,11); // min = 6 max = 10

    var vertices_faces = new Map();
    var faces_vertices = new Map();
    var face = 0
    var CENTER = 100
    var RADIOUS = 40
    var VERTICES = []

    const edges = []
    do{
        var current_vertices =   random_number(0,n_vertices);
    }
    while(current_vertices<2)

    


    for(var i=0; i<current_vertices; i++){
        vertices_faces.set(i, [face])
        VERTICES.push({
            id: i, 
            x:CENTER + RADIOUS * Math.cos(i*2*Math.PI/current_vertices), 
            y:CENTER + RADIOUS * Math.sin(i*2*Math.PI/current_vertices)
        })

        if(i==current_vertices-1){
            edges.push([i, 0])
        }
        else{
            edges.push([i, i+1])
        }
    }
    faces_vertices.set(face, Array.from({ length: current_vertices }, (_, i) => i));


    while(current_vertices<n_vertices){

        CENTER+=100
        face++;
        var random_face = random_number(0,face);
        do{
            var vertices = faces_vertices.get(random_face)
            var u = vertices[random_number(0,vertices.length)];
            var v = vertices[random_number(0,vertices.length)];
        }
        while(u===v)


        var vertices_to_add = random_number(1, n_vertices-current_vertices+1)
        for(var i=current_vertices; i<current_vertices+vertices_to_add; i++){
            VERTICES.push({
                id: i, 
                x:CENTER+RADIOUS * Math.cos(i*2*Math.PI/vertices_to_add), 
                y:CENTER+RADIOUS * Math.sin(i*2*Math.PI/vertices_to_add)
            })

            if(i==current_vertices){
                edges.push([u, i]);
            }
            if(i==current_vertices+vertices_to_add-1){
                edges.push([i, v]);
            }
            else{
                edges.push([i, i+1]);
            }
        }
        faces_vertices.set(face, Array.from({ length: vertices_to_add }, (_, i) => current_vertices+i));
        faces_vertices.get(face).push(u)
        faces_vertices.get(face).push(v)
    
        current_vertices+=vertices_to_add;
    }
    return [n_vertices, edges, VERTICES];

}



console.log(graphGenerator())