
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
  .attr("y", -20)
  .attr("dy", 15)
  .append("textPath")
    .attr("xlink:href", (d,i) =>  "#arcLabel_" + i )
    .text(function(chords, i){return labelData[i];})
    .style("fill", "darkblue")
    .style('font-weight', 'bold');


  const ribbons = svg.append("g")
      .attr("fill-opacity", 0.67)
    .selectAll("path")
    .data(chords)
    .enter().append("path")
      .attr("class", "ribbons")
      .attr("d", ribbon)
      .style("fill", function(d){ return "url(#" + getGradID(d) + ")"; })
      
  function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }

  //Create the gradients definitions for each chord
  const grads = svg.append("defs").selectAll("linearGradient")
    .data(chords)
    .enter().append("linearGradient")
    .attr("id", getGradID)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", function(d,i) { return innerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
    .attr("y1", function(d,i) { return innerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
    .attr("x2", function(d,i) { return innerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })
    .attr("y2", function(d,i) { return innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })

  //Set the starting color (at 0%)
  grads.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", function(d){ return color( d.source.index ); });

  //Set the ending color (at 100%)
  grads.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", function(d){ return color( d.target.index ); });

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


})
