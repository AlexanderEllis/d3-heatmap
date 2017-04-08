
/*
    This is a heatmap of global temperature variation by month over time.
*/

// Select the svg element
let svg = d3.select('svg');

// Define constants
let margin = {top: 80, right: 20, bottom: 70, left: 80};
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
                .range([margin.left, width - margin.right])
                .paddingOuter(0.3)
    
    let y = d3.scaleBand()
                .domain([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
                .rangeRound([height - margin.bottom, margin.top]).align(1)

    // Add data into the svg with correct coordinates
    let heatmap = svg.selectAll('g')
                        .data(data.monthlyVariance)
                        .enter().append('g')
                        .attr('transform', d => 'translate(' + x( d.year) + ',' + y( d.month) + ')')

    // Add rectangle for each with hovering functionality
    heatmap.append('rect')
                .attr('width', x.bandwidth())
                .attr('height', y.bandwidth())
                .style('fill', d => colorMapper(d.variance + baseTemperature))
                .on('mouseover', function(d) {
                    d3.select(this).style('fill', '#000')

                    d3.select('.tooltip')
                        .html(tooltipFormat(d, baseTemperature))
                        .style('visibility', 'visible')
                })
                .on('mousemove', function() {
                    d3.select('.tooltip')
                        .style('top', (d3.event.pageY - 120) + 'px')
                        .style('left', (d3.event.pageX + 10) + 'px')
                })
                .on('mouseleave', function(d) {
                    d3.select(this).style('fill', colorMapper(d.variance + baseTemperature))

                    d3.select('.tooltip')
                        .style('visibility', 'hidden')
                })

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
        .style('border-radius', '4px')

    // Create x axis
    svg.append('g')
        .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
        .call(d3.axisBottom(x)
                    .tickValues(x.domain().filter(d => !(d % 10))))

    // Create y axis
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)')
        .attr('fill', 'white')
        .call(d3.axisLeft(y)
                    .tickFormat(m => months[m]))

    // Add labels

    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height - margin.bottom / 4) + ')')
        .attr('font-size', '20px')
        .text('Year')

    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / 1.5) + ')')
        .attr('font-size', '30px')
        .text('Monthly Global Land-Surface Temperature 1753 - 2017')

    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / 1.5 + 20) + ')')
        .attr('font-size', '14px')
        .text('Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average. Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07')

});

// Function for mapping continuous variance to discrete colors
function colorMapper(variance) {
    for (let i = 0; i < legend.length; i++) {
        if (variance >= legend[i].varianceMax) {
            return legend[i].color
        }
    }
}

// Function to create tooltip html using template literal
function tooltipFormat(d, baseTemperature) {
    return `<h3> ${months[d.month]} ${ d.year }</h3>
    <p>Average temperature: ${ (d.variance + baseTemperature).toFixed(3) }℃</p>
    <p>Variance: ${d.variance}℃</p>` 
}