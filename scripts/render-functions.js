// Function used to continuously update the screen.
var animate=function(time) {
  var dt=time-time_old;
  //rotateOffset = rotateOffset + dt * 0.01;
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for(var i = 0; i<modelObjects.length; i++){
      if(i==0){
        renderLightCube = 1;
        modelObjects[i].draw(); //draw();
        modelObjects[i].render(); //render();
        gl.flush();
        renderLightCube = 0;
      } else {
        renderLightCube = 0;
        modelObjects[i].draw(); //draw();
        modelObjects[i].render(); //render();
        gl.flush();
      }
    }

  time_old = time;
  window.requestAnimationFrame(animate);
};

// Function to update the data on the screen when anything changes doesn't actually
// call the render
function draw(){
    // 0 = FLAT_SHADER , 1 = SMOOTH_SHADER, 2 = PHONG_SHADER, 3 = WIREFRAME_SHADER

    //console.log('OFFSET: ',xOffset,yOffset,zOffset,'scale:',scaleOffset);
    //console.log('PHONG SHADERON: ', phongShaderOn, 'smoothShaderOn: ',smoothShaderOn);
    //console.log('PERSPECTIVE: ', perspectiveON);
    u_matrix = new Matrix4();
    t_matrix = new Matrix4();
    //u_matrix.setOrtho(-1.2,1.2,-1.2,1.2,-100,1000);
    //u_matrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    if(perspectiveON){
      u_matrix.setPerspective(persectiveZoomAngle, canvas.width/canvas.height, 1, 100);
      u_matrix.lookAt(0, 0, 2, 0, 0, -100, 0, 1, 0);
    } else {
      u_matrix.setOrtho(-orthographicZoomVal,orthographicZoomVal,-orthographicZoomVal,orthographicZoomVal,-100,1000);
    }
    /*
    u_matrix.rotate(-45,1,0,0);
    u_matrix.rotate(rotateOffset,0,0,1);
    u_matrix.scale(1.0/scaleOffset,1.0/scaleOffset,1.0/scaleOffset);
    u_matrix.translate(-xOffset,-yOffset,-zOffset);
    */
    t_matrix.setRotate(45,0,0,1);
	  t_matrix.setRotate(20,1,0,0);
    t_matrix.rotate(rotateOffsetDraw,0,1,0);
    t_matrix.scale(1.0/scaleOffsetDraw,1.0/scaleOffsetDraw,1.0/scaleOffsetDraw);
    //t_matrix.translate(-xOffset,-yOffset,-zOffset);
    //u_matrix = new Matrix4();
    //u_matrix.ortho(-1.2,1.2,-1.2,1.2,-100,1000);
    //u_matrix.rotate(45,0,1,0);
    gl.uniformMatrix4fv(uMatrix_loc, false, u_matrix.elements);
    gl.uniformMatrix4fv(uTMatrix_loc, false, t_matrix.elements);
    gl.uniform1i(togglePhongShader_loc,phongShaderOn);
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    if(smoothShaderOn){
      gl.bufferData( gl.ARRAY_BUFFER, flatten(normalArrAvgs), gl.STATIC_DRAW );
    } else {
      gl.bufferData( gl.ARRAY_BUFFER, flatten(normalArr), gl.STATIC_DRAW );
    }
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(normalArr), gl.STATIC_DRAW );
    var nPosition = gl.getAttribLocation( program, "aNormal" );
    gl.vertexAttribPointer( nPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( nPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

	var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    //thetaLoc = gl.getUniformLocation(program, "theta");
}
// Updates the screen
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(thetaLoc, theta);
    if (wireFrameOn){
      gl.drawArrays( gl.LINE_LOOP, 0, NumVertices );
    } else{
      gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    //requestAnimFrame( render );
}
