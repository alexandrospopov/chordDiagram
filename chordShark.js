// toy diagram : https://observablehq.com/@littlenanopichu/chord-diagram
// https://observablehq.com/@robert-moore/shark-tank
// https://observablehq.com/@xuhuaking/chord-diagram

// Data : [
//   0 : [ 0 : 1, 1 : 2, ..., 7 : 4 ],
//   1 : [ 0 : 2, 1 : 0, ..., 7: 1 ],
//   ...
//   7 : [ 0 : 4, 1 : 1, 7 : 2 ]
// ]




chordChart = {

  // const chordData = chordMatrix
  // const opacityDefault = 0.8
  // const width = 640
  // const height = Math.min(640, width)

  // const outerRadius = Math.min(width, height) * 0.5 - 50
  // const innerRadius = outerRadius - 20

  const color = d3.scaleOrdinal()
    .domain(sharks)
    .range(['#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'].reverse())
    // .range(['#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016450'])

  // const ribbon = d3.ribbon()
  //                  .radius(innerRadius - 4)
  // const arc = d3.arc()
  //               .innerRadius(innerRadius)
  //               .outerRadius(outerRadius)
  // const chord = d3.chord()
  //                 .padAngle(0.05)
  //                 .sortSubgroups(d3.descending)
  
  function groupTicks(d, step) {
    const k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map(value => {
      return {value: value, angle: value * k + d.startAngle};
    });
  }

  // const formatValue = d => d
  // const svg = d3.create("svg")
  //     .attr('width', width)
  //     .attr('height', height)
  //     .attr("viewBox", [-width / 2, -height / 2, width, height])
  //     .attr("font-size", 10)
  //     .attr("font-family", "sans-serif");

  const chords = chord(chordData);
  
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
    .attr("stop-color", function(d){ return color(d.source.index); });

  //Set the ending color (at 100%)
  grads.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", function(d){ return color(d.target.index); });

  const group = svg.append("g")
    .selectAll("g")
    .data(chords.groups)
    .join("g")
    .attr('class', 'group')
    .on("mouseover", fade(.1))
    .on("mouseout", fade(opacityDefault));

  group.append("path")
      .attr("fill", d => color(d.index))
      .attr("stroke", d => d3.rgb(color(d.index)).darker())
      .attr("d", arc)
  
  group.append("path")
	.style("fill", function(d) { return color(d.index); })
	.attr("d", arc)
	.each(function(d,i) {
		//Search pattern for everything between the start and the first capital L
		var firstArcSection = /(^.+?)L/; 	

		//Grab everything up to the first Line statement
		var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
		//Replace all the comma's so that IE can handle it
		newArc = newArc.replace(/,/g , " ");
		
		//If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
		//flip the end and start position
    const centerAngle = (d.endAngle + d.startAngle) / 2
		if (centerAngle > 90*Math.PI/180 && centerAngle < 270*Math.PI/180) {
			var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
				middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
				endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
			//Flip the direction of the arc by switching the start en end point (and sweep flag)
			//of those elements that are below the horizontal line
			var newStart = endLoc.exec( newArc )[1];
			var newEnd = startLoc.exec( newArc )[1];
			var middleSec = middleLoc.exec( newArc )[1];
			
			//Build up the new arc notation, set the sweep-flag to 0
			newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
		}
		
		//Create a new invisible arc that the text can flow along
		svg.append("path")
			.attr("class", "hiddenArcs")
			.attr("id", "arc"+i)
			.attr("d", newArc)
			.style("fill", "none");
	});
  
  group.append("text")
    .attr("class", "titles")
    .attr("dy", function(d,i) { 
    const centerAngle = (d.endAngle + d.startAngle) / 2          
    return (centerAngle > 90*Math.PI/180 && centerAngle < 270*Math.PI/180 ? 30 : -23); })
     .append("textPath")
    .attr("startOffset","50%")
    .style("text-anchor","middle")
    .attr("xlink:href",function(d,i){return "#arc"+i;})
    .text(function(d,i){ return sharks[i]; })
    .style('font-size', 12)
    .style('font-weight', 'bold')
    .style('fill', '#656')
	

  const groupTick = group.append("g")
    .selectAll("g")
    .data(d => groupTicks(d, 1))
    .join("g")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

  groupTick.append("line")
      .attr("stroke", "#000")
      .attr("x2", 6);

  groupTick
    .filter(d => d.value % 5 === 0)
    .append("text")
      .attr("x", 8)
      .attr("dy", ".35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => formatValue(d.value));

  svg.append("g")
      .attr("fill-opacity", 0.67)
    .selectAll("path")
    .data(chords)
    .join("path")
  	  .on("mouseover", mouseoverChord)
	    .on("mouseout", mouseoutChord)
      .attr('class', 'chord')
      .attr("d", ribbon)
  	  .style("fill", function(d){ return "url(#" + getGradID(d) + ")"; })
      // .attr("fill", d => color(d.target.index))
      // .attr("stroke", d => d3.rgb(color(d.target.index)).darker());
  
  function fade(opacity) {
    return function(d,i) {
      svg.selectAll("path.chord")
          .filter(function(d) { return d.source.index !== i && d.target.index !== i; })
      .transition()
          .style("opacity", opacity);
    };
  }
  //Highlight hovered over chord
function mouseoverChord(d,i) {
  
	//Decrease opacity to all
	svg.selectAll("path.chord")
		.transition()
		.style("opacity", 0.1);
	//Show hovered over chord with full opacity
	d3.select(this)
		.transition()
    .style("opacity", 1);
}//mouseoverChord

//Bring all chords back to default opacity
function mouseoutChord(d) {
    //Set opacity back to default for all
    svg.selectAll("path.chord")
      .transition()
      .style("opacity", opacityDefault);
  }

  return svg.node();
}