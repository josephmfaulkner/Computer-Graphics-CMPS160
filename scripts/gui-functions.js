var lockX = false;
var lockY = false;
var firstMove = true;

/*GUI FUNCTIONS ==========================================:
These functions handle all the gui library calls
*/
function changeShaderEvent(sv){
  //console.log('selected: ',sv.value);
  activeShader = sv.value;
  if(activeShader == 0){
    phongShaderOn = 0;
    smoothShaderOn = false;
    wireFrameOn = false;
    //draw();
    modelObjects[activeObject].draw();
    modelObjects[activeObject].render();
    //render();
  } else if (activeShader == 1) {
    phongShaderOn = 0;
    smoothShaderOn = true;
    wireFrameOn = false;
    modelObjects[activeObject].draw();
    modelObjects[activeObject].render();
    //draw();
    //render();
  } else if (activeShader == 2){
    phongShaderOn = 1;
    smoothShaderOn = true;
    wireFrameOn = false;
    //draw();
    //render();
    modelObjects[activeObject].draw();
    modelObjects[activeObject].render();

  } else if (activeShader == 3){
    phongShaderOn = 0;
    smoothShaderOn = false;
    wireFrameOn = true;
    //draw();
    //render();
    modelObjects[activeObject].draw();
    modelObjects[activeObject].render();

  }
}

function togglePerspectiveEvent(cb){
  console.log("togglePersp: ",cb.checked);
  perspectiveON = !perspectiveON;
  console.log("perspectiveON: ",perspectiveON);
  //draw();
  //render();
  modelObjects[activeObject].draw();
  modelObjects[activeObject].render();
}

function toggleSpecularEvent(cb){
  console.log("toggleSpec: ",cb.checked);
  specularON = !specularON;
  console.log("specularON: ",specularON);
}

function adjustSpecularEvent(rv){
  console.log("specVal: ",rv.value);
  specularAMT = rv.value;
  console.log("specularAMT: ",specularAMT);
}

function zoomInEvent(){
  scaleOffsetDraw = 1.05; //scaleOffsetDraw - scaleOffsetDraw;//* 0.15;
  modelObjects[activeObject].scale(scaleOffsetDraw);
  modelObjects[activeObject].draw();
  modelObjects[activeObject].render();
  //draw();
  //render();
}

function zoomOutEvent(){
  scaleOffsetDraw = 0.95;//scaleOffsetDraw + scaleOffsetDraw;//* 0.15;
  modelObjects[activeObject].scale(scaleOffsetDraw);
  modelObjects[activeObject].draw();
  modelObjects[activeObject].render();
  //draw();
  //render();
}



var mouseDown=function(e) {


  old_x=e.pageX, old_y=e.pageY;
  e.preventDefault();
  colorPick();



  /*
  if (activeTool == 0){
    //MOVE
  }  else if (activeTool == 1) {
    //ROTATE
  } else if (activeTool == 2) {
    //SCALE
  } else if (activeTool == 3) {
    //CHANGECOLOR
    //colorPick();
  }*/

  return false;
};



var mouseDown=function(e) {
  drag = true;
  if(e.button === 0){
      leftClick = true;
      colorPick();
      e.preventDefault();
  } else if (e.button === 1){
      middleClick = true;
      colorPick();
      e.preventDefault();
} else if (e.button === 2){
      rightClick = true;
      colorPick();
      e.preventDefault();
}
  e.preventDefault();
  console.log(' leftClick: ',leftClick,' middleClick: ',middleClick,' rightClick: ',rightClick);
  return false;
};

var mouseUp=function(e){
  leftClick = false;
  middleClick = false;
  rightClick = false;
  selected_object = false;
  selected_background = false;
  drag=false;
  wheelscroll = false;
  lockX = false;
  lockY =false;
  firstMove = true;
};

var mouseScroll = function(e){
  console.log("scroll wheel");
  //if(!wheelscroll) return false;
  if (middleClick && selected_object){
    //move object
    console.log("move object in/out");
    if(e.wheelDelta>= 120)
      modelObjects[activeObject].translate(0,0,0.15);
    else if(e.wheelDelta<= -120)
      modelObjects[activeObject].translate(0,0,-0.15);
  }
  else if(middleClick && selected_background){
    //move camera in/out
    console.log("move camera in/out");
    if(e.wheelDelta>= 120){
      for(var i = 0; i<modelObjects.length; i++){
        modelObjects[i].cameraTranslate(0,0,-0.15);
      }
    }
    else if(e.wheelDelta<= -120){
      for(var i = 0; i<modelObjects.length; i++){
        modelObjects[i].cameraTranslate(0,0,0.15);
      }
    }
  }
  else{
    //zoom camera (fov)
    console.log("zoomCamera (fov)");
    if(e.wheelDelta>= 120){
      orthographicZoomVal-= 0.05;
      persectiveZoomAngle-= 1.9;
    }
    else if(e.wheelDelta<= -120){
      orthographicZoomVal+= 0.05;
      persectiveZoomAngle+= 1.9;
    }
  }
  return false;
};


