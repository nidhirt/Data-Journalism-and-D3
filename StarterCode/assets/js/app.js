// @TODO: YOUR CODE HERE!

function makeResponsive() {

    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
      svgArea.remove();
    }
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
            .classed("svg", true)
            .attr("width",svgWidth)
            .attr("height",svgHeight)
            .attr("border",1)
            .attr("bordercolor","black");
            

//create chartgroup and move the start point there
 // ==============================

var chartGroup = svg.append("g")
                .attr("transform",`translate (${margin.left}, ${margin.top})`);

//Import Data
 // ==============================

d3.csv("assets/data/data.csv").then(function(healthdata,error) {

    console.log(healthdata);

// Step 1: Parse Data/Cast as numbers
 // ==============================

    healthdata.forEach(function(data){

    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.state = data.state;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smoke = +data.smoke
});

  // Step 2: Create scale functions
 // ==============================
    var xMin = d3.min(healthdata,d => (d.poverty-1));
    var xMax = d3.max(healthdata,(d=>d.poverty));
    var yMin = d3.min(healthdata,(d=>d.healthcare-1));
    var yMax = d3.max(healthdata,(d=>d.healthcare));

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

    //console.log(xScale(xMax));
    //console.log(yScale(yMin));

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
                    .attr("fill","#728FCE")
                    .attr("color","white")
                    .attr("opacity",0.8)
    
    var circleGroup = chartGroup.selectAll()
                    .data(healthdata)
                    .enter()
                    .append("text")
                    .attr("x", d=> xScale(d.poverty))
                    .attr("y", d=> yScale(d.healthcare))
                    .style("font-size", "12px")
                    .style("text-anchor","middle")
                    .style("fill","white")
                    .text(d=>  d.abbr);
                    //.attr("text-align","")

     // Step 6: Initialize tool tip
    // ==============================

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .style("display", "block")
        .html(function(d) {
             return (`${d.state} <br> Poverty : ${d.poverty} <br> Lack of Healthcare : ${d.healthcare}`)
            
            });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================

    circleGroup.on("click", function(data){
    toolTip.show(data,this);
     })

     .on("mouseout", function(data, index) {
            toolTip.hide(data);
         });

    // Create axes labels
    // ==============================
    chartGroup.append("text")
      .style("font-weight","bold")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+40)
      .attr("x", 0 - (height / 2))
      .attr("dy", " 1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");
  
    var xlabel= chartGroup.append("g")
                .attr("transform", `translate(${width / 2}, ${height + margin.top+30 })`);

    var povertyLabel = xlabel.append("text")
                .style("font-weight","bold")
                .attr("x",0)
                .attr("y",0)
                .attr("class", "axisText")
                .text("In Poverty (%)");

    }); //CSV function exit
}
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);