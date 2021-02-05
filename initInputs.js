


function updateParametersViz(){
  Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
{
  chordData = file[0].chordData
  labelData = file[0].labelData


  let showSelfLink = document.getElementById("cb_selfLink").checked 
 
  let affichageType = document.querySelector('input[name=affichageType]:checked').value

  console.log( affichageType )

  if ( !showSelfLink )
  {
    for (let i = 0; i < chordData.length; i++) 
    {
        chordData[ i ][ i ] = 0
    }
  }

  let sum = 0

  if ( affichageType == "logarithmique"){
    for (let i = 0; i < chordData.length; i++) {
      for (let j = 0; j < chordData.length; j++) {
        if (i != j &&  chordData[ i ][ j ] != 0 ){
          chordData[ i ][ j ] = Math.log( chordData[ i ][ j ] )
        }
      }
    }
  }
  else if ( affichageType == "relatif"){
    for (let i = 0; i < chordData.length; i++) {
      sum = 0 
      for (let j = 0; j < chordData.length; j++) {
        sum = sum + chordData[ i ][ j ]
      }
      if ( sum != 0 ){
      for (let j = 0; j < chordData.length; j++) {
        chordData[ i ][ j ] = Math.round( chordData[ i ][ j ] * 100 / sum )
      }
    }
    else{
      for (let j = 0; j < chordData.length; j++) {
        chordData[ i ][ j ] = 0
      }
    }
    }
  }
  console.log( chordData )
  drawChord( chordData, labelData )

})
}


d3.select("#cb_selfLink")
.on("click", updateParametersViz )


d3.select("#rb_lineaire")
.on("click", updateParametersViz )
d3.select("#rb_logarithmique")
.on("click", updateParametersViz )
d3.select("#rb_relatif")
.on("click", updateParametersViz )

function initializeAreaChoice( labelData )
{
  var divAreaChoice = d3.select('#areaChoice')

  var divAreaChoiceCheckBox = divAreaChoice.selectAll('.checkBoxDiv')
                                           .data( labelData ) 

  var divAreaChoiceCheckBoxEnter = divAreaChoiceCheckBox.enter()
                                                        .append('div')

  divAreaChoiceCheckBoxEnter.append('input')
                            .attr('class','checkBoxDiv_cb')
                            .attr('type','checkbox')
                            .attr('id', d => 'cb_'+ d )
                            .attr('name', d=>  d )
                            .attr('value', d=> d )
                            .attr('checked', "checked" )

  divAreaChoiceCheckBoxEnter.append('label')
                            .attr( 'class','checkBoxDiv_label' )
                            .html( d => "   " + d)
}



// const widthBrush = 3 * width / 4 - 30 ;
// const heightBrush = 150;

// var brushSvg = d3.select("#brushSvg")
//                  .attr( "width", widthBrush )
//                  .attr( "height", heightBrush  )
//                  .attr("transform", "translate(" + 30 + "," + 0 + ")")

// var brushRect = brushSvg.append("rect")
//                         .attr( "width", widthBrush )
//                         .attr( "height", heightBrush )
//                         .attr("fill", "#35978f" )

// var brush = d3.brushX() 
//               .extent([[0,0], [ widthBrush , heightBrush  ]])
//               .on("brush", brushed);

// var brushg = brushSvg.append("g")
//                      .attr("class", "brush")
//                      .call( brush ) 

// function brushed(){
// console.log( 'cii')
// }