var mouseMove=function(e) {
  if(drag){
  var dX=e.pageX-old_x,
      dY=e.pageY-old_y;
  var shiftX = dX*2*Math.PI/canvas.width;
  var shiftY = dY*2*Math.PI/canvas.height;
  console.log('shiftX: ',shiftX, 'shiftY: ', shiftY, 'firstMove: ',firstMove);
  if(firstMove){
    if(Math.abs(shiftX) > Math.abs(shiftY)){
      lockX = true; lockY = false;
    }else{
      lockY = true; lockX = false;
    }
    firstMove = false;
  }
  console.log('lockX: ',lockX, 'lockY: ',lockY);

  if(leftClick && selected_background){
    //pan camera
    console.log("pan camera");
    for(var i = 0; i<modelObjects.length; i++){
      if(lockX){
        modelObjects[i].cameraTranslate(-shiftX * 0.20,0,0);
      }
      else if(lockY){
        modelObjects[i].cameraTranslate(0,shiftY * 0.20,0);
      }
    }
  }
  else if(rightClick && selected_background){
    //rotate camera
    console.log("rotate camera");
    console.log('lockX: ',lockX, 'lockY: ',lockY);
    for(var i = 0; i<modelObjects.length; i++){
      if(lockX){
        modelObjects[i].cameraRotate(-dX,0,1,0);
    }
    else if(lockY){
        modelObjects[i].cameraRotate(-dY,1,0,0);
    }
    }
  }
  else if(leftClick && selected_object){
    // use tool
    console.log("use tool");
    if (activeTool == 0){
        modelObjects[activeObject].translate(shiftX * 0.20, -shiftY * 0.20, 0.0);
        uPLightTMatrix.translate(shiftX * 0.20, -shiftY * 0.20, 0.0);
    }  else if ((activeTool == 1) && (activeObject != 0)) {
      //ROTATE
      modelObjects[activeObject].rotate(dX,0,1,0);
      modelObjects[activeObject].rotate(dY,1,0,0);
    } else if ((activeTool == 2) && (activeObject != 0)) {
      //SCALE
      var scalefactor = Math.sqrt(Math.pow(shiftX ,2) + Math.pow(shiftY ,2));
      console.log('shiftX', shiftX);
      console.log('shiftY', shiftY);
      console.log('scalefactor', scalefactor);
      if (shiftY > 0){
        zoomInEvent();
      } else if(shiftY < 0){
        zoomOutEvent();
      }
    }

  }
 /*
  if (!drag) return false;
  var dX=e.pageX-old_x,
      dY=e.pageY-old_y;
  rotateOffsetDraw = 25 * dX*2*Math.PI/canvas.width;

  modelObjects[activeObject].rotate(rotateOffsetDraw,0,1,0);
  modelObjects[activeObject].draw();
  modelObjects[activeObject].render();
  */
}
  old_x=e.pageX, old_y=e.pageY;
  e.preventDefault();
};
/*
var mouseScroll = function(e){
  console.log('scroll');
  //if(!wheelscroll) return false;
  if (e.wheelDelta >= 120)
      zoomInEvent();
  else if (e.wheelDelta <= -120)
      zoomOutEvent();
  return false;
};
*/

var adjustChangeColorVal = function(){
	var r_val = (document.getElementById( "adjustColorValR" ).value);
	var g_val = (document.getElementById( "adjustColorValG" ).value);
	var b_val = (document.getElementById( "adjustColorValB" ).value);
	var disp_col_string ="rgb("+String(r_val)+","+String(g_val)+","+String(b_val)+")";
	//console.log('col_string: ',disp_col_string);
	var myElement = document.querySelector("#displayChangeColorVal");
    myElement.style.backgroundColor = disp_col_string;
	//var displayColor = (document.getElementById( "displayChangeColorVal" );
	//console.log('color: ',r_val,g_val,b_val);
	colorChangeVal[0] = r_val/255.0;
	colorChangeVal[1] = g_val/255.0;
	colorChangeVal[2] = b_val/255.0;
}


