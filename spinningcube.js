var canvas;
var gl;

// Setup uniform locations 
var cubeInstances = [];
var xAxis = vec3(1, 0, 0);
var yAxis = vec3(0, 1, 0);
var zAxis = vec3(0, 0, 1);
var rotationAxis = xAxis;
var uModelViewLoc, uProjectionLoc;
var staticData = {
    vertices: [],
    colors: []
};


function Transform(x,y,z) {
    this.rotation = rotateX(0)
    this.center = translate(-0.5,-0.5,0.5)
    this.translation = translate(x,y,z)
    this.transform = translate(0,0,0)
    this.scaling = scalem(1, 1, 1)
}

Transform.prototype.computeTransform = function () {
    // Create ModelView matrix
    this.transform = mult(this.translation, mult(mult(this.scaling, this.rotation), this.center))
}

Transform.prototype.getTransform = function () {
    return this.transform
}

Transform.prototype.rotate = function (theta, axis) {
    
    this.rotation = mult(rotate(theta, axis), this.rotation)
}

Transform.prototype.setScale = function (scale) {
    
    this.scaling = scalem(scale, scale, scale)
}

Transform.prototype.translate = function (x, y, z) {
    
    this.translation = mult(this.translation, translate(x, y, z))
}


function mult4(mat, vec) {
    var result = [];
    for ( var i = 0; i < vec.length; ++i ) {
        var innerSum = 0;
        for (var j = 0; j < mat[i].length; ++j) {
            innerSum += vec[i] * mat[i][j];
        }
        result.push(innerSum);
    }
    return result;
}

//Function to add a cube to the cubeInstances array 
function addCube(cube) {
    // Add to cube instances
    cubeInstances.push(cube)
    //Set all cubes' scales properly
    var numCubes = cubeInstances.length;
    cubeInstances.forEach(cube => {
        cube.transform.setScale(1/numCubes);
    })

    var center = {
        x: cube.transform.translation[0][3],
        y: cube.transform.translation[1][3],
        z: cube.transform.translation[2][3]
    };
    var scale = cube.transform.scaling[0][0];
    
    console.log(`Scale: ${scale}`)
    
}

function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //initialize data
    createCube(vertices, colors);

    //
    //  Configure WebGL
    //
    //Change clear color and enable depth testing
	
    gl.clearColor( 1.0, 1.0, 0.5, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    
    // Create vertex position buffer and send initial data
    var vPosBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vPosBuff );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(staticData.vertices), gl.STATIC_DRAW );

    // Associate vPosition attribute in shader to the buffer
    var vPosLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosLoc );

    // Create vertex color buffer and send initial data
    var vColorBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vColorBuff );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(staticData.colors), gl.STATIC_DRAW );

    // Associate vColor attribute in shader to the buffer
    var vColLoc = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColLoc );

    //initialize and set up uniform locations
    uProjLoc = gl.getUniformLocation( program, "uProjection" );
    uModelViewLoc = gl.getUniformLocation( program, "uModelView" );
    //Setup ortho projection matrix based on canvas aspect ratio
    var aspect = canvas.width/canvas.height;
    var proj = ortho(-1 * aspect, 1 * aspect, -1, 1, -10, 10);
    //Create inverse projection for use later
    var inverseProj = inverse4(proj);
    //Setup initial cube's model matrix
    addCube({
        transform: new Transform(0,0,0),
        speed: Math.random() * 2 - 1
    })
    //Send data to uniforms
    gl.uniformMatrix4fv(uProjLoc, false, flatten(proj));
    gl.uniformMatrix4fv(uModelViewLoc, false, flatten(cubeInstances[0].transform.getTransform()));

    //Setup click event
    canvas.onclick = (e) => {
        //First get canvas-relative pixel coordinates of the click
        var screenx = e.pageX - canvas.offsetLeft;
        var screeny = canvas.height - (e.pageY - canvas.offsetTop);
        //then normalize them to OGL -1, 1 space
        var normx = 2 * (screenx / canvas.width) - 1;
        var normy = 2 * (screeny / canvas.height) - 1;
        //Unproject normalized coordinates using inverse projection matrix
        var projected = mult4(inverseProj, vec4(normx, normy, 0, 1));
        //Randomize z from -0.5, 0.5
        projected[2] = Math.random() - 0.5;
        //Add new cube
        addCube({
            transform: new Transform(projected[0], projected[1], projected[2]),
            //Random speed between -1 and 1
            speed: Math.random() * 1
        })

    }

    // rotation buttons and scale slider
    document.getElementById('xbutton').onclick = e => {
        rotationAxis = xAxis
    }
    document.getElementById('ybutton').onclick = e => {
        rotationAxis = yAxis
    }
    document.getElementById('zbutton').onclick = e => {
        rotationAxis = zAxis
    }
    document.getElementById('rbutton').onclick = e => {
        rotationAxis = vec3(Math.random(), Math.random(), Math.random())
    }
	document.getElementById("slider").onchange = function() {
        scale = event.srcElement.value;
		cubeInstances.forEach(cube => {
        cube.transform.setScale(scale);
    })
		
    };
    
    render();
}

window.onload = init

function render()
{
    //clear color and depth buffers
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    //Draw each cube instance
    cubeInstances.forEach(cube => {
        //First we rotate this cube around the rotation axis by its speed
        cube.transform.rotate(cube.speed, rotationAxis);
        //recompute the transform matrix
        cube.transform.computeTransform();
        //Send the new data to the gpu in the modelview uniform
        gl.uniformMatrix4fv(uModelViewLoc, false, flatten(cube.transform.getTransform()));
        //Draw the static verticies transformed by the matrix
        gl.drawArrays( gl.TRIANGLES, 0, staticData.vertices.length );
    })
    //Get nextframe and run this function again
    window.requestAnimationFrame(render);
}