var vertices = [
	vec3( 0.0, 0.0,  0.0),
	vec3( 0.0, 1.0,  0.0 ),
	vec3( 1.0, 1.0,  0.0 ),
	vec3( 1.0, 0.0,  0.0 ),
	vec3( 0.0, 0.0, -1.0 ),
	vec3( 0.0, 1.0, -1.0),
	vec3( 1.0, 1.0, -1.0 ),
	vec3( 1.0, 0.0, -1.0 )
];

// face colors
var colors = [
    
        vec3( 1.0, 0.0, 0.0),  // red
        vec3( 1.0, 1.0, 0.0),  // yellow
        vec3( 0.0, 1.0, 0.0),  // green
        vec3( 0.0, 0.0, 1.0),  // blue
        vec3( 1.0, 0.0, 1.0),  // magenta
        //vec3( 1.0, 1.0, 1.0),  // white
        vec3( 0.0, 1.0, 1.0) 
];
	
function createCube()
{
    //add color to each face
    quad( 1, 0, 3, 2, colors[0]);
    quad( 2, 3, 7, 6, colors[1] );
    quad( 3, 0, 4, 7, colors[2] );
    quad( 6, 5, 1, 2, colors[3] );
    quad( 4, 5, 6, 7, colors[4] );
    quad( 5, 4, 0, 1, colors[5] );
	
}

//Add color parameter to quad to color all the vertices that color
function quad(a, b, c, d, color) 
{

    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
      staticData.vertices.push( vertices[indices[i]] );
      staticData.colors.push(color);
        
    }
}