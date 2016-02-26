
var graphData = {
    tip: null,
    svg: null,
    force: null,
    // 将JSON中的数据解析出来，用于检索
    dataNodes: [],
    dataEdges: [],
    dataRelations: []
};

var LoreGraph = {
    // 参数
    svgContainer: null, // 存放svg的div，如果为null，则自己在body中append svg
    width: 960,
    height: 600,
    iconWidth: 30,
	iconHeight: 40,

    gravity: 0.1, // default: 0.1
    linkDistance: 200, // default: 20
    linkStrength: 1, // 0--1, default: 1
    charge: -1000, // default: -30
    //chargeDistance: ?, // 如果distance 被指定，设置电荷强度已经应用的最大距离。如果distance 未被指定，返回当前最大电荷距离，默认为无穷大。指定一个有限电荷距离提高力导向图的性能和产生更本地化的布局。限定距离的电荷力是尤其有用当合自定义重力一起使用时。
    friction: 0.9, // 0--1, default: 0.9

    callbackAfterProcess: null,
    // ==============================================================


    processNormalNodes: function (node) {
        var tmp = node.filter(function (d) { return d.type === null || d.type === "" });
        if (node.icon)
            tmp.append("image")
                .attr("xlink:href", function (d) { return d.icon })
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", 16)
                .attr("height", 16);
        tmp.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.value });
    },

    processNumberNodes: function (node) {
        var tmp = node.filter(function (d) { return d.type === "number" });
        if (node.icon)
            tmp.append("image")
                .attr("xlink:href", function (d) { return d.icon })
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", 16)
                .attr("height", 16);
        tmp.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.value });
    },

    processStringNodes: function (node) {
        var tmp = node.filter(function (d) { return d.type === "string" });
        if (node.icon)
            tmp.append("image")
                .attr("xlink:href", function (d) { return d.icon })
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", 16)
                .attr("height", 16);
        tmp.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.value });
    },

    processUrlNodes: function (node) {
        var tmp = node.filter(function (d) { return d.type === "uri" });
        tmp.append("a")
            .attr("xlink:href", function (d) { return d.value })
            .attr("target", "_new");
        if (node.icon)
            tmp.append("image")
                .attr("xlink:href", function (d) { return d.icon })
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", 16)
                .attr("height", 16);
    },

    processImageNodes: function (node) {
        var tmp = node.filter(function (d) { return d.type === "image_uri" });
        tmp.append("image")
            .attr("xlink:href", function (d) { return d.icon })
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 16)
            .attr("height", 16);
    },

    processObjectNodes: function (node) {
        var tmp = node.filter(function (d) { return d.type === "object_uri" });
        if (node.icon)
            tmp.append("image")
                .attr("xlink:href", function (d) { return d.icon })
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", 16)
                .attr("height", 16);
        tmp.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.value });
    },

    processData: function (nodes, edges, relations) {
        var self = this;
        // clear first
        graphData.svg.selectAll("*")
			.remove();

        graphData.dataNodes = nodes;
        graphData.dataEdges = edges;
        graphData.dataRelations = relations;

        var svg = graphData.svg;
        var force = graphData.force
							.nodes(graphData.dataNodes)
							.links(graphData.dataEdges)
							.start();

        var edges_line = svg.selectAll("line")
                            .data(graphData.dataEdges)
                            .enter()
                            .append("line")
                            .attr("class", "line");

        var edges_text = svg.selectAll(".linetext")
                            .data(graphData.dataEdges)
                            .enter()
                            .append("text")
                            .attr("class", "linetext")
                            .text(function (d) {
                                return d.relation;
                            });

        //var drag = force.drag()
        //            .on("dragstart", function (d, i) {
        //                d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
        //                label_text_2.text("拖拽状态：开始");
        //            })
        //            .on("dragend", function (d, i) {
        //                label_text_2.text("拖拽状态：结束");
        //            })
        //            .on("drag", function (d, i) {
        //                label_text_2.text("拖拽状态：进行中");
        //            });

        var node = svg.selectAll(".node")
            .data(graphData.dataNodes)
          .enter()
            .append("g")
            .attr("class", "node")
            .call(graphData.force.drag);

        //self.processNormalNodes(node);
        //self.processNumberNodes(node);
        //self.processStringNodes(node);
        //self.processImageNodes(node);
        //self.processUrlNodes(node);
        //self.processObjectNodes(node);

        var nodes_img = svg.selectAll("image")
                            .data(graphData.dataNodes)
                            .enter()
                            .append("image")
                            .attr("width", self.iconWidth)
                            .attr("height", self.iconHeight)
                            .attr("xlink:href", function (d) {
                                return d.icon;
                            })
                            .on("mouseover", function (d, i) {
                                //显示连接线上的文字
                                edges_text.style("fill-opacity", function (edge) {
                                    if (edge.source === d || edge.target === d) {
                                        return 1.0;
                                    }
                                });
                            })
                            .on("mouseout", function (d, i) {
                                //隐去连接线上的文字
                                edges_text.style("fill-opacity", function (edge) {
                                    if (edge.source === d || edge.target === d) {
                                        return 0.0;
                                    }
                                });
                            })
                            //.on("dblclick", function (d, i) {
                            //    d.fixed = false;
                            //})
                            .call(force.drag);//drag

        var text_dx = -20;
        var text_dy = 20;

        var nodes_text = svg.selectAll(".nodetext")
                            .data(graphData.dataNodes)
                            .enter()
                            .append("text")
                            .attr("class", "nodetext")
                            .attr("dx", text_dx)
                            .attr("dy", text_dy)
                            .text(function (d) {
                                return d.value;
                            });

        force.on("tick", function () {
            //限制结点的边界
            graphData.dataNodes.forEach(function (d, i) {
                d.x = d.x - self.iconWidth / 2 < 0 ? self.iconWidth / 2 : d.x;
                d.x = d.x + self.iconWidth / 2 > self.width ? self.width - self.iconWidth / 2 : d.x;
                d.y = d.y - self.iconHeight / 2 < 0 ? self.iconHeight / 2 : d.y;
                d.y = d.y + self.iconHeight / 2 + text_dy > self.height ? self.height - self.iconHeight / 2 - text_dy : d.y;
            });

            //更新连接线的位置
            edges_line.attr("x1", function (d) { return d.source.x; });
            edges_line.attr("y1", function (d) { return d.source.y; });
            edges_line.attr("x2", function (d) { return d.target.x; });
            edges_line.attr("y2", function (d) { return d.target.y; });

            //更新连接线上文字的位置
            edges_text.attr("x", function (d) { return (d.source.x + d.target.x) / 2; });
            edges_text.attr("y", function (d) { return (d.source.y + d.target.y) / 2; });


            //更新结点图片和文字
            nodes_img.attr("x", function (d) { return d.x - self.iconWidth / 2; });
            nodes_img.attr("y", function (d) { return d.y - self.iconHeight / 2; });

            nodes_text.attr("x", function (d) { return d.x });
            nodes_text.attr("y", function (d) { return d.y + self.iconWidth / 2; });
        });

        if (self.callbackAfterProcess) // callback
            self.callbackAfterProcess();
    },

    processJsonData: function (jsonData) {
        var self = this;
        self.processData(jsonData.nodes, jsonData.edges, jsonData.relations);
    },

    process: function (url) {
        var self = this;
        d3.json(url, function (error, jsonData) {
            self.processData(jsonData.nodes, jsonData.edges, jsonData.relations);
        }); // d3.json(...)
    },

    init: function () {
        // tip
        graphData.tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function (d) {
              var tmp = graphData.dataRelations.first(function (i) { return i.uri == d.relation });
              return "<span style='color:gray'>" + (tmp == null ? "predicate(" + d.relation + ")" : tmp.title) + "</span>";
          });
        // svg
        if (this.svgContainer === null)
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
            .gravity(this.gravity)
            .linkDistance(this.linkDistance)
            //.linkStrength(this.linkStrength)
            .charge(this.charge)
            .friction(this.friction)
            .size([this.width, this.height]);

    }

};
