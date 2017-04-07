
/*
    This is a heatmap of global temperature variation by month over time.

    The Y axis will be month, and the X axis will be time.

    While this doesn't present a continuous time axis by connecting January to December, it does allow
    the comparison between months for each year, which is more the point.

    Here are the user stories:

    User Story: I can view a heat map with data represented both on the Y and X axis.
    User Story: Each cell is colored based its relationship to other data.

    I'm going to try to use a linear scale for the X and Y axes, but I may switch to scaleBand later on.
*/

// Select the svg element
let svg = d3.select('svg');

// Define constants
let margin = {top: 70, right: 20, bottom: 70, left: 70};
let width = +svg.attr('width');
let height = +svg.attr('height');

// Define url
let URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// Get data with callback
d3.json(URL, function(error, data) {

    // Error check
    if (error) throw error;

    // Define scales for x and y
    let x = d3.scaleBand()
                .domain(data.monthlyVariance.map(d => d.year))
                .rangeRound([margin.left, width - margin.right])
    let y = d3.scaleBand()
                .domain([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

    y.rangeRound([height - margin.bottom, margin.top])

    console.log(y(2));
    // Add data into the svg with correct coordinates
    let heatmap = svg.selectAll('g')
                        .data(data.monthlyVariance)
                        .enter().append('g')
                        .attr('transform', d => 'translate(' + x( +d.year) + ',' + y( +d.month) + ')')

    // Add rectangle for each
    heatmap.append('rect')
                .attr('width', x.bandwidth())
                .attr('height', y.bandwidth())
                .style('fill', d => 'rgb(' + (+d.variance * 50 + 100) + ', 0, 0)' )
    // Add tooltip

    // Create x axis

    // Create y axis

    // Add labels

});