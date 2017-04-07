
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
let margin = {top: 90, right: 40, bottom: 70, left: 70};
let width = +svg.attr('width');
let height = +svg.attr('height');

// Define url
let URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// Get data with callback
d3.json(URL, function(error, data) {

    // Error check
    if (error) throw error;

    // Define scales for x and y
    let x = d3.scaleLinear()
                .domain([d3.min(data.map(d=> d.year)), d3.max(data.map(d=> d.year))])
                .range([margin.left, margin.left + width])
    // Define domains for x and y
    let y = d3.scaleLinear()
                .domain([1, 12])
                .range([height + margin.top, margin.top])

    // Add data into the svg with correct coordinates

    // Add rectangle for each

    // Add tooltip

    // Create x axis

    // Create y axis

    // Add labels

});