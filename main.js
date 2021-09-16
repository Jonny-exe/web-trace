var root
var url = "https://en.wikipedia.org/wiki/Special:Random"
var treeData = [];

const depth = 3

async function get_links() {
	const { data } = await axios.get("http://localhost/nodes.php", { params: { url , depth }})
	return data;
}

async function generate_tree() {
	var data = await get_links()
  console.log(data)
	console.log(data.length)
	// for (let i = 0; i < data.length; i++) {
	// 	console.log(data[i])
	// 	treeData[0].children.push({name: data[i].name, parent: "Start", "size": 3938})
	// }
  treeData = [data.nodes]
  var allLinks = data.all_links
  console.log(treeData)

	var width = 1000
	var height = 1000
	var radius = width / 2

	var svg = d3.select("body")
		.append("svg")
			.attr("width", width)
			.attr("height", height)
		.append("g")
			.attr("transform", "translate(" + radius + "," + radius + ")");


	var cluster = d3.cluster()
		.size([360, radius - 270]);  // 360 means whole circle. radius - 60 means 60 px of margin around dendrogram

	// Give the data to this cluster layout:
	var root = d3.hierarchy(treeData[0], function(d) {
		return d.children;
	});
	cluster(root);

	// Features of the links between nodes:
	var linksGenerator = d3.linkRadial()
		.angle(function(d) { return d.x / 180 * Math.PI; })
		.radius(function(d) { return d.y; });

	// Add the links between nodes:
	svg.selectAll('path')
		.data(root.links())
		.enter()
		.append('path')
		.attr("d", linksGenerator)
		.style("fill", 'none')
		.attr("stroke", '#ccc')


	// Add a circle for each node.
	svg.selectAll("g")
		.data(root.descendants())
		.enter()
		.append("g")
		.attr("transform", function(d) {
			return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
		})
		.append("circle")
		.attr("r", 2)
		.style("fill", "#ffffff")
		.attr("stroke", "black")
		.style("stroke-width", 0.5)

	svg.selectAll("g")
		.append("text")
		.attr("dx", 12)
		.attr("dy", 12)
		.text(function(d) {return d.data.name})
		.attr("font-family", "sans-serif")
		.attr("font-size", "10px")

	svg.selectAll("g")
    .attr("class", function(d) {return d.data.name});
  

  let table = ""
  console.log(allLinks)
  for (let i = 0; i < allLinks.length; i++) {
    var link = allLinks[i]
    if (link.length > 40) {
      link = link.substr(0, 40) + "..."
    }
    table += `<tr><td>${link}</td></tr>`
  }

  table = `<table>${table}</table`
  console.log(table)
  document.getElementById("list").innerHTML = table
  console.log("finished")
}

generate_tree()


console.log(document.getElementById("find"))
document.getElementById("find").addEventListener("input", function() {
  console.log("changed")
  var value = document.getElementById("find").value
  var node = document.getElementsByClassName(value)
  console.log(node)
  if (node.length == 0) {return}
  node[0].classList.add("pink")
  console.log("Node: ", node)
})
