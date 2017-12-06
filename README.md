lore-graph
==========

A graph layout based on d3js.

**Params** when initialize:  
layout：layout algorithm (to do)  


**how to use**  
see test1.html  

**node types**  
1. number  
2. string  
3. uri  
4. image_uri
5. object_uri

**json data structure:**  
{  
object-uri: "",  
nodes: [  
{ id: "int or string, unique", type: "number/string/uri/image-uri/object_uri", value: "", icon: "ImageUrl" },  
{ id: "int or string, unique", type: "number/string/uri/image-uri/object_uri", value: "", icon: "ImageUrl" },  
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
