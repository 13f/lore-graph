/* json-hierarchy.js - v1.0.0.20190910
* https://github.com/13f/lore-graph
* Dependencies:
*    d3.js ^ v5
* Copyright (c) 2019 taurenshaman
*/

var D3Mate = {
    hierarchyData: null,
    tip: null,
    svg: null,
    g: null,

    tree: null,
    zoom: null
}

var JsonHierarchy = {
    // 参数
    svgContainer: null, // 存放svg的div，如果为null，则自己在body中append svg
    width: 960,
    height: 600,
    iconWidth: 30,
    iconHeight: 40,
    
    limitedItems: 64, // 用于性能优化。对于array，只展示limitedItems条数据

    maxLabelWidth: 250,
    transitionDuration: 750,
    transitionEase: 'cubic-in-out',
    minRadius: 5,
    scalingFactor: 2,

    callbackAfterProcess: null,


    convertItem: function(key, item){
        let node = {};
        node.title = key;
        if (typeof item === 'object'){ // null, array, object
            if(Array.isArray(item)){
                node.children = this.arrayToList(item);
            }
            else if(item === null){
                node.title = key;
                node.description = key;
            }
            else{
                node.children = this.objToList(item);
            }
        }
        else if (typeof item === 'undefined'){
            node.title = key;
            node.description = key;
        }
        else if (typeof item === 'string'){
            node.title = key;
            node.description = key;
            node.children = this.valueToList(item);
        }
        else { // number/bigint/boolean/...
            node.title = key;
            node.description = key;
            node.children = this.valueToList(item);
        }
        return node;
    },

    valueToList: function(item) {
        let items = [];
        let node = {
            title: item,
            description: item
        };
        if(item.length > 32){
            node.title = item.substring(0, 30) + "...";
        }
        items.push(node);
        return items;
    },

    objToList: function(obj) {
        let items = [];
        for(var someKey in obj) {
            // We check if this key exists in the obj
            if (obj.hasOwnProperty(someKey)) {
                var item = obj[someKey];
                let node = this.convertItem(someKey, item);
                items.push(node);
            }
        }
        return items;
    },

    arrayToList: function(array){
        let items = [];
        for (var i = 0; i < array.length && i < this.limitedItems; i++) {
            var item = array[i];
            let node = this.convertItem(i, item);
            items.push(node);
        }
        // add a ... item
        if(array.length >= this.limitedItems){
            items.push({
                title: "...",
                description: "Total count: " + array.length
            });
        }
        return items;
    },

    refreshSvg: function (root) {
        let x0 = Infinity;
        let x1 = -x0;
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        const svg = D3Mate.svg; //d3.create("svg")
        // clear first
        svg.selectAll("*").remove();

        svg.attr("viewBox", [0, 0, this.width, x1 - x0 + root.dx * 2]);

        const g = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
        D3Mate.g = g;

        const link = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        const node = g.append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.children ? -6 : 6)
            .attr("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.title)
            .clone(true).lower()
            .attr("stroke", "white");

        node.append("title")
            .text((d, i) => d.data.description ? d.data.description : d.data.title);
    },

    processData: function (url, json) {
        // convert any json to hierarchy json
        let tree = {
            title: "ROOT",
            description: url
        };

        let children = [];
        if (Array.isArray(json)) {
            children = this.arrayToList(json);
        }
        else{
            children = this.objToList(json);
        }
        if (children.length) tree.children = children;

        // console.log("tree:");
        // console.log(tree);
        D3Mate.hierarchyData = tree;

        const root = d3.hierarchy(tree);
        // console.log("root:");
        // console.log(root);
        root.dx = 10;
        root.dy = this.width / (root.height + 1);

        var tmp = d3.tree().nodeSize([root.dx, root.dy])(root);
        this.refreshSvg(tmp);
    },

    process: function (url) {
        var self = this;

        d3.json(url, {crossOrigin: "anonymous"}).then(function(jsonData){
            var root = self.processData(url, jsonData);
        });
    },

    zoomed: function() {
        const {transform} = d3.event;
        D3Mate.g.attr("transform", transform);
        D3Mate.g.attr("stroke-width", 1 / transform.k);
    },

    init: function () {
        // svg
        if (this.svgContainer === null)
            D3Mate.svg = d3.select("body").append("svg")
                .attr("width", this.width)
                .attr("height", this.height);
        else
            D3Mate.svg = d3.select("#" + this.svgContainer).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);
        // tip
        // D3Mate.tip = d3.tip()
        //   .attr('class', 'd3-tip')
        //   .offset([-10, 0])
        //   .html(function (d) {
        //       //var tmp = graphData.dataRelations.first(function (i) { return i.uri == d.relation });
        //       return "<span style='color:gray'>" + (d.description === null ? d.title : d.description) + "</span>";
        //   });
        // D3Mate.svg.call(D3Mate.tip);
        // zoom
        D3Mate.svg.call(d3.zoom()
            //.extent([[0, 0], [this.width, this.height]])
            //.scaleExtent([1, 16])
            .on("zoom", this.zoomed));
    }
}