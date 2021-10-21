
const divWidth = document.getElementById("divChord").offsetWidth
const divHeight = document.getElementById("divChord").offsetHeight

const opacityDefault = 0.8
const width = divWidth
const height = divWidth

const outerRadius = Math.min(width, height) * 0.5 - 50
const innerRadius = outerRadius - 20

const ribbon = d3.ribbon()
                 .radius(innerRadius - 4)
                 
const arc = d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius)
const chord = d3.chord()
                .padAngle(0.05)
                .sortSubgroups(d3.descending)

const mainChord = d3.select( "#mainChord" );

const svg = mainChord.attr('width', width)
                     .attr('height', height)
                     .attr("viewBox", [-width / 2, -height / 2, width, height])
                     .attr("font-size", 10)
                     .attr("font-family", "sans-serif");

const canvas = svg.append("g")
                  .attr("fill-opacity", 0.67)
                  .attr("id", "canvas")

//color = d3.scaleOrdinal( d3.schemeBrBG[11] )
color = d3.scaleOrdinal(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"])


const defs = svg.append("defs")


function getGradID(d)
{ 
  return "linkGrad-" + d.source.index + "-" + d.target.index; 
}


function drawChord( chordData,  labelData)
{
  const chords = chord( chordData );

  var arcPath = svg.selectAll( ".arcPath" )
                    .data( chords.groups )

  arcPath.exit().remove()

  arcPathNew = arcPath.enter()
                      .append("path")
                      .attr("class","arcPath")
                      .attr("id", (d,i) => "arcPath" + i ) 
                      .attr("fill", (d,i) => color( i ))
                      .attr("stroke", (d,i) => d3.rgb(color( i )).darker())

  d3.selectAll(".arcPath").transition().duration(1500).attr("d", arc )

  var arcLabel = svg.selectAll( ".arcLabel" )
                    .data( chords.groups )

  arcLabel.exit().remove()

  arcLabel.enter()
          .append("text")
          .attr( "class","arcLabel" )

  svg.selectAll( ".arcLabel" )
     .each( function(d) {d.angle = (d.startAngle + d.endAngle ) / 2 ;})
     .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + (innerRadius + (d.angle > Math.PI ? 60 : 30)) + ")"
          + (d.angle > Math.PI ? "rotate(180)" : ""); })
     .text( (d, i) =>  labelData[ i ] ) 
     .style("fill", "#35978f")
     .style('font-weight', 'bold');

  var ribbons = d3.select("#canvas").selectAll("path")
                                    .data( chords, getGradID )

  ribbons.exit().remove()
                      
  ribbons.enter().append( "path" )
                 .attr( "class", "ribbons" )
                 .style("fill", d =>  "url(#" + getGradID(d) + ")" )
                 .on("mouseover", ribbon => visibleRibbonTooltip( ribbon, 
                                                                  labelData  ))
                 .on("mouseout", () => hideToolTip());


  d3.select("#canvas").selectAll("path")
                      .transition()
                      .duration(1500)
                      .attr('d', ribbon )
                          

  //Create the gradients definitions for each chord
  const gradsDataJoin = defs.selectAll("linearGradient")
                                          .data( chords, getGradID )

  gradsDataJoin.exit().remove()

  let gradsDataJoinEnter = gradsDataJoin.enter().append("linearGradient")
                                        .attr("id", getGradID)
                                        .attr("gradientUnits", "userSpaceOnUse")

  gradsDataJoinEnter.append( "stop" )
                    .attr("offset", "0%")
                    .attr( "class", "gradient_source")
                    .attr("stop-color", d => color( d.source.index ) );

  gradsDataJoinEnter.append( "stop" )
                    .attr("offset", "100%")
                    .attr( "id", "gradient_target")
                    .attr("stop-color", d => color( d.target.index ) );


  let grads = d3.selectAll( "linearGradient" )
    .attr("x1", d => innerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2) )
    .attr("y1", d => innerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2) )
    .attr("x2", d => innerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2) )
    .attr("y2", d => innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2) )


}


