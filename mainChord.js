
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



// const formatValue = d => d
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

  const chords = chord(chordData);

  const group = svg.append("g")
                   .selectAll("g")
                   .data(chords.groups)
                   .join("g")
                   .attr('class', 'group')

  group.append("path")
       .attr("d", arc)

  svg.append("g")
     .attr("fill-opacity", 0.67)
      .selectAll("path")
      .data(chords)
      .join("path")
        .attr('class', 'chord')
        .attr("d", ribbon)
        // .style("fill", function(d){ return "url(#" + getGradID(d) + ")"; })
        // .attr("fill", d => color(d.target.index))
        // .attr("stroke", d => d3.rgb(color(d.target.index)).darker());

})
