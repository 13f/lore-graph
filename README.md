lore-graph
==========

A graph layout based on d3js.

**Params** when initialize:  
api-uri：the url to get data, default type is json.  
layout：layout algorithm  

**json data structure:**  
{  
object-uri: "",  
nodes: [  
{ id: "int or string, unique", type: "number/string/url/image-url", value: "", icon: "ImageUrl" },  
{ id: "int or string, unique", type: "number/string/url/image-url", value: "", icon: "ImageUrl" },  
...  
],  
relations: [  
{ url: "", title: "", description: "" },  
{ url: "", title: "", description: "" },  
...  
],  
edges: [  
{ node1:"[node-id]", relation: "url", node2: "[node-id]" },  
{ node1:"[node-id]", relation: "url", node2: "[node-id]" },  
...  
]  
}

==========

Reference:  
http://d3js.org/  
layout algorithm:  
http://bost.ocks.org/mike/fisheye/  
http://christophermanning.org/projects  
