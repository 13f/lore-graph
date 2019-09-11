/* lore-graph.js - v1.0.0.20171206
* https://github.com/13f/lore-graph
* Dependencies:
*     d3.js ^ v3
* Copyright (c) 2014 taurenshaman
*/

var graphData = {
	tip: null,
	svg: null,
	force: null,
	// 将JSON中的数据解析出来，用于检索
	dataNodes: [],
	dataEdges: [],
	dataRelations: []
};

var LoreGraph ={
	// 参数
	svgContainer: null, // 存放svg的div，如果为null，则自己在body中append svg
	width: 960,
	height: 600,
	forceGravity: 0.05,
	forceDistance: 100,
	forceCharge: -100,
	// ==============================================================
	

	processNormalNodes: function(node){
	  var tmp = node.filter( function(d) { return d.type == null || d.type == "" } );
	  tmp.append("image")
		  .attr("xlink:href", function(d) { return d.icon })
		  .attr("x", -8)
		  .attr("y", -8)
		  .attr("width", 16)
		  .attr("height", 16);
	  tmp.append("text")
		  .attr("dx", 12)
		  .attr("dy", ".35em")
		  .text(function(d) { return d.value });
	},

	processNumberNodes: function(node){
	  var tmp = node.filter( function(d) { return d.type == "number" } );
	  tmp.append("image")
		  .attr("xlink:href", function(d) { return d.icon })
		  .attr("x", -8)
		  .attr("y", -8)
		  .attr("width", 16)
		  .attr("height", 16);
	  tmp.append("text")
		  .attr("dx", 12)
		  .attr("dy", ".35em")
		  .text(function(d) { return d.value });
	},

	processStringNodes: function(node){
	  var tmp = node.filter( function(d) { return d.type == "string" } );
	  tmp.append("image")
		  .attr("xlink:href", function(d) { return d.icon })
		  .attr("x", -8)
		  .attr("y", -8)
		  .attr("width", 16)
		  .attr("height", 16);
	  tmp.append("text")
		  .attr("dx", 12)
		  .attr("dy", ".35em")
		  .text(function(d) { return d.value });
	},

	processUrlNodes: function(node){
	  var tmp = node.filter( function(d) { return d.type == "url" } );
	  tmp.append("a")
		  .attr("xlink:href", function(d) { return d.value })
		  .attr("target", "_new")
		.append("image")
		  .attr("xlink:href", function(d) { return d.icon })
		  .attr("x", -8)
		  .attr("y", -8)
		  .attr("width", 16)
		  .attr("height", 16);
	},

	processImageNodes: function(node){
	  var tmp = node.filter( function(d) { return d.type == "image-url" } );
	  tmp.append("image")
		  .attr("xlink:href", function(d) { return d.icon })
		  .attr("x", -8)
		  .attr("y", -8)
		  .attr("width", 16)
		  .attr("height", 16);
	},

	processObjectNodes: function(node){
	  var tmp = node.filter( function(d) { return d.type == "object-url" } );
	  tmp.append("image")
		  .attr("xlink:href", function(d) { return d.icon })
		  .attr("x", -8)
		  .attr("y", -8)
		  .attr("width", 16)
		  .attr("height", 16);
	  tmp.append("text")
		  .attr("dx", 12)
		  .attr("dy", ".35em")
		  .text(function(d) { return d.value });
	},

	process: function(url){
		var self = this;
		// clear first
		graphData.svg.selectAll("*")
			.remove();
		
	  d3.json(url, function(error, jsonData) {
		  
		  graphData.dataNodes = jsonData.nodes;
		  graphData.dataEdges = jsonData.edges;
		  graphData.dataRelations = jsonData.relations;
		  
		  graphData.force
			  .nodes(jsonData.nodes)
			  .links(jsonData.edges)
			  .start();
		  
		  var link = graphData.svg.selectAll(".link")
			  .data(jsonData.edges)
			.enter()
			  .append("line")
			  .attr("class", "link")
			  .on('mouseover', graphData.tip.show)
			  .on('mouseout', graphData.tip.hide);

		  var node = graphData.svg.selectAll(".node")
			  .data(jsonData.nodes)
			.enter()
			  .append("g")
			  .attr("class", "node")
			  .call(graphData.force.drag);
			  
		  self.processNormalNodes(node);
		  self.processNumberNodes(node);
		  self.processStringNodes(node);
		  self.processImageNodes(node);
		  self.processUrlNodes(node);
		  self.processObjectNodes(node);

		  graphData.force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			// add from visual-rdf.js
			//link.attr("x", function(d) { return (d.source.x+d.target.x)/2; })
			//    .attr("y", function(d) { return (d.source.y+d.target.y)/2; });
			
			node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			
			// visual-rdf.js
			//linkArrowhead.attr("points", function(d) {
			//  	  return [[d.target.x,d.target.y+10].join(","),
			//  	  	[d.target.x-3,d.target.y+16].join(","),
			//  	  [d.target.x+3,d.target.y+16].join(",")].join(" ");
			//  })
			//  .attr("transform",function(d) {
			//  	  angle = Math.atan2(d.target.y-d.source.y, d.target.x-d.source.x)*180/Math.PI + 90;
			//  	  return "rotate("+angle+", "+d.target.x+", "+d.target.y+")";
			//  });
		  }); // force.on(tick)
		  
		}); // d3.json(...)
	},
	
	init: function(){
		// tip
		graphData.tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
			var tmp = graphData.dataRelations.first( function(i){ return i.url == d.relation } );
			return "<span style='color:gray'>" + ( tmp == null ? "predicate(" + d.relation + ")" : tmp.title ) + "</span>";
		  });
		// svg
		if( this.svgContainer == null)
			graphData.svg = d3.select("body").append("svg")
				.attr("width", this.width)
				.attr("height", this.height);
		else
			graphData.svg = d3.select("#" + this.svgContainer).append("svg")
				.attr("width", this.width)
				.attr("height", this.height);
		graphData.svg.call(graphData.tip);
		// force
		graphData.force = d3.layout.force()
			.gravity(this.forceGravity)
			.distance(this.forceDistance)
			.charge(this.forceCharge)
			.size([this.width, this.height]);
		
	}
	
};


