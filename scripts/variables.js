/* Rather than have to worry about "variable locality hell", I decided to put
all the global variables into a single file. Keeps things a lot simpler. */

//
var canvas;
var gl;
var color = new Uint8Array(4);
var colorChangeVal = [1.0,1.0,0.0];
var clearBackgroundColor = [0.0,0.0,0.0];

// These values handle the geometry data found in the loaded object
var NumVertices  = 0;
// Stores the extremes found in the .coor file. These values are
// used to derive the offset values.
var xMax = 0;
var xMin = 0;
var yMax = 0;
var yMin = 0;
var zMax = 0;
var zMin = 0;
// These values are used to offset the object in the offset function
var xOffset = 0;
var yOffset = 0;
var zOffset = 0 ;
var scaleOffset = 1;
var rotateOffset = 0;

var xOffsetDraw = 0;
var yOffsetDraw = 0;
var zOffsetDraw = 0;
var scaleOffsetDraw = 1;
var rotateOffsetDraw = 0;





// Handle gui click events
var time_old=0;
var old_x, old_y;
var dX, dY;
var leftClick = false;
var rightClick = false;
var middleClick = false;
var drag=false;
var selected_object = false;
var selected_background = false;
var wheelscroll = false;

var persectiveZoomAngle = 60;
var orthographicZoomVal = 1.02;

var points = [];
//var colors = [];
var normalArr = [];
var normalArrAvgs = [];

var vertArr_i = 0;
var indxArr_i = 0;
var vertArr_temp = [];
var indxArr_temp = [];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;
var program;

var objectVertArr = [];
var objectIndxArr = [];

//Toggle shader attributes
var perspectiveON = false;
var specularON = true;
var phongShaderOn = 0;
var smoothShaderOn = 0;
var wireFrameOn = 0;
var specularAMT = 5.0;
var activeShader = 0; // 0 = FLAT_SHADER , 1 = SMOOTH_SHADER, 2 = PHONG_SHADER, 3 = WIREFRAME_SHADER
var smoothNormals = false;
// Shader uniforms
var u_matrix;
var t_matrix;
var w_matrix = new Matrix4();
var uPLightTMatrix = new Matrix4();
var uCamTMatrix = new Matrix4();
var togglePhongShader_loc;
var toggleObjectPicking_loc;
var singleVertCount = 0;
var uMatrix_loc;
var uTMatrix_loc;
var uPLightTMatrix_loc;
var uCamTMatrix_loc;
var uObjectColor_loc;
var uPickingColor_loc;
var uPointLightPosition_loc;
var uWMatrix_loc;
var uvCoord_loc;
var useTexture_loc;

var renderLightCube = 0;
var renderLightCube_loc;


// Data for the default pyramid that is loaded when the program starts up.
var pyramidVert = [
      [0.5, 0.5,  -0.5, 1.0],
      [0.5,  -0.5,  -0.5, 1.0],
      [-0.5,  -0.5,  -0.5, 1.0],
      [-0.5, 0.5,  -0.5, 1.0],
      [0.0, 0.0,  0.5, 1.0]
];

var pyramidIndx = [
    0,4,1,
    1,2,4,
    2,4,3,
    3,4,0,
    3,1,2,
    3,0,1
 ];

var lightcubeVert = [
  [ -0.1, -0.1,  0.1,1.0],
  [0.1, -0.1,  0.1,1.0],
  [0.1,  0.1,  0.1,1.0],
  [-0.1,  0.1,  0.1,1.0],
  [-0.1, -0.1, -0.1,1.0],
  [0.1, -0.1, -0.1,1.0],
  [0.1,  0.1, -0.1,1.0],
  [-0.1,  0.1, -0.1,1.0]
];


var lightcubeIndx = [
   0,1,2,0,2,3,
   4,5,6,4,6,2,
   6,5,4,6,4,7,
   7,4,0,7,0,3,
   3,2,6,3,6,7,
   5,1,0,5,0,4,
];



 var modelObject;
 var modelObjects = [] ;
 var activeObject = 0;
 var startRender = false;
 var activeTool = 0; // 0 = move, 1 = rotate, 2 = scale, 3 = changeColor

 var newTextureImage = new Image();
 var texture;
