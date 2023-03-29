let FRAME_HEIGHT = 700;
let FRAME_WIDTH = 700;
let MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

let SCATTER_FRAME = d3.select('.scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "scatter");

// create scatter dimensions
let SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
let SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

let BAR_FRAME = d3.select('.bar')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "bar");

let BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
let BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;



function render(x_attribute, y_attribute) {
    document.getElementById("scatter").innerHTML = "";
    

    // Reading from file and appending points
    d3.csv("data/Spotify_Songs_Subset2.csv").then((data) => {
        // Create key dictionary (it is possible we will use this later) 
        let keys = {'A' : 'blue', 'A#/Bb' : 'mediumturquiose', 
        'B' : 'green', 'C' : 'orange', 'C#/Db' : 'coral', 
        'D' : 'red', 'D#/Eb' : 'magenta', 'E' : 'violet', 
        'F' : 'brown', 'F#/Gb' : 'tomato', 'G' : 'pink', 'G#/Ab' : 'mediumslateblue'};

        // Create attribute dicitonary for future use
        const attribute_list = ("danceability", "energy", "loudness", "speechiness", 
                                "acousticness", "instrumentalness", "liveness", "valence", "tempo");
            
        let attribute_dictionary = {};
        for(let i = 0; i < attribute_list.length; i++)  {
            const curr_attr = attribute_list[i];
            attribute_dictionary.curr_attr;

                    const max = d3.max (data, (d) => { return d[curr_attr]});
                    const min = d3.min (data, (d) => {return d[curr_attr]});

                    const scale = d3.scaleLinear()
                                        .domain([min, max]) 
                                        .range(0., SCATTER_WIDTH);

                    attribute_dictionary.curr_attr = {
                        max: max,
                        min: min,
                        scale: scale
                    };
                };
                    function user_input() {
                        attribute_dictionary.user_attribute.scale();
                    };
        
        

        // Get the year max, min, and scale for colors of points
        MAX_YEAR = d3.max(data, (d) => 
                                    {return Math.abs(parseFloat(d["album_release_year"]))});

        MIN_YEAR = d3.min(data, (d) => 
                                    {return Math.abs(parseFloat(d["album_release_year"]))});

        const YEAR_SCALE = d3.scalePow()
                                .exponent(2)
                                .domain([MIN_YEAR, MAX_YEAR])
                                .range([1, .4]);

        

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
                    .attr("cx", (d) => {return (X_SCALE(Math.abs(parseFloat(d[x_attribute]))) + 2 * MARGINS.left)})
                    .attr("cy", (d) => {return ((Y_SCALE(Math.abs(parseFloat(d[y_attribute]))) + MARGINS.top))})
                    .attr("r", 2)
                    .attr("id", (d) => {return (d.track_name)})
                    .attr("class", "point")
                    .style("opacity", 0.5)
                    .style("fill", (d) => { 
                    return (d3.interpolateGreens(YEAR_SCALE(d["album_release_year"])))});
                    

    

        // add the x axis title
        SCATTER_FRAME.append("text")
            .attr("class", "x-label")
            .attr("x", SCATTER_WIDTH/2 + MARGINS.left)
            .attr("y", SCATTER_HEIGHT + MARGINS.top + MARGINS.bottom - 5)
            .text(x_attribute.charAt(0).toUpperCase() + x_attribute.slice(1));
        
            // add the y axis title
        SCATTER_FRAME.append("text")
            .attr("class", "y-label")
            .attr("x", 0)
            .attr("y", 0)
            .style("transform", "rotate(-90deg)")
            .style("transform-origin", "32% 25%")
            .text(y_attribute.charAt(0).toUpperCase() + y_attribute.slice(1));
        
        // plot the bottom and side axis
            SCATTER_FRAME.append("g")
                .attr("transform", "translate(" + (2 * MARGINS.left) + "," + 
                (SCATTER_HEIGHT + MARGINS.top) + ")")
                .call(d3.axisBottom(X_SCALE).ticks(10))
                    .attr("font-size", "12px");

            SCATTER_FRAME.append("g")
                .attr("transform", "translate("  + (MARGINS.left + 50) + "," + 
                (MARGINS.top) +  ")")
                .call(d3.axisLeft(Y_SCALE).ticks(10))
                    .attr("font-size", "12px");

        // const zoom = d3.zoom()
        // .scaleExtent([1, 10]) // Set the minimum and maximum zoom levels
        // .on("zoom", zoomed);

        // // add brushing 
        // SCATTER_FRAME.call(d3.brush()                 
        // .extent([[0,0], [FRAME_WIDTH, FRAME_HEIGHT]]) 
        // .on("start brush", displayBrush)); 

        // // // add zooming
        // SCATTER_FRAME.call(zoom)
        
        // function zoomed() {
        //     // update the X and Y scale domains based on the zoom event
        //     X_SCALE.domain([MIN_X, MAX_X].map(d => d3.event.transform.applyX(Math.abs(parseFloat(d[x_attribute])))));
        //     Y_SCALE.domain([MIN_Y, MAX_Y].map(d => d3.event.transform.applyY(Math.abs(parseFloat(d[y_attribute])))));
    
        //     // check if any points are selected
        //     let selectedPoints = Points.filter(".selected");
        //     if (selectedPoints.size()) {
        //      // if there are selected points, zoom in on them
        //      let xExtent = d3.extent(selectedPoints.data(), d => Math.abs(parseFloat(Math.abs(parseFloat(d[x_attribute])))));
        //      let yExtent = d3.extent(selectedPoints.data(), d => Math.abs(parseFloat(Math.abs(parseFloat(d[y_attribute])))));
        //      let xRange = [X_SCALE(xExtent[0]), X_SCALE(xExtent[1])];
        //      let yRange = [Y_SCALE(yExtent[1]), Y_SCALE(yExtent[0])];
        //      let xScaleFactor = SCATTER_WIDTH / (xRange[1] - xRange[0]);
        //      let yScaleFactor = SCATTER_HEIGHT / (yRange[1] - yRange[0]);
        //      let scaleFactor = Math.min(xScaleFactor, yScaleFactor, 10);
        //      let xTranslate = -xRange[0] * scaleFactor + MARGINS.left;
        //      let yTranslate = -yRange[0] * scaleFactor + MARGINS.top;
        //      SCATTER_FRAME.transition()
        //          .duration(500)
        //          .call(zoom.transform, d3.zoomIdentity.scale(scaleFactor).translate(xTranslate, yTranslate));
        //     }
        // };

        //     // shows the brushing
        //     function displayBrush(event) {
        //         selection = event.selection;
        //         Points.classed("selected", function(d){ return isSelected(selection, (X_SCALE(Math.abs(parseFloat(Math.abs(parseFloat(d[x_attribute]))))) + 2 * MARGINS.left), ((Y_SCALE(Math.abs(parseFloat(d[y_attribute]))) + MARGINS.top)))})
        //         // zoomed()

        //     };

           // when selecting a point to be brushed
           function isSelected(coords, cx, cy) {
             let x0 = coords[0][0],
                 x1 = coords[1][0],
                 y0 = coords[0][1],
                 y1 = coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
           };

        
        // plot bar 
        const X_SCALE_BAR = d3.scaleBand()
                                .domain(['AD', 'AE', 'AL', 'AR', 'AT', 'AU', 'BA', 'BE', 'BG', 'BH', 'BO', 'BR', 'BY', 'CA', 'CH', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DE', 'DK', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ES', 'FI', 'FR', 'GB', 'GR', 'GT', 'HK', 'HN', 'HR', 'HU', 'ID', 'IE', 'IL', 'IN', 'IS', 'IT', 'JO', 'JP', 'KW', 'KZ', 'LB', 'LI', 'LT', 'LU', 'LV', 'MA', 'MC', 'MD', 'ME', 'MK', 'MT', 'MX', 'MY', 'NI', 'NL', 'NO', 'NZ', 'OM', 'PA', 'PE', 'PH', 'PL', 'PS', 'PT', 'PY', 'QA', 'RO', 'RS', 'RU', 'SA', 'SE', 'SG', 'SI', 'SK', 'SV', 'TH', 'TN', 'TR', 'TW', 'UA', 'US', 'UY', 'VN', 'XK', 'ZA'])
                                .range([0, BAR_WIDTH]);

        const Y_SCALE_BAR = d3.scaleLinear()
                                .domain([0,2000])
                                .range([BAR_HEIGHT, 0]);
        BAR_FRAME.append("text")
                .attr("x", FRAME_WIDTH/2)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .style("font-size", "20px");


        // add x-axis to vis
        BAR_FRAME.append("g")
                .attr("transform", "translate(" + MARGINS.left+ "," + (BAR_HEIGHT + MARGINS.top) + ")")
                .call(d3.axisBottom(X_SCALE_BAR).ticks(10));

        BAR_FRAME.append("text")
            .attr("x", FRAME_WIDTH/2)
            .attr("y", FRAME_HEIGHT - 15)
            .style("text-anchor", "middle")
            .text("Available Markets");


        // add y-axis to vis
        BAR_FRAME.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
                .call(d3.axisLeft(Y_SCALE_BAR).ticks(10));

        BAR_FRAME.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(FRAME_HEIGHT/2))
            .attr("y", 12)
            .style("text-anchor", "middle")
            .text("Number of Songs");

        /*
        let transposedData = d3.transpose([data]);
        let k = Object.keys(data[0]);

          transposedData.forEach(function(column, index) {
            // Do something with the values in this column
            console.log("Column " + index + ": " + column);

        });
        */


            /*
        data.forEach( function(d) {
            // loop through available markets 
            for (var i = 0; i < )
            if(d['available_markets'] )
            console.log(d['available_markets'])

        })
*/


        const COUNTER = d3.scaleOrdinal()
            .domain(['AD', 'AE', 'AL', 'AR', 'AT', 'AU', 'BA', 'BE', 'BG', 'BH', 'BO', 'BR', 'BY', 'CA', 'CH', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DE', 'DK', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ES', 'FI', 'FR', 'GB', 'GR', 'GT', 'HK', 'HN', 'HR', 'HU', 'ID', 'IE', 'IL', 'IN', 'IS', 'IT', 'JO', 'JP', 'KW', 'KZ', 'LB', 'LI', 'LT', 'LU', 'LV', 'MA', 'MC', 'MD', 'ME', 'MK', 'MT', 'MX', 'MY', 'NI', 'NL', 'NO', 'NZ', 'OM', 'PA', 'PE', 'PH', 'PL', 'PS', 'PT', 'PY', 'QA', 'RO', 'RS', 'RU', 'SA', 'SE', 'SG', 'SI', 'SK', 'SV', 'TH', 'TN', 'TR', 'TW', 'UA', 'US', 'UY', 'VN', 'XK', 'ZA'])
            .range([1675, 1827, 1839, 1874, 1852, 1845, 1847, 1857, 1860, 1828, 1873, 1873, 1710, 1949, 1853, 1873, 1869, 1879, 1861, 1865, 1848, 1859, 1867, 1843, 1872, 1863, 1829, 1865, 1862, 1860, 1858, 1863, 1871, 1858, 1871, 1849, 1867, 1857, 1854, 1863, 1832, 1856, 1858, 1652, 1805, 1834, 1675, 1828, 1655, 1863, 1859, 1863, 1839, 1676, 1676, 1842, 1847, 1863, 1920, 1854, 1871, 1858, 1861, 1847, 1828, 1869, 1873, 1859, 1863, 1599, 1866, 1873, 1828, 1861, 1811, 1857, 1828, 1849, 1862, 1864, 1865, 1872, 1852, 1842, 1866, 1857, 1861, 2000, 1862, 1855, 1811, 1868]);
        
        for (var i = 0; i < 10; i++) {
            BAR_FRAME.selectAll("bars")
                    .data(data)
                    .enter()
                    .append("rect")  
                    .attr("x", X_SCALE_BAR(COUNTER.domain()[i]) + MARGINS.left + 20) 
                    .attr("y", Y_SCALE_BAR(COUNTER.range()[i]) + MARGINS.top) 
                    .attr("width", 20)
                    .attr("height", BAR_HEIGHT - Y_SCALE_BAR(COUNTER.range()[i])) 
                    .attr("id", COUNTER.domain()[i])
                    .attr("class", "inactive");
        }

        // adding a tooltip
        const TOOLTIP = d3.select(".scatter")
                            .append("div")
                            .attr("id", "tooltip")
                            .style("opacity", 0); 


        function handleMouseover(event, d) {
            d3.select(this)
        TOOLTIP.style("opacity", 1);

        };

        function handleMousemove(event, d) {

        // position the tooltip and fill in information 
        TOOLTIP.html("Track Name: " + d.track_name + "<br>Album: " + d.album_name + "<br>Release Year: " + d.album_release_year)
                .style("left", (event.pageX + 10) + "px") 
                .style("top", (event.pageY - 50) + "px"); 

        for (var i = 0; i < COUNTER.domain().length; i++) {
            mkt = COUNTER.domain()[i];
            if(d[mkt] == 1) {
                d3.selectAll('#' + mkt).attr("class", "active")
            }
        }

        
        /*
            if(d.US == 1) {
                d3.selectAll('#US').attr("class", "active")
            } 
            if(d.CA == 1) {
                d3.selectAll('#CA').attr("class", "active")
            }
            if(d.MX == 1) {
                d3.selectAll('#MX').attr("class", "active")
            }
            if(d.CR == 1) {
                d3.selectAll('#CR').attr("class", "active")
            }
            if(d.AR == 1) {
                d3.selectAll('#AR').attr("class", "active")
            }
            if(d.BO == 1) {
                d3.selectAll('#BO').attr("class", "active")
            }
            if(d.CL == 1) {
                d3.selectAll('#CL').attr("class", "active")
            }
            if(d.PE == 1) {
                d3.selectAll('#PE').attr("class", "active")
            }
            if(d.BR == 1) {
                d3.selectAll('#BR').attr("class", "active")
            }
            if(d.PY == 1) {
                d3.selectAll('#PY').attr("class", "active")
            }
            */
        
        };


        function handleMouseleave(event, d) {
            d3.select(this)
        TOOLTIP.style("opacity", 0); 

            if(d.US == 1) {
                d3.selectAll('#US').attr("class", "inactive")
            } 
            if(d.CA == 1) {
                d3.selectAll('#CA').attr("class", "inactive")
            }
            if(d.MX == 1) {
                d3.selectAll('#MX').attr("class", "inactive")
            }
            if(d.CR == 1) {
                d3.selectAll('#CR').attr("class", "inactive")
            }
            if(d.AR == 1) {
                d3.selectAll('#AR').attr("class", "inactive")
            }
            if(d.BO == 1) {
                d3.selectAll('#BO').attr("class", "inactive")
            }
            if(d.CL == 1) {
                d3.selectAll('#CL').attr("class", "inactive")
            }
            if(d.PE == 1) {
                d3.selectAll('#PE').attr("class", "inactive")
            }
            if(d.BR == 1) {
                d3.selectAll('#BR').attr("class", "inactive")
            }
            if(d.PY == 1) {
                d3.selectAll('#PY').attr("class", "inactive")
            }
        };
        

        // Add event listeners
        SCATTER_FRAME.selectAll("circle")
            .on("mouseover", handleMouseover) 
            .on("mousemove", handleMousemove)
            .on("mouseleave", handleMouseleave);
        
    });
}

render("danceability", "loudness");


// add changeAxis function
function changeAttributes() {
    let x_value = document.querySelector('#x').value;
    let y_value = document.querySelector('#y').value;
    
    let x_attribute = x_value.toLowerCase();
    let y_attribute = y_value.toLowerCase();
    document.getElementById("tooltip").remove();
    render(x_attribute, y_attribute);

}
