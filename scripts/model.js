var model_count = 1;
var newTransform = new Matrix4();
function Model(modelVerticies, modelNormals, modelGouradNormals, modelNumVerticies, uvCoords){
  this.verticies = modelVerticies;
  this.normals = modelNormals;
  this.gouradNormals = modelGouradNormals;
  this.uvCoords = uvCoords;
  this.numVertices = modelNumVerticies;
  this.transMatrix = new Matrix4();
  this.transMatrix.setTranslate(0.0,0.0,0.0);
  this.objectLocation = [0.0,0.0,0.0];

  //this.transMatrix.setRotate(45,0,0,1);
  //this.transMatrix.rotate(20,1,0,0);
  this.objectColor = [1.0,1.0,1.0,1.0];
  this.pickingColor = [0.0,(model_count*10.0)/255.0,0.0];
  model_count++;

  this.offsetX = 0.0;
  this.offsetY = 0.0;
  this.offsetZ = 0.0;

  this.offsetRX = 0.0;
  this.offsetRY = 0.0;
  this.offsetRZ = 0.0;

  this.offsetScale = 1.0;
  this.usingTexture = 0;
  this.textureImage = new Image();


  this.translate = function(x,y,z){
    this.objectLocation = [this.objectLocation[0]+x,this.objectLocation[1]+y,this.objectLocation[2]+z];
    var translateMatrix = new Matrix4();
    translateMatrix.setTranslate(x,y,z);
    this.transMatrix = translateMatrix.multiply(this.transMatrix);
    //this.transMatrix.translate(x,y,z);
    //if(activeObject==0)

  }

  this.rotate = function(amt,x,y,z){
      var firstTranslate = new Matrix4();
      firstTranslate.setTranslate(-this.objectLocation[0],-this.objectLocation[1],-this.objectLocation[2]);
      this.transMatrix = firstTranslate.multiply(this.transMatrix);
      var rotateMateix = new Matrix4();
      rotateMateix.setRotate(amt,x,y,z);
      this.transMatrix = rotateMateix.multiply(this.transMatrix);
      var secondTranslate = new Matrix4();
      secondTranslate.setTranslate(this.objectLocation[0],this.objectLocation[1],this.objectLocation[2]);
      this.transMatrix = secondTranslate.multiply(this.transMatrix);

      //this.transMatrix.rotate(amt,1,0,0);
  }

  this.scale = function(amt){
    //var scaleMatrix = new Matrix4();
    //scaleMatrix.setScale(amt,amt,amt);
    //this.transMatrix = scaleMatrix.multiply(this.transMatrix);
    //this.transMatrix.scale(amt,amt,amt);
    var firstTranslate = new Matrix4();
    firstTranslate.setTranslate(-this.objectLocation[0],-this.objectLocation[1],-this.objectLocation[2]);
    this.transMatrix = firstTranslate.multiply(this.transMatrix);
    var scaleMatrix = new Matrix4();
    scaleMatrix.setScale(amt,amt,amt);
    this.transMatrix = scaleMatrix.multiply(this.transMatrix);
    var secondTranslate = new Matrix4();
    secondTranslate.setTranslate(this.objectLocation[0],this.objectLocation[1],this.objectLocation[2]);
    this.transMatrix = secondTranslate.multiply(this.transMatrix);
  }

  this.changeColor = function(r,g,b){
    this.objectColor[0] = r;
    this.objectColor[1] = g;
    this.objectColor[2] = b;
  }

  this.cameraTranslate = function(x,y,z){
    var cameraTranslation = new Matrix4;
    this.objectLocation = [this.objectLocation[0]-x,this.objectLocation[1]-y,this.objectLocation[2]-z];
    cameraTranslation.setTranslate(x,y,z)
    cameraTranslation.invert();
    this.transMatrix = cameraTranslation.multiply(this.transMatrix);
    //this.transMatrix.multiply(cameraTranslation);
  }

  this.cameraRotate = function(amt,x,y,z){
    //this.transMatrix.translate(0,0,2);
    var firstTranslate = new Matrix4();
    firstTranslate.setTranslate(-this.objectLocation[0],-this.objectLocation[1],-this.objectLocation[2]-2);
    this.transMatrix = firstTranslate.multiply(this.transMatrix);
    //this.transMatrix.translate(-this.objectLocation[0],-this.objectLocation[1],-this.objectLocation[2]-200);
    //this.transMatrix.translate(this.objectLocation[0],this.objectLocation[1],this.objectLocation[2]+2);
    var cameraRotation = new Matrix4();
    cameraRotation.setRotate(amt,x,y,z);
    cameraRotation.invert();
    this.transMatrix = cameraRotation.multiply(this.transMatrix);
    //this.transMatrix.multiply(cameraRotation);
    //this.transMatrix = cameraRotation.multiply(this.transMatrix);
    //this.transMatrix.translate(0,0,-2);
    var secondTranslate = new Matrix4();
    secondTranslate.setTranslate(this.objectLocation[0],this.objectLocation[1],this.objectLocation[2]+2);
    this.transMatrix = secondTranslate.multiply(this.transMatrix);
    //this.transMatrix.translate(this.objectLocation[0],this.objectLocation[1],this.objectLocation[2]+200);
    //this.transMatrix.translate(-this.objectLocation[0],-this.objectLocation[1],-this.objectLocation[2]-2);
  }



  this.draw = function(){

    u_matrix = new Matrix4();
    //t_matrix = new Matrix4();
    //u_matrix.setOrtho(-1.2,1.2,-1.2,1.2,-100,1000);
    //u_matrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    if(perspectiveON){
      u_matrix.setPerspective(persectiveZoomAngle, canvas.width/canvas.height, .001, 100);
      u_matrix.lookAt(0, 0, 2, 0, 0, -100, 0, 1, 0);
    } else {
      //u_matrix.setOrtho(-1.02,1.02,-1.02,1.02,-100,1000);
      u_matrix.setOrtho(-orthographicZoomVal,orthographicZoomVal,-orthographicZoomVal,orthographicZoomVal,-100,1000);
      u_matrix.lookAt(0, 0, 2, 0, 0, -100, 0, 1, 0);
    }
    /*
    u_matrix.rotate(-45,1,0,0);
    u_matrix.rotate(rotateOffset,0,0,1);
    u_matrix.scale(1.0/scaleOffset,1.0/scaleOffset,1.0/scaleOffset);
    u_matrix.translate(-xOffset,-yOffset,-zOffset);
    */
    //this.transMatrix.setRotate(45,0,0,1);
	  //this.transMatrix.setRotate(20,1,0,0);
    //this.transMatrix.rotate(rotateOffsetDraw,0,1,0);
    //this.transMatrix.scale(1.0/scaleOffsetDraw,1.0/scaleOffsetDraw,1.0/scaleOffsetDraw);
    //t_matrix.translate(-xOffset,-yOffset,-zOffset);
    //u_matrix = new Matrix4();
    //u_matrix.ortho(-1.2,1.2,-1.2,1.2,-100,1000);
    //u_matrix.rotate(45,0,1,0);
    gl.uniformMatrix4fv(uMatrix_loc, false, u_matrix.elements);
    gl.uniformMatrix4fv(uWMatrix_loc, false, w_matrix.elements);
    gl.uniformMatrix4fv(uTMatrix_loc, false, this.transMatrix.elements);
    gl.uniformMatrix4fv(uPLightTMatrix_loc, false, uPLightTMatrix.elements);
    gl.uniformMatrix4fv(uCamTMatrix_loc, false, uCamTMatrix.elements);
    gl.uniform1i(togglePhongShader_loc,phongShaderOn);
    gl.uniform1i(renderLightCube_loc, renderLightCube);
    gl.uniform1i(useTexture_loc,this.usingTexture);
    gl.uniform4f(uObjectColor_loc,this.objectColor[0],this.objectColor[1],this.objectColor[2],1.0);
    gl.uniform4f(uPickingColor_loc,this.pickingColor[0],this.pickingColor[1],this.pickingColor[2],1.0);

    if(this.usingTexture > 0){
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this.textureImage);
      gl.generateMipmap(gl.TEXTURE_2D);
    }


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    if(smoothShaderOn){
      gl.bufferData( gl.ARRAY_BUFFER, flatten(this.gouradNormals), gl.STATIC_DRAW );
    } else {
      gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW );
    }
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(normalArr), gl.STATIC_DRAW );
    var nPosition = gl.getAttribLocation( program, "aNormal" );
    //console.log('aNormal',nPosition);
    gl.vertexAttribPointer( nPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( nPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

	  var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.verticies), gl.STATIC_DRAW );
    //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    //console.log('vPosition',vPosition);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.uvCoords), gl.STATIC_DRAW);
    var uvPosition = gl.getAttribLocation( program, "vCoord" );
    //var uvPosition = 0;
    //console.log('uvPosition',uvPosition);
    gl.vertexAttribPointer(uvPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( uvPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    //thetaLoc = gl.getUniformLocation(program, "theta");

  }

  this.render = function(){

    //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(thetaLoc, [this.offsetRX ,this.offsetRY, this.offsetRZ]);
    if (wireFrameOn){
      gl.drawArrays( gl.LINE_LOOP, 0, this.numVertices );
    } else{
      gl.drawArrays( gl.TRIANGLES, 0, this.numVertices );
    }

  }

}
