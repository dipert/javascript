//
//CSE 470 HW 1 Explode!  
//
/*
Written by: HW470:YOUR NAME HERE
Date: Jan 2019

Description: 
This program ..... HW470: COMPLETE THIS. DESCRIBE WHAT YOU DID.
I started by intitializing all the vertices for my design, then I used for loops on the indecies of the vertices
array to make solid colored triangles. Then drew all the shapes and uncremented the color and size of the explosion
in the render() function
*/

var canvas;
var gl;
var increment1 = 0.01;
var increment2 = 0.02;
var increment3 = 0.03;
var count = 0.0;
var u_color = 0.0;
var u_colorLoc;

var vertices = [
	
	
];
/*for(var x = 0; x < 90; x++)
{
	vertices.push(vec2(0.25 + increment1, -0.25 + increment2));
	increment1 = increment1 +0.01;
	increment2 = increment2 + 0.02;
};*/
//console.log(vertices[89]);
//store a color for each vertex
var colors = [];

//HW470: control the explosion
//(Your variables here)
 var theta = 1.2;
 var thetaLoc = 0.0;

//HW470: control the redraw rate
var delay = 20;

// =============== function init ======================
 
// When the page is loaded into the browser, start webgl stuff
window.onload = function init()
{
	// notice that gl-canvas is specified in the html code
    canvas = document.getElementById( "gl-canvas" );
    
	// gl is a canvas object
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Track progress of the program with print statement
    console.log("Opened canvas");
        
    //HW470:
    // Define  data for object 
	// See HW specs for number of vertices and parts required
	// Recommendation: each set of three points corresponds to a triangle.
	// DCH: I have used sval for scaling the object size if I am not
	// happy with my initial design. (Just an idea for you; no need to use.)
	//(During the explosion all geometry must remain in the window.)
    //Designed the shape to explode
	var sval = 0.1;
    vertices = [
        vec2( sval, -sval ),// core1
        vec2( 0.0, sval ),
        vec2( -sval, -sval ),
		vec2(0.0, 0.0),//*2
		vec2(0.15, 0.1),
		vec2(.1, -.1),
		vec2(0.0, 0.0),//3
		vec2(.25, -.1),
		vec2(-.1, -.1),
		vec2(0.0, 0.0),//4
		vec2(-0.15, 0.1),
		vec2(-.1, -.1),
		vec2(0.0, 0.0),//5
		vec2(-.25, -.1),
		vec2(-.1, -.1),
		vec2(-0.1, -.1),//6
		vec2(.0, -.3),
		vec2(0.1,-.1),
		vec2(0.0,-.2),//7
		vec2(.25, -.1),
		vec2(-.0, -.1),
		vec2(0.0,-.2),//8
		vec2(-.25, -.1),
		vec2(0.0,-.1),
		vec2(-.15, .0),//9 sidebar
		vec2(-.2, .3),
		vec2(-.4, .3),
		vec2(-.4, .3), //10
		vec2(-.2, .3),
		vec2(-.5, 0.5),
		vec2(.15, .0),//11 sidebar
		vec2(.2, .3),
		vec2(.4, .3),
		vec2(.4, .3), //12
		vec2(.2, .3),
		vec2(.5, 0.5),
		vec2(-.15, -.2),//13 sidebar
		vec2(-.2, -.4),
		vec2(-.4, -.4),
		vec2(-.4, -.4), //14
		vec2(-.2, -.4),
		vec2(-.5, -0.6),
		vec2(.15, -.2),//15 sidebar
		vec2(.2, -.4),
		vec2(.4, -.4),
		vec2(.4, -.4), //16
		vec2(.2, -.4),
		vec2(.5, -0.6)
    ];
	//HW470: Create colors for the core and outer parts
	// See HW specs for the number of colors needed
	//colored in all the triangles with different colors
	for(var i=0; i < 24; i++) {
		colors.push(vec3(0.0, 1.0, 0.0));
	};
	for(var i=24; i < 30; i++) {
		colors.push(vec3(0.0, 1.0, 1.0));
	};
	for(var i=30; i < 36; i++) {
		colors.push(vec3(1.0, 0.0, 1.0));
	};
	 for(var i=36; i < 42; i++) {
		colors.push(vec3(.5, 0.0, 1.0));
	};
	for(var i=42; i < 48; i++) {
		colors.push(vec3(1.0, 0.0, 0.0));
	};
	
	// HW470: Print the input vertices and colors to the console
	//prints out the values at the indecies of both arrays
	console.log("Input vertices and colors:");
	console.log("Vertices:", vertices);
	console.log("Colors:", colors);
	 

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	// Background color to white
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Define shaders to use  
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
	//
	// color buffer: create, bind, and load
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	// Associate shader variable for  r,g,b color
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    // vertex buffer: create, bind, load
    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate shader variables for x,y vertices	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	//HW470: associate shader explode variable ("Loc" variables defined here) 
    thetaLoc = gl.getUniformLocation( program, "theta" );
	gl.vertexAttribPointer( thetaLoc, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( thetaLoc );
	
	var tbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    console.log("Data loaded to GPU -- Now call render");
	
	u_colorLoc = gl.getUniformLocation( program, "u_color" );//creates explosion factor
	x_colorLoc = gl.getUniformLocation( program, "x_color" );
	//gl.drawArrays( gl.TRIANGLES, 0, 24 );
    render();
};


// =============== function render ======================

function render()
{
    // clear the screen 
    gl.clear( gl.COLOR_BUFFER_BIT );

	u_color += .0085;//increment color
	theta += 0.005;//increment size

	//HW470: send uniform(s) to vertex shader
	
	//HW470: draw the object
	// You will need to change this to create the exploding outer parts effect
	// Hint: you will need more than one draw function call
	//draws the cor and the exploding portion seperately and increments the exploding portion
	gl.drawArrays( gl.TRIANGLES, 0, 24 );//draws the core 
	gl.uniform1f(thetaLoc, theta);
	gl.uniform1f(u_colorLoc, u_color);
	
	gl.drawArrays(gl.TRIANGLES, 24, 24);//draws exploding portion
	gl.uniform1f(thetaLoc, 1.0);
	gl.uniform1f(u_colorLoc, 0.0);
	
	count += 1.0;//keeps track of how close explosion is to the frame
	//console.log(count);
	if(count % 100 == 0) //resets animation
	{
		theta = 1.2;
		u_color = 0.0;
		//console.log("yoohoo");
	}
	//colorChange += .005;
	//re-render after delay
	setTimeout(function (){requestAnimFrame(render);}, delay);
}

