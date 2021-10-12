(function mapChart() {
		const SIZE = 500;
		let padding = 30;
	
		let map = d3.select("svg#map");
		let mapWidth = SIZE;
		let mapHeight = SIZE;
		let mapXScale = d3.scaleLinear();
		let mapYScale = d3.scaleLinear();
		
		let buttonHeight = 30;
		let buttonPadding = 10;
		
		let graph = d3.select("svg#graph");
		let graphWidth = SIZE;
		let graphHeight = SIZE - 
			(buttonHeight + buttonPadding * 2);
		let graphXScale = d3.scaleLinear();
		let graphYScale = d3.scaleLinear();
		
		let buttonWidth = (graphWidth - 4 * buttonPadding) / 3;
		let keyButtonWidth = buttonWidth / 2;
	
		let maleOpacity = 1;
		let famaleOpacity = 1;
		
		let ageRanges = [
			{
				label: '0-10',
				opacity: 1,
				color: '#FFF57B'
			},
			{
				label: '11-20',
				opacity: 1,
				color: '#FFE469'
			},
			{
				label: '21-40',
				opacity: 1,
				color: '#F4B757'
			},
			{
				label: '41-60',
				opacity: 1,
				color: '#F3734C'
			},
			{
				label: '61-80',
				opacity: 1,
				color: '#F13D36'
			},
			{
				label: '> 80',
				opacity: 1,
				color: '#D61E29'
			}
		];
		
		let streets = [];
		let mapLabels = [];
		let pumps = [];
		
		let deathDays = [];
		let deaths = [];
		let maxDeaths = 0;
		
		function resetPageElementsAll() {
			map.selectAll('.death')
				.attr('fill','none')
				.attr('fill-opacity', 1);
				
			graph.selectAll('.graphline')
				.attr('stroke','none')
				.attr('stroke-opacity',1);
				
			graph.selectAll('.graphkeybutton')
				.attr('visibility','hidden')
				.attr('fill-opacity', 1);
				
			maleOpacity = 1;
			femaleOpacity = 1;
			
			for (let i=0; i < ageRanges.length; i++) {
				ageRanges[i].opacity = 1;
			}
		}
		// let zoom = d3.zoom()
  // 			.on('zoom', handleZoom);
		
		// function handleZoom(e) {
  // 			d3.select('svg g')
  //   			.attr('transform', e.transform);
		// }
		
		function displayAllTotalRecords() {
			resetPageElementsAll();
			
			map.selectAll('.death').attr('fill','blue');
				
			graph.select('#graphlinetotal')
				.attr('stroke','blue')
				.attr('opacity','1');

			graph.append("text")
			.attr("x",120)
			.attr("y",465)
			.text("Days -->")
			.attr('font-weight','bold')

			graph.append("text")
			.text("Deaths -->")
			.attr("transform", "translate(12,250) rotate(-90)")
			.attr('font-weight','bold')

			graph.append("text")
			.attr("x",360)
			.attr("y",25)
			.text("Death by Days")
			.attr('font-weight','bold')
			.style("font-size","20px")

		}
		
		function displatGenderWise() {
			resetPageElementsAll();
			
			map.selectAll('.male').attr('fill','#7879FF');
			map.selectAll('.female').attr('fill','#e75480');
			
			graph.select('#graphlinetotal')
				.attr('stroke','pink')
				.attr('opacity','1');
			// graph.select('#graphlinegendermale').attr('stroke','blue');
			// graph.select('#graphlinegenderfemale').attr('stroke','pink');
			
			 graph.select('#buttongendermale').attr('visibility','visible');
			 graph.select('#buttongendermalelabel').attr('visibility','visible');
			graph.select('#buttongenderfemale').attr('visibility','visible');
			 graph.select('#buttongenderfemalelabel').attr('visibility','visible');
		}
		
		function displayAgeWise() {
			resetPageElementsAll();
			
			for (let i=0; i < ageRanges.length; i++) {
				map.selectAll('.age' + i)
					.attr('fill', ageRanges[i].color);
				// graph.select('#graphlineage' + i)
				// 	.attr('stroke', ageRanges[i].color);
				graph.select('#buttonage' + i)
					.attr('visibility','visible');
				graph.select('#buttonagelabel' + i)
					.attr('visibility','visible');
			}
			graph.select('#graphlinetotal')
				.attr('stroke','black')
				.attr('opacity','1');
		}
		
		// Draw the location of each death on the map.
		function ShowDeathMapDetails() {
			map.selectAll('.death')
				.data(deaths)
				.enter()
				.append('circle')
				.attr('id', function(d,i) { return "death" + i; })
				.attr('class', function(d) {
					return "death " +
						d.gender + " " +
						"age" + d.age + " " +
						"deathday" + d.deathday;
				})
				.attr('cx', function(d) { return mapXScale(d.x); })
				.attr('cy', function(d) { return mapYScale(d.y); })
				.attr('fill','blue')
				.append("title")
				.text(function(d) {
					return d.gender + "\r\n" +
						"age " + ageRanges[d.age].label + "\r\n" +
						"died " + d.deathdate;
				});
		}
		
		// Draw all the graph lines in advance.
		function displayGraphLinesDeathData() {
			let graphTotalPathGenerator = d3.line()
				.x(function(d) { return graphXScale(d.day); })
				.y(function(d) { return graphYScale(d.total); });

			graph.append('path')
				.attr('id', 'graphlinetotal')
				.attr('class', 'graphline')
				.attr('d', graphTotalPathGenerator(deathDays));
				
			let graphMalePathGenerator = d3.line()
				.x(function(d) { return graphXScale(d.day); })
				.y(function(d) { return graphYScale(d.male); });

			graph.append('path')
				.attr('id', 'graphlinegendermale')
				.attr('class', 'graphline male')
				.attr('d', graphMalePathGenerator(deathDays));

			let graphFemalePathGenerator = d3.line()
				.x(function(d) { return graphXScale(d.day); })
				.y(function(d) { return graphYScale(d.female); });

			graph.append('path')
				.attr('id', 'graphlinegenderfemale')
				.attr('class', 'graphline female')
				.attr('d', graphFemalePathGenerator(deathDays));

			for (let i=0; i < ageRanges.length; i++) {
				let graphPathGenerator = d3.line()
					.x(function(d) { return graphXScale(d.day); })
					.y(function(d) { return graphYScale(d.age[i]); });

				graph.append('path')
					.attr('id', 'graphlineage' + i)
					.attr('class', 'graphline age' + i)
					.attr('d', graphPathGenerator(deathDays));
			}
		}
		
		// Draw the overall structure of the graph.
		function displayDeathGraphicalFormat() {

			// Create hover bars
			let hoverbarWidth = graphWidth / (deathDays.length - 1);

			graph.selectAll("rect.deathhoverbar")
				.data(deathDays)
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return graphXScale(i) - hoverbarWidth / 2;
				})
				.attr("y", padding)
				.attr('width', hoverbarWidth)
				.attr("height", graphHeight - padding * 2)
				.attr("fill", "black")
				.attr("fill-opacity", "0")
				.attr("stroke", "none")
				.attr("stroke-width", "0")
				.attr("id", function(d) { return d.deathdate; })
				.attr("class", "deathhoverbar")
				.on("mouseover", function(d) {
					d3.selectAll('.death')
						.filter(function(d2) {
							return d2.deathday > d.day;
						})
						.attr('visibility','hidden');
				})
				.on("mouseout", function(d) {
					map.selectAll(".death").attr("visibility","visible");
				})
				.append("title")
				.text(function(d) {
					return d.deathdate + ": " + d.total + 
						(d.total==1 ? " death" : " deaths");
				});
				
			// Draw the axes.
			let xAxis = d3.axisBottom(graphXScale).tickFormat(function (d) {
      return deathDays[d].deathdate;
    });

    let yAxis = d3.axisLeft(graphYScale);

			graph.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(0,' + (graphHeight - padding) + ')')
				.call(xAxis);

			graph.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(' + padding + ',0)')
				.call(yAxis);
				
			// Draw the buttons.
			let buttonLabelYAdjust = 5;
			
			// Total Deaths
			// graph.append('rect')
			// 	.attr('id', 'buttontotal')
			// 	.attr('class', 'graphbutton')
			// 	.attr("x", buttonPadding)
			// 	.attr("y", graphHeight + buttonPadding)
			// 	.attr("width", buttonWidth)
			// 	.attr("height", buttonHeight)
			// 	.attr("fill", "blue")
			// 	.on('click', function(d) {
			// 		displayAllTotalRecords();
			// 	});

			 graph.append('circle')
        .attr('cx',60 )
        .attr('cy', 470 )
        .attr('r','30px')
        .style('fill', 'blue')
        .on('click', function(d) {
					displayAllTotalRecords();
				});;
			graph.append('text')
				.attr('id', 'buttontotallabel')
				.attr('class', 'graphbuttonlabel')
				.text('Total')
				.attr('x', 60)
				.attr('y', 475)
				.attr('text-anchor','middle')
				.attr('fill', 'white')
				.style('pointer-events','none');
				
			// By Gender
			// graph.append('rect')
			// 	.attr('id', 'buttongender')
			// 	.attr('class', 'graphbutton')
			// 	.attr("x", buttonPadding * 2 + buttonWidth)
			// 	.attr("y", graphHeight + buttonPadding)
			// 	.attr("width", buttonWidth - 100)
			// 	.attr("height", buttonHeight)
			// 	.attr("fill", "pink")
			// 	.on('click', function(d) {
			// 		displatGenderWise();
			// 	});

			 graph.append('circle')
        .attr('cx',245 )
        .attr('cy', 470 )
        .attr('r','30px')
        .style('fill', 'pink')
        .on('click', function(d) {
					displatGenderWise();
				});;

			graph.append('text')
				.attr('id', 'buttongenderlabel')
				.attr('class', 'graphbuttonlabel')
				.text('Sex')
				.attr('x', 244)
				.attr('y', 475)
				.attr('text-anchor','middle')
				.attr('fill', 'black')
				.style('pointer-events','none');
				
			// By Age
			// graph.append('rect')
			// 	.attr('id', 'buttonage')
			// 	.attr('class', 'graphbutton')
			// 	.attr("x", buttonPadding * 3 + buttonWidth * 2)
			// 	.attr("y", graphHeight + buttonPadding)
			// 	.attr("width", buttonWidth)
			// 	.attr("height", buttonHeight)
			// 	.attr("fill", "black")
			// 	.on('click', function(d) {
			// 		displayAgeWise();
			// 	});

			 graph.append('circle')
        .attr('cx',440 )
        .attr('cy', 470 )
        .attr('r','30px')
        .style('fill', 'black')
        .on('click', function(d) {
					displayAgeWise();
				});;

			graph.append('text')
				.attr('id', 'buttonagelabel')
				.attr('class', 'graphbuttonlabel')
				.text('Age')
				.attr('x', 438)
				.attr('y', 475)
				.attr('text-anchor','middle')
				.attr('fill', 'white')
				.style('pointer-events','none');
				
			// By Gender: Male Key
			graph.append('rect')
				.attr('id', 'buttongendermale')
				.attr('class', 'graphbutton graphkeybutton male')
				.attr("x", 250)
				.attr("y", 150)
				.attr("width", keyButtonWidth)
				.attr("height", buttonHeight)
				.attr("fill", "#7978FF")
				.on('click', function(d) {
					maleOpacity = (maleOpacity == 1 ? .2 : 1);
					d3.selectAll('.male').attr('fill-opacity', maleOpacity).attr("fill","blue");
					d3.selectAll('.male').attr('stroke-opacity', maleOpacity).attr("fill","blue");
				});
			graph.append('text')
				.attr('id', 'buttongendermalelabel')
				.attr('class', 'graphbuttonlabel graphkeybutton')
				.text('Male')
				.attr('x', 288)
				.attr('y', 170)
				.attr('text-anchor','middle')
				.attr('fill', 'black')
				.style('pointer-events','none');
				
			// By Gender: Female Key
			graph.append('rect')
				.attr('id', 'buttongenderfemale')
				.attr('class', 'graphbutton graphkeybutton female')
				.attr("x", 250)
				.attr("y", 190)
				.attr("width", keyButtonWidth)
				.attr("height", buttonHeight)
				.attr("fill", "pink")
				.on('click', function(d) {
					femaleOpacity = (femaleOpacity == 1 ? .2 : 1);
					d3.selectAll('.female').attr('fill-opacity', femaleOpacity).attr("fill","#e75480");
					d3.selectAll('.female').attr('stroke-opacity', femaleOpacity).attr("fill","#e75480");
				});
			graph.append('text')
				.attr('id', 'buttongenderfemalelabel')
				.attr('class', 'graphbuttonlabel graphkeybutton')
				.text('Female')
				.attr('x', 288)
				.attr('y', 210)
				.attr('text-anchor','middle')
				.attr('fill', 'black')
				.style('pointer-events','none');

			// By Age Key Buttons
			for (let i=0; i < ageRanges.length; i++) {
				graph.append('rect')
					.attr('id', 'buttonage' + i)
					.attr('class', 'graphbutton graphkeybutton age' + i)
					.attr("x", 270)
					.attr("y", buttonPadding * (i + 1) + buttonHeight * i)
					.attr("width", keyButtonWidth)
					.attr("height", buttonHeight)
					.attr("fill", ageRanges[i].color)
					.on('click', function(d) {
						ageRanges[i].opacity = (ageRanges[i].opacity == 1 ? .1 : 1);
						d3.selectAll('.age' + i)
							.attr('fill-opacity', ageRanges[i].opacity);
						d3.selectAll('.age' + i)
							.attr('stroke-opacity', ageRanges[i].opacity);
					});
				graph.append('text')
					.attr('id', 'buttonagelabel' + i)
					.attr('class', 'graphbuttonlabel graphkeybutton')
					.text(ageRanges[i].label)
					.attr('x', 307)
					.attr('y', buttonPadding * (i + 1) +
						buttonHeight * i + buttonHeight / 2 +
						buttonLabelYAdjust)
					.attr('text-anchor','middle')
					.attr('fill', 'white')
					.style('pointer-events','none');
			}
		}		
		
		// Load the death data and add it to the map and the graph.
		function loadDeaths() {
		
			// Load the coordinates and demographics for each death. These are
			// assumed to be provided in the order in which the victim died, for
			// purposes of correlating to deathdays.csv.
			d3.csv("data/deaths_age_sex.csv", function(data) {
				for (let i=0; i < data.length; i++) {
					deaths.push(
						{
							x: data[i].x,
							y: data[i].y,
							age: +data[i].age,
							gender: +data[i].gender==1 ? "female" : "male"
						}
					);
				}
				
				// Load the number of deaths for each date, and update
				// each death record with the day and date on which it occurred.
				d3.csv("data/deathdays.csv", function(data) {
					let deathId = 0;
					for (let day = 0; day < data.length; day++) {
					
						let totalCount = +data[day].deaths;
						let maleCount = 0;
						let femaleCount = 0;
						let ageCount = [0,0,0,0,0,0];
						
						// Find the highest number of deaths on any day,
						// to set the vertical scale.
						if (maxDeaths < totalCount) {
							maxDeaths = totalCount;
						}
						
						for (let i=0; i < totalCount; i++) {
							// Update the individual death records with the day
							// and date of death.
							deaths[deathId].deathday = day;
							deaths[deathId].deathdate = data[day].date;
							
							// Count the deaths on each deathDay by demographic.
							if (deaths[deathId].gender == "male") {
								maleCount++;
							} else {
								femaleCount++;
							}
							ageCount[deaths[deathId].age]++;
							
							// Increment to the next individual death record.
							deathId++;
						}
						
						deathDays.push ({
							day: day,
							deathdate: data[day].date,
							total: totalCount,
							male: maleCount,
							female: femaleCount,
							age: ageCount
						});
						
					}

					graphXScale.domain([0, deathDays.length-1])
						.range([padding, graphWidth - padding]);
					graphYScale.domain([0, maxDeaths])
						.range([graphHeight - padding, padding]);
						
					ShowDeathMapDetails();
					displayGraphLinesDeathData();
					displayDeathGraphicalFormat();
					
					displayAllTotalRecords();
				});
				
			});
		}		// Load and draw the water pumps.
		function drawPumps() {
			const pumpSize = 8;
		
			d3.csv("data/pumps.csv", function(data) {
				for (let i=0; i < data.length; i++) {
					pumps.push(
						{x: data[i].x, y: data[i].y}
					);
				}
				
				map.selectAll('.pump')
					.data(pumps)
					.enter()
					.append('rect')
					.attr('class', 'pump')
					.attr('width', pumpSize)
					.attr('height', pumpSize)
					.attr('x', function(d) { return mapXScale(d.x) - pumpSize / 2; })
					.attr('y', function(d) { return mapYScale(d.y) - pumpSize / 2; })
					.attr('transform', function(d) {
						return 'rotate(45 ' + 
							mapXScale(d.x) + ' ' +
							mapYScale(d.y) + ')';
					});
			});
		}
		
		// Load and draw the street and building labels.
		function drawMapLabels() {
			d3.csv("data/maplabels.csv", function(data) {
				for (let i=0; i < data.length; i++) {
					mapLabels.push({
						x: data[i].x,
						y: data[i].y,
						text: data[i].text,
						fontsize: data[i].fontsize,
						angle: data[i].angle
					});
				}
				
				map.selectAll('.mapLabel')
					.data(mapLabels)
					.enter()
					.append('text')
					.attr('class', 'mapLabel')
					.attr('x', function(d) { return d.x; })
					.attr('y', function(d) { return d.y; })
					.attr('font-size', function(d) { return d.fontsize; })
					.text(function(d) { return d.text; })
					.attr('transform', function(d) {
						return 'rotate(' + d.angle + ',' +
							d.x + ',' + d.y + ')';
					});
					
				/*
				// We used this code to estimate coordinates
				// for all the labels.
				map.on("click", function() {
					console.dir(event.clientX + ", " + event.clientY);
				});
		// 		*/
			});
		}
		
		// Provide a means of drawing the map lines at scale.
		let lineFunction = d3.line()
			.x(function(d) { return mapXScale(d.x); })
			.y(function(d) { return mapYScale(d.y); })
			.curve(d3.curveLinear)
		
		// Start the process by loading and drawing the map.
		d3.json("data/streets.json", function(data) {
			streets = data;
		
			mapXScale.domain([3,20]).range([0, mapWidth]);
			mapYScale.domain([3,20]).range([mapHeight, 0]);
			
			for (let i=0; i < streets.length; i++) {
				map.append("path")
					.attr("d", lineFunction(streets[i]))
					.attr("class", "street");
			}

			   map.append("text")
                 .attr('x',360)
                 .attr('y',237)
                 .attr('font-size',10)
                 .style('text-anchor', 'start')
        .attr('transform', 'rotate(75 190 30)')
        .attr('font-weight','bold')
     
                 .text("CEORCE STREET");
			
			 map.append("text")
            .attr('x',400  )
            .attr('y', 128)
            .attr('font-size', 10)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(75 190 30)')
            .attr('font-weight', 'bold')

            .text("REGENT STREET");

            map.append("text")
            .attr('x', 210)
            .attr('y', 200)
            .style('font-size', 15)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(1 1 1)')
            .attr('fill', 'darkgreen')
            .attr('stroke-width', 'none')
            .attr('font-weight', 'bold')


            .text("WORKHOUSE");


        map.append("text")
            .attr('x', 420)
            .attr('y', -45)
            .style('font-size', 15)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(75 190 20)')
            .attr('fill', 'Purple')
            .attr('stroke-width', 'none')
            .attr('font-weight', 'bold')


            .text("BREWERY");

             map.append("text")
            .attr('x', 50)
            .attr('y', 120)
            .style('font-size', 12)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(10 10 20)')
            .attr('fill', 'Purple')
            .attr('stroke-width', 'none')
            .attr('font-weight', 'bold')


            .text("REGENT CIRCUS");

            map.append("text")
            .attr('x', 310)
            .attr('y', 360)
            .style('font-size', 12)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(10 10 20)')
            .attr('fill', 'black')
            .attr('stroke-width', 'none')
            .attr('font-weight', 'bold')


            .text("MERYLBONE STREET");

       

            map.append("text")
            .attr('x', 92)
            .attr('y', 400)
            .attr('font-size', 10)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(-25 120 -10)')
            // .attr('fill','Purple')
            // .attr('stroke-width','none')
            .attr('font-weight', 'bold')


            .text("BREWER STREET");

            map.append("text")
            .attr('x', -175)
            .attr('y', 360)
            .attr('font-size', 10)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(-25 120 -10)')
            // .attr('fill','Purple')
            // .attr('stroke-width','none')
            .attr('font-weight', 'bold')


            .text("CRAFTON STREET");

             map.append("text")
            .attr('x', 120)
            .attr('y', 130)
            .attr('font-size', 10)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(-25 120 -10)')
            // .attr('fill','Purple')
            // .attr('stroke-width','none')
            .attr('font-weight', 'bold')


            .text("OXFORD STREET");

         

              map.append("text")
            .attr('x', 300)
            .attr('y', -200)
            .style('font-size', 13)
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(75 190 20)')
            .attr('fill', 'red')
            .attr('stroke-width', 'none')
            .attr('font-weight', 'bold')


            .text("SOHO SQUARE");


			
			drawPumps();
			loadDeaths();


		});
				})();
