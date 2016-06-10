/*PROCESS GEOMETRY ===========================================
These functions process the geometric data specifying the objects
once the data is actually loaded.
*/
function processVertices(vertArray,vertCount){
  var vertArrNew = [];
  var firstLine = true;
  for( var vertArr_i = 1; vertArr_i <= vertCount; vertArr_i++){
    var lineSplit = (vertArray[vertArr_i]).split(',').slice(1);  //console.log('parseLine: ',lineSplit);
    var line_x = parseFloat(lineSplit[0]);
    var line_y = parseFloat(lineSplit[1]);
    var line_z = parseFloat(lineSplit[2]);
    // Find the extreme values for the coordinates.
    if (firstLine){
    xMin = line_x; xMax = line_x;
    yMin = line_y; yMax = line_y;
    zMin = line_z; zMax = line_z;
    }
    firstLine = false;

    if(line_x < xMin) xMin = line_x;
    if(line_x > xMax) xMax = line_x;
    if(line_y < yMin) yMin = line_y;
    if(line_y > yMax) yMax = line_y;
    if(line_z < zMin) zMin = line_z;
    if(line_z > zMax) zMax = line_z;
    //console.log('MIN: ',xMin,yMin,zMin);
    //console.log('MAX: ',xMax,yMax,zMax);
    vertArrNew.push([line_x,line_y,line_z,1]);
  }
  // Use the extremes found to derive the offset values so that the
  // obect shows up on the screen centered and scaled
  xOffset = (xMax + xMin)/2;
  yOffset = (yMax + yMin)/2;
  zOffset = (zMax + zMin)/2;                                  //console.log('offset: ',xOffset,yOffset,zOffset);
  var x_scale = Math.abs(xMax-xMin);
  var y_scale = Math.abs(yMax-yMin);
  var z_scale = Math.abs(zMax-zMin);                          //console.log("SCALE: ",x_scale,y_scale,z_scale);
  scaleOffset = Math.max(x_scale,Math.max(y_scale,z_scale));

  //console.log('OFFSET: ',xOffset,yOffset,zOffset,'scale:',scaleOffset);
  return vertArrNew;
}

function makeVertArray(vertArr_temp,indxArr_temp){
  var newVertArray = [];
  for( var i = 0; i<indxArr_temp.length;i++){
    var curr_vertex = vertArr_temp[indxArr_temp[i]-1];
    newVertArray.push(curr_vertex);
  }
  return newVertArray;
}

function adjustPoints(){
  for (var i = 0; i < vertArr_temp.length; i++){
    vertArr_temp[i][0] = (vertArr_temp[i][0]-xOffset)/scaleOffset;
    vertArr_temp[i][1] = (vertArr_temp[i][1]-yOffset)/scaleOffset;
    vertArr_temp[i][2] = (vertArr_temp[i][2]-zOffset)/scaleOffset;
  }
}
//Takes in an array of verticies defining an object and triangulates the
// polygons. This simple method assumes that all the polygons specified are
// just simple convex shapes (square, hexagon, etc )
function triangulatePolygons(indxCount,indxArray){
  for( ; indxArr_i <= indxCount; indxArr_i++){
    var lineSplit = (indxArray[indxArr_i]).split(' ').slice(1);   //console.log('linesplit',lineSplit);
    var indxLine = [];
    for (var i = 0; i<lineSplit.length; i++){
    	if (lineSplit[i] != ""){
        if(singleVertCount < parseInt(lineSplit[i])){
          singleVertCount = parseInt(lineSplit[i]);
        }
    		indxLine.push(parseInt(lineSplit[i]));
    	}
    }
    //console.log("INDXLINE: ",indxLine);

    for(var i = 1; (i + 1) < indxLine.length; i++){
      indxArr_temp.push(indxLine[0]);
      indxArr_temp.push(indxLine[i]);
      indxArr_temp.push(indxLine[i+1]);
    }
  }
}

function loadObject(vertArr,indArr){
    //console.log('CALLED LOADOBJECT');
    NumVertices = 0;
    for ( var i = 0; i < indArr.length; ++i ) {
        points.push( vertArr[indArr[i]] );
    }
    normalArr = calculateNormals(points);
    normalArrAvgs = normalArr;
    var uvCoords = calculateUVCoords(points);
    NumVertices = points.length;
    console.log('points: ',points);
    var newModel = new Model(points,normalArr,normalArr,NumVertices,uvCoords);
    modelObjects.push(newModel);
}
