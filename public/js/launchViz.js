
var json = []

var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    const dataURL = reader.result;
    json = JSON.parse( dataURL )
    initializeViz(json)
    
  };
  reader.readAsText(input.files[0]);
};

 
var start = function( processAdvancement )
{

d3.json( "ExistingKeywordsDictionnary.json" ).then( 
  data => { 
    render( data );
    interaction( processAdvancement )
  }
)
}


var initializeViz = function( file ){

  console.log( file )
  
  chordData = file.chordData
  labelData = file.labelData

  document.getElementById("cb_selfLink").checked = true;
  document.getElementById("rb_lineaire").checked = true;

  drawChord( chordData, labelData )
  initializeAreaChoice( labelData )
  initializeBrush( chordData )
  
}