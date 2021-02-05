
function initializeViz(){

  Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
  {
    chordData = file[0].chordData
    labelData = file[0].labelData
  
    drawChord( chordData, labelData )
    initializeAreaChoice( labelData )
  
  })
  }

  initializeViz()
