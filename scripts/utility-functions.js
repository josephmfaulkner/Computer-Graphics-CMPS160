
/*UTILITY FUNCTIONS===============================================
Various functions that just make life a lot easier.
*/

// Setting up the shaders can be such a pain. Here's a function to
// take care of all that foo-foo drudgery
function initShaders(){
  var vertexShaderText = getShaderText('vertex-shader');
  var fragmentShaderText = getShaderText('fragment-shader');
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader,vertexShaderText);
  gl.shaderSource(fragmentShader,fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram( program );


}
// Calculates the array of vertex normals for a triangulated array of verticies
// all normals face one direction for each face (which is a triangle)
function calculateNormals(objectVertArr){
  //console.log('calculateNormals: ',objectVertArr);
  var newnormals = [];
  for (var i = 0; (i+2)<objectVertArr.length; i=i+3){
    var p0 = objectVertArr[i];
    var p1 = objectVertArr[i+1];
    var p2 = objectVertArr[i+2];  //console.log(i ,':', p0); console.log(i+1, ':', p1); console.log(i+2, ':',p2);
	var normal = calculateOneNormal(p0,p1,p2);
    //console.log('normal: ',normal);
    newnormals.push(normal);
	  newnormals.push(normal);
	  newnormals.push(normal);
   }
   //console.log('calculateNormals: ',objectVertArr);
   //console.log('newnormals: ',newnormals);
   return newnormals;
}

// Takes an array of Normals that are all facing the same direction
// for each face and adverages out the direction based on which sides
// overlap.
function gouraudizeNormals(normals,indxArr_temp,count){
  //console.log('normals: ',normals,normals.length);
  //console.log('indxArr_temp: ', indxArr_temp,indxArr_temp.length);
  //console.log('count: ',count);
  var indexedNormals = [];
  for(var i = 0; i< count; i++){
    indexedNormals.push([]);
  }
  for (var i = 0; i< indxArr_temp.length; i++){
    indexedNormals[indxArr_temp[i]-1].push(normals[i]);
  }
  //console.log('indexedNormals: ',indexedNormals);
  for (var i = 0; i< indexedNormals.length; i++){
    indexedNormals[i] = normalize(sumNormals(indexedNormals[i]));
  }
  //console.log('indexedNormals: ',indexedNormals);
  var newNormalsArray = [];
  for(var i = 0; i < indxArr_temp.length; i++){
    var newNormal = indexedNormals[indxArr_temp[i]-1];
    newNormalsArray.push(newNormal);
  }
  //console.log('newNormalsArray: ', newNormalsArray, newNormalsArray.length);
  return newNormalsArray;
}
// Takes an array of arrays that each specifies a 3 dimentinal array
//
function sumNormals(arrayOfNormals){
  var sum = [0,0,0];
  for (var i = 0; i<arrayOfNormals.length;i++){
    sum[0] = arrayOfNormals[i][0] + sum[0];
    sum[1] = arrayOfNormals[i][1] + sum[1];
    sum[2] = arrayOfNormals[i][2] + sum[2];
  }
  return sum;
}
// Takes in 3 points and calculates the corresponding normal vector to the plane
function calculateOneNormal(p0,p1,p2){                         //console.log('p0',p0,'p1',p1,'p2',p2);
	var v1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];      //console.log('v1: ',v1);
  var v2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];    //console.log('v2: ',v2);
	var crossVector = crossProduct(v1,v2);
	return normalize(crossVector);
}

function calculateUVCoords(objectVertArr){
  var UVCoords = [];
  for(var i = 0; i<objectVertArr.length; i++){
    //console.log('vert: ',objectVertArr[i]);
    var x = objectVertArr[i][0]; var y = objectVertArr[i][1]; var z = objectVertArr[i][2];
    //console.log('x:',x,' y:',y,' z:',z);
    var row = Math.sqrt(Math.abs(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2)));
    //console.log('calcphi: ','z/row:',z/row,'acos(z/row)',(Math.acos(z/row)));
    var phi = Math.acos(z/row);
    //console.log('calctheta: ','sinphi',Math.sin(phi),'row*SinPhi',((row*(Math.sin(phi)))),'x/row*SinPhi',(x/(row*(Math.sin(phi)))));
    var theta = Math.acos(x/(row*(Math.sin(phi))));
    //console.log('row: ',row,'phi: ',phi,'theta: ',theta);
    var u = theta/(2*Math.PI);
    var v = phi/(Math.PI);
    if (isNaN(u)){
      u = 0.0;
    }
    if (isNaN(v)){
      v = 0.0;
    }
    //console.log('u: ',u,'v: ',v);
    UVCoords.push([u,v]);
  }
  return UVCoords;
}
// Get's the text for the shader from the HTML file. It's a lot easier to
// Store the shader's as an actual script.
function getShaderText(id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }
  return theSource;
}

// Takes an array of arrays and flattens out the data into a 1d array
function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}
// Self explanitory. Takes in 2 vectors specified by arrays and
// returns the cross product
function crossProduct(vec3_1,vec3_2){
	var U2V3 = (vec3_1[1]) * (vec3_2[2]);
	var U3V2 = (vec3_1[2]) * (vec3_2[1]);

	var U3V1 = (vec3_1[2]) * (vec3_2[0]);
	var U1V3 = (vec3_1[0]) * (vec3_2[2]);

	var U1V2 = (vec3_1[0]) * (vec3_2[1]);
	var U2V1 = (vec3_1[1]) * (vec3_2[0]);
	// u x v = [u2v3 - u3v2, u3v1 - u1v3, u1v2 - u2v1]

	return [(U2V3 - U3V2),(U3V1 - U1V3),(U1V2 - U2V1)];

}
// Self explanitory. Takes in 2 vectors specified by arrays and
// returns the dot product
function dotProduct(vec3_1, vec3_2){
    //x                       // y                       //z
	return (vec3_1[0] * vec3_2[0]) + (vec3_1[1] * vec3_2[1]) + (vec3_1[2] * vec3_2[2]);
}
// Not entirely nessesary since glsl already has it's own normalize function
// anyway, here it is anyway :D
function normalize(vec3){
	if ((vec3[0]===0)&&(vec3[1]===0)&&(vec3[2]==0)){
		return [0,0,0];
	}
	var mag = Math.sqrt(Math.abs(Math.pow(vec3[0],2) + Math.pow(vec3[1],2) + Math.pow(vec3[2],2)));
	return [vec3[0]/mag,vec3[1]/mag,vec3[2]/mag]
}
// Used for loading in the default pyramid. Note that the gourad normals are never calculated
// this is why only flat shading works on the pyramid
function loadObject(vertArr,indArr){
    //console.log('CALLED LOADOBJECT');
    NumVertices = 0;
    for ( var i = 0; i < indArr.length; ++i ) {
        points.push( vertArr[indArr[i]] );
    }
    normalArr = calculateNormals(points);
    normalArrAvgs = normalArr;
    NumVertices = points.length;
    //console.log('points: ',points);
}
