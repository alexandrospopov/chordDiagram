function visibleRibbonTooltip( ribbon, labelData ){

    let valuesStr = "Values : " + ribbon.source.value 
    if ( ribbon.source.value != ribbon.target.value ) {
      valuesStr += " -> " + ribbon.target.value
    } 

    let linkStr  = "Link : " + labelData[ ribbon.source.index ] + 
                   " -> " + labelData[ ribbon.target.index ]  

    d3.select('.tooltip').style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    .html( linkStr + "<br>" + valuesStr )
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

