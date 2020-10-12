// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("assets/data/data.csv").then(function(newsData) {

    // Format the data
    newsData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    // Create scaling functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d.poverty)-1, d3.max(newsData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d.smokes)-1, d3.max(newsData, d => d.smokes)])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    chartGroup.selectAll("circle")
    .data(newsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".25");

    // Append text
    chartGroup.selectAll(null)
    .data(newsData)
    .enter()
    .append("text")
    .text(function(d){return d.abbr}) 
    .attr("x", d => xLinearScale(d.poverty)-11)
    .attr("y", d => yLinearScale(d.smokes)+5)

    // Append x axis
    chartGroup.append("text")
    .attr("x", (width / 2))
    .attr("y", svgHeight - margin.bottom + 20)
    .classed("active", true)
    .text("Poverty(%)");

    // Append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Smokes(%)");
      });