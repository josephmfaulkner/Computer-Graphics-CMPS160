//Opens the files and get's the data. Passes this data to the functions in
// "geometry-functions.js"
function handleFileSelect(evt) {

    var coorFile;
    var polyFile;

    var coorContents;
    var polyContents;

    var coorData;
    var polyData;

    var files = evt.target.files; // FileList object
    for(var i = 0; i< files.length; i++){
      if( (files[i]['name'].indexOf('.coor') > -1) ){
        coorFile = files[i];
      }
      if( (files[i]['name'].indexOf('.poly') > -1) ){
        polyFile = files[i];
      }
    }
    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li>', escape(f.name),'</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

    var coorFileReader = new FileReader();
    var polyFileReader = new FileReader();

    coorFileReader.readAsText(coorFile);
    coorFileReader.onload = function(evC){
      coorContents = evC.target.result;
      coorData = coorContents.toString().split("\n");
      polyFileReader.readAsText(polyFile);
    };
    polyFileReader.onload = function(evP){
      polyContents = evP.target.result;
      polyData = polyContents.toString().split("\n");
      handeFileData(coorData,polyData);
    };

  }


var handeFileData = function(vertArray,indxArray){
  points = [];
  //var colors = [];
  normalArr = [];
  normalArrAvgs = [];

  vertArr_temp = [];
  indxArr_temp = [];

  singleVertCount = 0;
  vertArr_i = 0;
  indxArr_i = 0;
  console.log("VERTARRAY: ",vertArray);
  console.log("INDXARRAY: ",indxArray);
  var vertCount = parseInt(vertArray[vertArr_i]); vertArr_i++ ;
  var indxCount = parseInt(indxArray[indxArr_i]); indxArr_i++ ;  console.log('vertCount',vertCount); console.log('indxCount: ', indxCount);
  vertArr_temp = processVertices(vertArray,vertCount);           console.log('PREVERT:',vertArr_temp);
  //adjust the geometry for the vector space
  adjustPoints();
  var normals = [];
  triangulatePolygons(indxCount,indxArray);                      console.log('indxArray: ',indxArray); console.log('VERT: ',vertArr_temp); console.log('INDX: ',indxArr_temp);
  objectVertArr = makeVertArray(vertArr_temp,indxArr_temp);      console.log('objectVertArr: ',objectVertArr);
  normals = calculateNormals(objectVertArr);                     console.log('normals: ', normals,normals.length);  console.log('objectVertArr: ',objectVertArr);
  normalArrAvgs = gouraudizeNormals(normals,indxArr_temp,singleVertCount);
  points = objectVertArr;
  normalArr = normals;
  NumVertices = points.length;
  var uvCoords = calculateUVCoords(objectVertArr);
  modelObject = new Model(points,normals,normalArrAvgs,NumVertices,uvCoords);
  modelObjects.push(modelObject);
  console.log(modelObject);
  startRender = true;
  //modelObject.draw();
  //modelObject.render();
  //draw();
  //render();
}

var handleTextureSelect = function(evt){
  var files = evt.target.files; // FileList object

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        /*
        var span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(span, null);
        */

        newTextureImage.src = e.target.result;
        newTextureImage.addEventListener('load', function() {
          console.log("loaded-texture: ",newTextureImage);
          //gl.bindTexture(gl.TEXTURE_2D, texture);
          //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
          //gl.generateMipmap(gl.TEXTURE_2D);

          //animate(0);
        });

      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }


}
