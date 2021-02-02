
const opacityDefault = 0.8
const width = 640
const height = Math.min(640, width)

const outerRadius = Math.min(width, height) * 0.5 - 50
const innerRadius = outerRadius - 20

Promise.all([ d3.json( "data.json" ), ]).then(function( file ) 
{
  chordData = file[0].chordData
  labelData = file[0].labelData
  console.log( chordData, labelData )
})
