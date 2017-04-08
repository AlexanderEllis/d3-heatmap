
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
let months = ['1-indexed', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Define url
let URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// Define color mappings
let legend = [
    { varianceMax: 12.7, color:'rgb(158, 1, 66)'}, 
    { varianceMax: 11.6, color:'rgb(213,62,79)'},
    { varianceMax: 10.5, color:'rgb(244,109,67)'},
    { varianceMax: 9.4, color: 'rgb(253,174,97)'}, 
    { varianceMax: 8.3, color: 'rgb(254,225,139)'}, 
    { varianceMax: 7.2, color: 'rgb(255,255,191)'},
    { varianceMax: 6.1, color: 'rgb(230,245,152)'},
    { varianceMax: 5, color: 'rgb(171,221,164)'},
    { varianceMax: 3.9, color: 'rgb(102,194,165)'},
    { varianceMax: 2.7, color: 'rgb(50,136,189)'}, 
    { varianceMax: 0, color: 'rgb(94,79,162)'}
]

// Get data with callback
d3.json(URL, function(error, data) {

    // Error check
    if (error) throw error;

    // Access baseTemperature
    let baseTemperature = data.baseTemperature;

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
                .style('fill', d => colorMapper(d.variance + baseTemperature))
                .on('mouseover', function(d) {
                    d3.select('.tooltip')
                        .html(tooltipFormat(d, baseTemperature))
                        .style('visibility', 'visible')
                })
                .on('mousemove', function() {
                    d3.select('.tooltip')
                        .style('top', (d3.event.pageY - 120) + 'px')
                        .style('left', (d3.event.pageX + 10) + 'px')
                })
                .on('mouseleave', function() {
                    d3.select('.tooltip')
                        .style('visibility', 'hidden')
                })
                // Add hovering

    // Add tooltip
    d3.select('body').append('div')
        .attr('class', 'tooltip')
        .attr('width', '200px')
        .attr('height', '200px')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('background-color', '#333')
        .style('opacity', '0.8')
        .style('color', 'white')
        .style('font-size', '14px')
        .style('font-family', 'sans-serif')
        .style('visibility', 'hidden')
        .style('text-align', 'center')
        .style('padding', '0 5px 0 5px')

    // Create x axis

    // Create y axis

    // Add labels

});

function colorMapper(variance) {
    for (let i = 0; i < legend.length; i++) {
        if (variance >= legend[i].varianceMax) {
            return legend[i].color
        }
    }
}

function tooltipFormat(d, baseTemperature) {

    return `<h3> ${months[d.month]} ${ d.year }</h3>
    <p>Average temperature: ${ (d.variance + baseTemperature).toFixed(3) }℃</p>
    <p>Variance: ${d.variance}℃</p>` 
}