var changeBackgroundColor = function(r,g,b){
  clearBackgroundColor[0] = r;
  clearBackgroundColor[1] = g;
  clearBackgroundColor[2] = b;
  gl.clearColor( r, g, b, 1.0 );
  //render();
}

var changeObjectColor = function(r,g,b){
  //gl.uniform4f(uObjectColor_loc,r,g,b,1.0);
  modelObjects[activeObject].objectColor = [r,g,b,1.0];
  modelObjects[activeObject].usingTexture = 0;
  modelObjects[activeObject].draw();
  modelObjects[activeObject].render();
  //draw();
  //render();
}
var applyObjectTexture = function(){
  console.log('applyObjectTexture');
  modelObjects[activeObject].usingTexture = 1;
  //modelObjects[activeObject].textureImage = newTextureImage;
  modelObjects[activeObject].textureImage = new Image();
  modelObjects[activeObject].textureImage.src = newTextureImage.src;
  console.log('modelObject[activeObject]',modelObjects[activeObject]);
}

function colorPick(){
	console.log("Called Color Pick");
	//gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.clearColor(0.0,0.0,1.0,1.0);
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.uniform1i(toggleObjectPicking_loc,1);

    for (var i = 0; i<modelObjects.length;i++){
      modelObjects[i].draw();
      modelObjects[i].render();
    }



    //modelObjects[activeObject].render();
    //render();

    var x = event.clientX;
    var y = canvas.height -event.clientY;

    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);

    for (var i = 0; i<modelObjects.length;i++){
      console.log('picking ',modelObjects[i].pickingColor, color, (color[1]/255.0))
      if(modelObjects[i].pickingColor[1]==(color[1]/255.0)){
        activeObject = i;
        drag=true;
        selected_object = true;
        if((activeTool == 3) && (activeObject != 0) && (leftClick == true)){
          changeObjectColor(colorChangeVal[0],colorChangeVal[1],colorChangeVal[2]);
        }
        else if ((activeTool == 4) && (activeObject != 0) && (leftClick == true)) {
          applyObjectTexture();
        }
        console.log('picked : ', activeObject);
        break;
      }
    }
     if (color[2]==255){
        selected_background = true;
        console.log("Picked Background");
      if ((activeTool==3) && (leftClick == true)){
  	    console.log("Picked Background: ChangeColor");
  		  changeBackgroundColor(colorChangeVal[0],colorChangeVal[1],colorChangeVal[2]);
      }
    }

   //gl.bindFramebuffer(gl.FRAMEBUFFER, null);

   gl.uniform1i(toggleObjectPicking_loc,0);
   gl.clearColor( clearBackgroundColor[0], clearBackgroundColor[1], clearBackgroundColor[2], 1.0 );
   gl.clear( gl.COLOR_BUFFER_BIT );
   gl.uniform3fv(thetaLoc, theta);

   //render();
   modelObjects[activeObject].render();

}


function switchTool(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
       console.log('left');
       if (activeObject > 0){
         activeObject = activeObject - 1;
       }
       console.log('activeObject: ',activeObject);
       document.getElementById('activeObject').innerHTML = 'Active Object: ' + activeObject;
    }
    else if (e.keyCode == '39') {
       console.log('right');// right arrow
       if ((activeObject < (modelObjects.length -1)) && (modelObjects.length != 0)){
         activeObject = activeObject + 1;
       }
       console.log('activeObject: ',activeObject);
       document.getElementById('activeObject').innerHTML = 'Active Object: '+ activeObject;
    }
    else if (e.keyCode == '81') {
        console.log('q'); activeTool = 0;
        console.log('activeTool: ',activeTool);
        document.getElementById('activeTool').innerHTML = 'Active Tool: Move';
    }
    else if (e.keyCode == '87') {
       console.log('w'); activeTool = 1;
       console.log('activeTool: ',activeTool);
       document.getElementById('activeTool').innerHTML = 'Active Tool: Rotate';
    }
    else if (e.keyCode == '69') {
       console.log('e'); activeTool = 2;
       console.log('activeTool: ',activeTool);
       document.getElementById('activeTool').innerHTML = 'Active Tool: Scale';
    }
    else if (e.keyCode == '82') {
       console.log('r'); activeTool = 3;
       console.log('activeTool: ',activeTool);
       document.getElementById('activeTool').innerHTML = 'Active Tool: Change Color';
    }
    else if (e.keyCode == '84') {
       console.log('t'); activeTool = 4;
       console.log('activeTool: ',activeTool);
       document.getElementById('activeTool').innerHTML = 'Active Tool: Apply Texture';
    }

}
