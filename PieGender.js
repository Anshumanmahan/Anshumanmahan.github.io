(function PieGender() {
    var svg = d3.select("#PieGender"),
            width = svg.attr("width"),
            height = svg.attr("height"),
            radius = Math.min(width, height) / 2;
        
        var g = svg.append("g")
                   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(['#377eb8','#FFC0CB']);

        var pie = d3.pie().value(function(d) { 
                return d.Percent; 
            });

        var path = d3.arc()
                     .outerRadius(radius - 50)
                     .innerRadius(0);

        var label = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 250);

        d3.csv("data/Sex.csv", function(error, data) {
            if (error) {
                throw error;
            }
            var arc = g.selectAll(".arc")
                       .data(pie(data))
                       .enter().append("g")
                       .attr("class", "arc");

            arc.append("path")
               .attr("d", path)
               .attr("fill", function(d) { return color(d.data.Sex); });
        
            console.log(arc)
        
            arc.append("text")
               .attr("transform", function(d) { 
                        return "translate(" + label.centroid(d) + ")"; 
                })
               .attr("font-weight","bold")
               .text(function(d) { return d.data.Sex + "   " + d.data.Percent + "%" + " (" + d.data.Number + ") "; });

            g.append("g")
               .attr("transform", "translate(" + (width / 2 - 460) + "," + 320 + ")")
               .append("text")
               .style("font-size","20px")
               .text("Male Vs Female Deaths")
               .attr("class", "title")

            });

            
               }());