


function dataWoSelfConnection( show ){
  Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
{
  chordData = file[0].chordData
  labelData = file[0].labelData


  if (show)
  {
    drawChord( chordData, labelData ) 
  }
  else
  {
    for (let i = 0; i < chordData.length; i++) 
    {
        chordData[ i ][ i ] = 0
    }
    drawChord( chordData, labelData )
  }
})
}


d3.select("#cb_selfLink")
.on("click", function(){
  this.checked ? dataWoSelfConnection( 1 ) : dataWoSelfConnection( 0 ) 
} )


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