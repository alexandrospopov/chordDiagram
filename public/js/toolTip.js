function visibleRibbonTooltip( ribbon ){

  // Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
  // {
    // chordData = file[0].chordData
    // labelData = file[0].labelData
  
    let valuesStr = "Values : " + ribbon.source.value 
    if ( ribbon.source.value != ribbon.target.value ) {
      valuesStr += " / " + ribbon.target.value
    } 

    d3.select('.tooltip').style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    .html( "Links : " + getGradID( ribbon ) + "<br>"
           + valuesStr )
    .transition()
    .style("opacity", .9);
  
  // })
}

function visibleCityTooltip( d, tooltip, tripList ){
  tooltip.style("left", (d3.event.pageX + 5) + "px")
         .style("top", (d3.event.pageY - 28) + "px")
         .html( d.key + "<br>" + d.value.Geographie.Etat )
         .transition()
         .style("opacity", .9);
}

function hideToolTip(){ 
  d3.select('.tooltip').transition()
         .style("opacity", 0) 
         
}

var tooltip = d3.select( "body" )
                .append( "div" )
                .attr( "class", "tooltip" )
                .style( "opacity", 0);

