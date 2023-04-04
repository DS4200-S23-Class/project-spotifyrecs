// create frame dimensions for visualizations
let FRAME_HEIGHT = 600;
let FRAME_WIDTH = 600;
let MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// create scatter plot frame
let SCATTER_FRAME = d3.select('.scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "scatter");

// create scatter plot dimensions
let SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
let SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// create bar graph frame
let BAR_FRAME = d3.select('.bar')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "bar");
// create bar graph dimensions
let BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
let BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;


// function for rendering the page whenever x and y attributes are changed
function render(x_attribute, y_attribute) {

    // getting rid of the prior visualizations if there are any
    document.getElementById("scatter").innerHTML = "";
    

    // Reading from file and appending points
    d3.csv("data/Spotify_Songs_Subset2.csv").then((data) => {

        // Get the year max, min, and scale for colors of points
        MAX_YEAR = d3.max(data, (d) => 
                                    {return Math.abs(parseFloat(d["album_release_year"]))});

        MIN_YEAR = d3.min(data, (d) => 
                                    {return Math.abs(parseFloat(d["album_release_year"]))});

        const YEAR_SCALE = d3.scaleLinear()
                                // .exponent(10)
                                .domain([MIN_YEAR, MAX_YEAR])
                                .range([1.5, .4]);

        // Getting max X and Y coords
        const MAX_X = d3.max(data, (d) => 
                                    {return Math.abs(parseFloat(d[x_attribute]))});
                                    
        const MAX_Y = d3.max(data, (d) => 
                                    {return Math.abs(parseFloat(d[y_attribute]))});

        // Getting max X and Y coords
        const MIN_X = d3.min(data, (d) => 
                                    {return  Math.abs(parseFloat(d[x_attribute]))});
                                    
        const MIN_Y = d3.min(data, (d) => 
                                    {return Math.abs(parseFloat(d[y_attribute]))});

        
        // X coord scale function
        const X_SCALE = d3.scaleLinear()
                                .domain([MIN_X, MAX_X])
                                .range([0, SCATTER_WIDTH - MARGINS.right]);

        
        // Y coord scale function
        const Y_SCALE = d3.scaleLinear()
                            .domain([MIN_Y, MAX_Y])
                            .range([SCATTER_HEIGHT, 0]);


        // plot the scatter points
        let Points = SCATTER_FRAME.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                    .attr("cx", (d) => {return (X_SCALE(Math.abs(parseFloat(d[x_attribute]))) + 1.5 * MARGINS.left)})
                    .attr("cy", (d) => {return ((Y_SCALE(Math.abs(parseFloat(d[y_attribute]))) + MARGINS.top))})
                    .attr("r", 2)
                    .attr("id", (d) => {return (d.track_name)})
                    .attr("class", "point")
                    .style("opacity", 0.5)
                    .style("fill", (d) => { 
                    return (d3.interpolateGreens(YEAR_SCALE(d["album_release_year"])))});
                    
        // set the x axis title
        SCATTER_FRAME.append("text")
            .attr("x", FRAME_WIDTH/2)
            .attr("y", FRAME_HEIGHT - 15)
            .style("text-anchor", "middle")
            .text(x_attribute.charAt(0).toUpperCase() + x_attribute.slice(1));

        // set the y axis title
        SCATTER_FRAME.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(FRAME_HEIGHT/2))
            .attr("y", 25)
            .style("text-anchor", "middle")
            .text(y_attribute.charAt(0).toUpperCase() + y_attribute.slice(1));

      

        // plot the bottom and side axis
       SCATTER_FRAME.append("g")
                                    .attr("transform", "translate(" + (1.5 * MARGINS.left) + "," + 
                                    (SCATTER_HEIGHT + MARGINS.top) + ")")
                                    .call(d3.axisBottom(X_SCALE).ticks(10))
                                        .attr("font-size", "12px");

        SCATTER_FRAME.append("g")
                                    .attr("transform", "translate("  + (MARGINS.left + 25) + "," + 
                                    (MARGINS.top) +  ")")
                                    .call(d3.axisLeft(Y_SCALE).ticks(10))
                                        .attr("font-size", "12px");
                            
       
        // scale functions for plotting the bar graph 
        const X_SCALE_BAR = d3.scaleBand()
                                .domain(['US', 'CA', 'MX', 'CR', 'AR', 'BO', 'BR', 'CL', 'PE', 'PY', 'EC', 'SV', 'GT', 'HN', 'NI', 'CO', 'PA', 
                                'ZA', 'DO', 'HU', 'PT', 'TR', 'CZ', 'ES', 'SK', 'SI', 'EE', 'GR', 'IL', 'LT'])
                                .range([0, BAR_WIDTH]);

        const Y_SCALE_BAR = d3.scaleLinear()
                                .domain([0,2000])
                                .range([BAR_HEIGHT, 0]);
    
        // tooltip for the bar graph
        const TOOLTIP2 = d3.select(".bar")
                            .append("div")
                            .attr("id", "tooltip2")
                            .style("opacity", 0);
        
        // handling mouseover for the tooltip on the bar graph
        function handleMouseover2(event, d) {
            // creating a dictionary for number of avalible songs in each market
            CountryDict = {'US': 2000, 'CA': 1949, 'MX': 1920, 'CR': 1879, 'AR': 1874, 'BO': 1873, 'BR': 1873, 'CL': 1873, 'PE': 1873, 
            'PY': 1873, 'EC': 1872, 'SV': 1872, 'GT': 1871, 'HN': 1871, 'NI': 1871, 'CO': 1869, 'PA': 1869, 'ZA': 1868, 
            'DO': 1867, 'HU': 1867, 'PT': 1866, 'TR': 1866, 'CZ': 1865, 'ES': 1865, 'SK': 1865, 'SI': 1864, 'EE': 1863, 
            'GR': 1863, 'IL': 1863, 'LT': 1863};
            
            // showing the tooltip and information
            TOOLTIP2.style("opacity", 1);
            TOOLTIP2.html("Total # of Available Songs in " + this.id + ":" + (CountryDict[this.id]))
                        .style("left", (event.pageX + 10) + "px") 
                        .style("top", (event.pageY - 50) + "px");
              
        }

        // handling mouseover for the tooltip on the bar graph
        function handleMouseleave2(event, d) {
            // make the tooltip invicible
            d3.select(this);
            TOOLTIP2.style("opacity", 0);
            
        };

        // add x-axis to bar graph
        BAR_FRAME.append("g")
                .attr("transform", "translate(" + MARGINS.left+ "," + (BAR_HEIGHT + 12) + ")")
                .call(d3.axisBottom(X_SCALE_BAR).ticks(10));

        // add x-axis title to bar graph
        BAR_FRAME.append("text")
            .attr("x", FRAME_WIDTH/2)
            .attr("y", FRAME_HEIGHT - 50)
            .style("text-anchor", "middle")
            .text("Available Markets");


        // add y-axis to vis
        BAR_FRAME.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + (12) + ")")
                .call(d3.axisLeft(Y_SCALE_BAR).ticks(10));
        
        // add y-axis title to bar graph
        BAR_FRAME.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(FRAME_HEIGHT/2))
            .attr("y", 12)
            .style("text-anchor", "middle")
            .text("Number of Songs");

        // function for creating the bars on the bar graph
        const COUNTER = d3.scaleOrdinal()
            .domain(['US', 'CA', 'MX', 'CR', 'AR', 'BO', 'BR', 'CL', 'PE', 'PY', 'EC', 'SV', 'GT', 'HN', 'NI', 'CO', 'PA', 
                    'ZA', 'DO', 'HU', 'PT', 'TR', 'CZ', 'ES', 'SK', 'SI', 'EE', 'GR', 'IL', 'LT'])
            .range([2000, 1949, 1920, 1879, 1874, 1873, 1873, 1873, 1873, 1873, 1872, 1872, 1871, 1871, 1871, 1869, 1869, 1868, 
                    1867, 1867, 1866, 1866, 1865, 1865, 1865, 1864, 1863, 1863, 1863, 1863]);
        
        // plotting the bars on the bar graph
        for (let i = 0; i < COUNTER.domain().length; i++) {

            // each bar x value is the domain value in COUNTER and each bar y value is the range in COUNTER
            BAR_FRAME.selectAll("bars")
                    .data(data)
                    .enter()
                    .append("rect")  
                    .attr("x", X_SCALE_BAR(COUNTER.domain()[i]) + MARGINS.left + 6) 
                    .attr("y", Y_SCALE_BAR(COUNTER.range()[i]) + 12) 
                    .attr("width", 5)
                    .attr("height", BAR_HEIGHT - Y_SCALE_BAR(COUNTER.range()[i])) 
                    .attr("id", COUNTER.domain()[i])
                    .attr("class", "inactive")
                    .on("mouseover", handleMouseover2) //add the mouseover2 function to the bar
                    .on("mouseleave", handleMouseleave2); // add the mouseleave2 function to the bar
                    
        }

        // creating the tooltip for the scatter plot
        const TOOLTIP = d3.select(".scatter")
                            .append("div")
                            .attr("id", "tooltip")
                            .style("opacity", 0); 

                            
        // handle mouseover function for the scatter plot tooltip
        function handleMouseover(event, d) {
            // make the tooltip visible
            d3.select(this);
            TOOLTIP.style("opacity", 1);

            // position the tooltip and fill in information 
            TOOLTIP.html("Track Name: " + d.track_name + "<br>Album: " + d.album_name + "<br>Release Year: " + d.album_release_year)
                    .style("left", (event.offsetX + 10) + "px") 
                    .style("top", (event.offsetY - 50) + "px"); 
            
            // get each country code of the scatter point
            d.countryCodes = ['US', 'CA', 'MX', 'CR', 'AR', 'BO', 'BR', 'CL', 'PE', 'PY', 'EC', 'SV', 'GT', 'HN', 'NI', 'CO', 'PA', 'ZA', 'DO', 'HU', 'PT', 'TR', 'CZ', 'ES', 'SK', 'SI', 'EE', 'GR', 'IL', 'LT']
                .filter(function(cc) { return d[cc] == 1; });
            
            // for each country code for the scatter point set the associated bars to green
            d.countryCodes.forEach(function(code) {
                
                d3.selectAll("#" + code + ".inactive")
                    .attr("class", "active");
            });

        };

        // handle mouseleave function for the scatter plot tooltip
        function handleMouseleave(event, d) {

            // make the tooltip invisible and set the associated bar graph bars to inactive
            d3.select(this);
            TOOLTIP.style("opacity", 0); 
            d3.selectAll(".active").attr("class", "inactive");
            
        };
        

        // Add event listeners to scatter plot points
        SCATTER_FRAME.selectAll("circle")
            .on("mouseover", handleMouseover)
            .on("mouseleave", handleMouseleave);
        
    });
};

// initially rendering the page with default x and y attributes
render("danceability", "loudness");


// function to render the new visualizations when the x and y attributes are changed
function changeAttributes() {

    // get the x and y attributes from the dropdowns
    let x_value = document.querySelector('#x').value;
    let y_value = document.querySelector('#y').value;
    
    // set the values to lowercase
    let x_attribute = x_value.toLowerCase();
    let y_attribute = y_value.toLowerCase();

    // remove the scatter graph tooltip that was there in the scatter div
    document.getElementById("tooltip").remove();

    // render the new visualizations with the new attributes
    render(x_attribute, y_attribute);

}
