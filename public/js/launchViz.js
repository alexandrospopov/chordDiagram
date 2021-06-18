var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    const dataURL = reader.result;
    json = JSON.parse( dataURL )
    updateViz( json )
    
  };
  reader.readAsText(input.files[0]);
};


function initializeViz(){

  Promise.all([ d3.json( fileToLoad ), ]).then(function( file ) 
  {
    chordDataRaw = file[0].chordData;
    labelDataRaw = file[0].labelData;

    document.getElementById("cb_selfLink").checked = true;
    document.getElementById("rb_lineaire").checked = true;
  
    drawChord( chordDataRaw, labelDataRaw )
    initializeAreaChoice( labelDataRaw )
    initializeBrush( chordDataRaw )
  
  })
}

var updateViz = function( file ){

  chordDataRaw = file.chordData
  labelDataRaw = file.labelData

  document.getElementById("cb_selfLink").checked = true;
  document.getElementById("rb_lineaire").checked = true;

  drawChord( chordDataRaw, labelDataRaw )
  initializeAreaChoice( labelDataRaw )
  updateBrush( chordDataRaw )

  
}

initializeViz()