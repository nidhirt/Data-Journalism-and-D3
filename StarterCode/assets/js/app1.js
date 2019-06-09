// @TODO: YOUR CODE HERE!

function makeResponsive() {

var svgWidth = 960;
var svgHeight = 500;

var margin = {

    top : 20,
    right : 40,
    bottom : 60,
    left: 100,
}

var width = svgWidth -margin.left-margin.right;
var height = svgHeight -margin.top-margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
 // ==============================

var svg = d3.select("body")
            .append("svg")
            .attr("width",svgWidth)
            .attr("height",svgHeight);

//create chargroupand move the start point there
 // ==============================

var chartGroup = svg.append("g")
                .attr("transform",`translate (${margin.left}, ${margin.top})`);


d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .style("opacity",0)

//Import Data
 // ==============================

//d3.csv("./data/data.csv",function(error, healthdata){

d3.csv("assets/data/data.csv").then(function(healthdata,error) {

    console.log(healthdata);

    
    //if(error) throw error;

   // console.log(healthdata);

// Step 1: Parse Data/Cast as numbers
 // ==============================

    healthdata.forEach(function(data){

    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
});

  // Step 2: Create scale functions


    var xMin = d3.min(healthdata,function(d){
        return d.poverty;

    });

    var xMax = d3.max(healthdata,function(d){
        return d.poverty;
        
    });

    var yMin = d3.min(healthdata,function(d){
        return d.healthcare;
        
    });

    var yMax = d3.max(healthdata,function(d){
        return d.healthcare;


    });

  var xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0,width]);
  var yScale = d3.scaleLinear()
            .domain([yMin,yMax])
            .range([height,0]);

    
    // Step 3: Create axis functions
     // ==============================

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    

    console.log(xMin);
    console.log(yMax);

    console.log(xScale(xMax));
    console.log(yScale(yMin));

    // Step 4: Append Axes to the chart
     // ==============================

    chartGroup.append("g")
            .attr("transform",`translate (0,${height})`)
            .call(bottomAxis);

    chartGroup.append("g")
            .call(leftAxis);


    // Step 5: Create Circles
     // ==============================

    var circleGroup = chartGroup.selectAll("circle")
                    .data(healthdata)
                    .enter()
                    .append("circle")
                    .attr("cx",d=>xScale(d.poverty))
                    .attr("cy", d=>yScale(d.healthcare))
                    .attr("r", "15")
                    //.attr("text-anchor","middle")
                    .attr("fill","blue")
                    .attr("color","white")
                    .attr("opacity",0.5)

                    .on("mouseout",function(data,index){

                    toolTip.hide(data);

        });

      // Step 6: Initialize tool tip
  // ==============================

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([60, -60])
        .html(function(d) {
        return (abbr + '%');
    });


    // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
  // ==============================

  circleGroup.on("click", function(data){
      toolTip.show(data);
    })

    // onmouseout event

    .on("mouseout",function(data,index){

        toolTip.hide(data);
    });

    // Create axes labels

    chartGroup.append("text")
    .style("font-size", "12px")
    //.attr("text-anchor","middle")
    //.attr("text-align","")
    .selectAll("tspan")
    .data(healthdata)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xScale(data.poverty);
        })
        .attr("y", function(data) {
            return yScale(data.healthcare);
        })
        .text(function(data) {
            return data.abbr;
        });
  
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+40)
      .attr("x", 0 - (height / 2))
      .attr("dy", " 1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");
  
    var xlabel= chartGroup.append("g")
                .attr("transform", `translate(${width / 2}, ${height + margin.top+30 })`);

    var povertyLabel = xlabel.append("text")
                .attr("x",0)
                .attr("y",0)
                .attr("class", "axisText")
                .text("In Poverty (%)");
    
      //.attr("x",0)
      //.attr("y",5)
      
      


});

}
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);