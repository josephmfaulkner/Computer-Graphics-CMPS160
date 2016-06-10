"use strict";
//This is the function first called when the page first loads
window.onload = function init(){
  // get the html doc elements (canvas), get webgl context
  document.getElementById('openFiles').addEventListener('change', handleFileSelect, false);
  document.getElementById('selectTexture').addEventListener('change', handleTextureSelect, false);
	canvas = document.getElementById( "gl-canvas" );
  gl = canvas.getContext('webgl'); if(!gl){console.log('NOGL');}
  if ( !gl ) { alert( "WebGL isn't available" ); }
  // Setup canvas basic properties
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( clearBackgroundColor[0], clearBackgroundColor[1], clearBackgroundColor[2], 1.0 );
  gl.enable(gl.DEPTH_TEST);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  initShaders();
	// Load a simple default object to be displayed before the user loads an object of their own.
  loadObject(lightcubeVert,lightcubeIndx);
  modelObjects[0].changeColor(1.0,0.0,0.0);
  // Get uniform locations
	var uColor_loc = gl.getUniformLocation(program,"uColor");
  gl.uniform3f(uColor_loc,1.0,1.0,1.0);
	var uLightDirection_loc = gl.getUniformLocation(program,"uLightDirection");
	gl.uniform3f(uLightDirection_loc,-15,15,2);
  var uPointLightPosition_loc = gl.getUniformLocation(program,"uPointLightPosition");
	uMatrix_loc = gl.getUniformLocation(program,"uMatrix");
  uTMatrix_loc = gl.getUniformLocation(program,"uTMatrix");
  uPLightTMatrix_loc = gl.getUniformLocation(program,"uPLightTMatrix");
  uCamTMatrix_loc = gl.getUniformLocation(program,"uCamTMatrix");
  useTexture_loc = gl.getUniformLocation(program,"useTexture");
  uPLightTMatrix.setTranslate(0.0,0.0,0.25);
  uCamTMatrix.setTranslate(0.0,0.0,0.0);
  togglePhongShader_loc = gl.getUniformLocation(program,"togglePhongShader");
  toggleObjectPicking_loc = gl.getUniformLocation(program,"toggleObjectPicking");
  uObjectColor_loc = gl.getUniformLocation(program,"uObjectColor");
  gl.uniform4f(uObjectColor_loc,1.0,1.0,1.0,1.0);
  gl.uniform3f(uPointLightPosition_loc,0.0,0.0,0.0);
  uPickingColor_loc = gl.getUniformLocation(program,"pickingColor");
  renderLightCube_loc = gl.getUniformLocation(program,"renderLightCube");
  uWMatrix_loc = gl.getUniformLocation(program,"uWMatrix");
  w_matrix.setTranslate(0.0,0.0,0.0);
  //draw();
  //render();

  //Add event listeners to the canvas. The first one disables the default right click.
  canvas.addEventListener("contextmenu", function(event) {
  	event.preventDefault();
  	return false;
  });
  canvas.addEventListener("mousedown", mouseDown, false);
  window.addEventListener("mouseup", mouseUp, false);
  //window.addEventListener("mouseout", mouseUp, false);
  window.addEventListener("mousemove", mouseMove, false);
  document.onkeydown = switchTool;
  //window.addEventListener("mousewheel", mouseScroll,false);
  canvas.addEventListener("mousewheel", mouseScroll,false);

  document.getElementById('activeObject').innerHTML = 'Active Object: ' + activeObject;
  document.getElementById('activeTool').innerHTML = 'Active Tool: Move';

  adjustChangeColorVal();
  animate(0);
  // Create a texture.
texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
// Fill the texture with a 1x1 blue pixel.
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));
// Asynchronously load an image

/*
var image = new Image();
image.src = "f-texture.png";
image.addEventListener('load', function() {
  // Now that the image has loaded make copy it to the texture.
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  console.log("loaded-texture");
  //animate(0);
});
*/

};
