
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

color = d3.scaleOrdinal( d3.schemeBrBG[11] )

// chordDataModified = chordData
// for (let i = 0; i < chordData.length; i++) {
//     chordDataModified[ i ][ i ] = 0
// }


function initializeChord(){

Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
{
  chordData = file[0].chordData
  labelData = file[0].labelData

  drawChord( chordData, labelData )
  initializeAreaChoice( labelData )

})
}

function drawChord( chordData,  labelData)
{
  var chords = chord( chordData );
  
  const group = svg.selectAll("g")
                   .data(chords.groups)
                   .enter().append("g");

  const arcLabel = group.append("path")
                        .attr("class", "arcLabel")
                        .attr("d", arc)
                        .attr("id", (d,i) => "arcLabel_" + i ) 
                        .attr("fill", (d,i) => color( i ))
                        .attr("stroke", (d,i) => d3.rgb(color( i )).darker())

  const ribbons = svg.append("g")
                       .attr("fill-opacity", 0.67)
                     .selectAll("path")
                     .data(chords)
                     .enter().append("path")
                       .attr("class", "ribbons")
                       .attr("d", ribbon)
                       .attr("originalValue", d =>  d.source.value )
                       .style("fill", d =>  "url(#" + getGradID(d) + ")" )
      
  function getGradID(d){ 
    return "linkGrad-" + d.source.index + "-" + d.target.index; }

  //Create the gradients definitions for each chord
  const grads = svg.append("defs").selectAll("linearGradient")
    .data(chords)
    .enter().append("linearGradient")
    .attr("id", getGradID)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", d => innerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2) )
    .attr("y1", d => innerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2) )
    .attr("x2", d => innerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2) )
    .attr("y2", d => innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2) )

  //Set the starting color (at 0%)
  grads.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d => color( d.source.index ) );

  //Set the ending color (at 100%)
  grads.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d => color( d.target.index ) );

  group.append("text")
    .attr("x", 2)
    .attr("dy", -3)
    .append("textPath")
      .attr("xlink:href", (d, i) =>  "#arcLabel_" + i )
      .text( (d, i) =>  labelData[ i ] ) 
      .style("fill", "#35978f")
      .style('font-weight', 'bold');

}

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

// d3.select("#cb_selfLink")
//   .on("click", function() {
//       d3.selectAll(".ribbon"). 
//       let currentVisibility = this.checked ? "visible" : "hidden";
//       d3.selectAll('.marker').attr('visibility', currentVisibility)
// });

initializeChord()