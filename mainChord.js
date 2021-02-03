
const opacityDefault = 0.8
const width = 640
const height = Math.min(640, width)

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

Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
{
  chordData = file[0].chordData
  labelData = file[0].labelData
  console.log( chordData, labelData )

  color = d3.scaleOrdinal( d3.schemeBrBG[11] )

  chordDataModified = chordData
  for (let i = 0; i < chordData.length; i++) {
      chordDataModified[ i ][ i ] = 0
  }

  var chords = chord( chordDataModified );
  
  const group = svg.selectAll("g")
                   .data(chords.groups)
                   .enter().append("g");

  const arcLabel = group.append("path")
                        .attr("class", "arcLabel")
                        .attr("d", arc)
                        .attr("id", (d,i) => "arcLabel_" + i ) 
                        .attr("fill", d => color(d.index))
                        .attr("stroke", d => d3.rgb(color(d.index)).darker())

  group.append("text")
  .attr("x", 2)
  .attr("dy", 15)
  .append("textPath")
    .attr("xlink:href", (d,i) =>  "#arcLabel_" + i )
    .text(function(chords, i){return labelData[i];})
    .style("fill", "white"); 

  const ribbons = svg.append("g")
      .attr("fill-opacity", 0.67)
    .selectAll("path")
    .data(chords)
    .enter().append("path")
      .attr("class", "ribbons")
      .attr("d", ribbon)
 

})
