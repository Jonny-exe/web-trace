var root
var treeData = [];

var url = ""
var depth

async function get_links(url, depth) {
  const hosturl = "http://localhost/nodes.php"
	const { data } = await axios.get(hosturl, { params: { url , depth }})
	return data;
}

async function generate_tree(url, depth) {
	var data = await get_links(url, depth)
  console.log(data)
	console.log(data.length)
  document.querySelector("svg")?.remove()
	// for (let i = 0; i < data.length; i++) {
	// 	console.log(data[i])
	// 	treeData[0].children.push({name: data[i].name, parent: "Start", "size": 3938})
	// }
  document.getElementById("root")?.remove()
  console.log(document.getElementById("root"))
  treeData = [data.nodes]
  var allLinks = data.all_links
  console.log(treeData)

	var width = 2000
	var height = 2000
	var radius = width / 2

	var svg = d3.select("body")
		.append("svg")
			.attr("width", width)
			.attr("height", height)
		.append("g")
			.attr("transform", "translate(" + radius + "," + radius + ")");
 
  let zoom = d3.zoom()
    .on('zoom', handleZoom);

  function handleZoom() {
      d3.select('g')
        .attr('transform', d3.event.transform);
  }

	var cluster = d3.cluster()
		.size([360, radius - 180]);  // 360 means whole circle. radius - 60 means 60 px of margin around dendrogram

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
 
  d3.select('svg')
    .call(zoom);


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
    var shortlink = link
    if (link.length > 40) {
      shortlink = link.substr(0, 40) + "..."
    }
    table += `<tr><td id="${link}">${shortlink}</td></tr>`
  }

  table = `<table>${table}</table`
  console.log(table)
  document.getElementById("list").innerHTML = table
  console.log("finished")

  var trs = document.querySelectorAll("tr")
  for (let i = 0; i < trs.length; i++) {
    trs[i].addEventListener("mouseover", event => {
      console.log(event.target)
      var element = document.getElementsByClassName(event.target.id)
      console.log(element)
      if (element.length == 0) {
        return
      }

      element[0].classList.add("pink")
    })

    trs[i].addEventListener("mouseout", event => {
      console.log(event.target)
      var element = document.getElementsByClassName(event.target.id)
      console.log(element)
      if (element.length == 0) {
        return
      }

      element[0].classList.remove("pink")
    })
  }
}

generate_tree("https://en.wikipedia.org/wiki/Special:Random", 3)


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

document.getElementById("url").addEventListener("change", function() {
  console.log("changed")
  var value = document.getElementById("url").value
  url = value
  console.log(value)
  generate_tree(value, depth)
})

document.getElementById("depth").addEventListener("change", function() {
  var value = document.getElementById("url").value
  depth = value;
  generate_tree(url, value)
})
