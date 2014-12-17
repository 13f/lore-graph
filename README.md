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
{ id: "", type: "number/string/url/ImageUrl", value: "" },  
{ id: "", type: "number/string/url/ImageUrl", value: "" },  
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
