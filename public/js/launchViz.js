
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

  initializeViz()

