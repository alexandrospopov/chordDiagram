var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    const dataURL = reader.result;
    json = JSON.parse( dataURL )
    updateViz(json)
    
  };
  reader.readAsText(input.files[0]);
};


function initializeViz(){

  Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
  {
    chordData = file[0].chordData
    labelData = file[0].labelData

    document.getElementById("cb_selfLink").checked = true;
    document.getElementById("rb_lineaire").checked = true;
  
    drawChord( chordData, labelData )
    initializeAreaChoice( labelData )
    initializeBrush( chordData )
  
  })
}

var updateViz = function( file ){

  chordData = file.chordData
  labelData = file.labelData

  document.getElementById("cb_selfLink").checked = true;
  document.getElementById("rb_lineaire").checked = true;

  drawChord( chordData, labelData )
  initializeAreaChoice( labelData )
  
}

initializeViz()