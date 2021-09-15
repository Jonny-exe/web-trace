var root
var treeData = [
	{
		"name": "Start",
		"parent": "null",
		"children": [
			{
				"name": "Level 2: A",
				"parent": "Start",
				"children": [
					{
						"name": "Son of A",
						"parent": "Level 2: A"
					},
					{
						"name": "Daughter of A",
						"parent": "Level 2: A"
					}
				]
			},
			{
				"name": "Level 2: B",
				"parent": "Top Level"
			}
		]
	}
];

async function get_links() {
	const { data } = await axios.get("http://localhost/nodes.php", { params: { url: "https://lichess.org"}})
	return data;
}

async function generate_tree_2() {
	var data = await get_links()
	console.log(data.length)
	for (let i = 0; i < data.length; i++) {
		console.log(data[i])
		treeData[0].children.push({name: data[i], parent: "Start", "size": 3938})
	}

	// ************** Generate the tree diagram  *****************
	var margin = {top: 40, right: 120, bottom: 20, left: 120},
		width = 960 - margin.right - margin.left,
		height = 500 - margin.top - margin.bottom;

	var i = 0;

	var tree = d3.layout.tree()
		.size([height, width]);

	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.x, d.y]; });

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root = treeData[0];

	update(root);

	function update(source) {

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 100; });

		// Declare the nodes…
		var node = svg.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });

		// Enter the nodes.
		var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { 
				return "translate(" + d.x + "," + d.y + ")"; });

		nodeEnter.append("circle")
			.attr("r", 10)
			.style("fill", "#fff");

		nodeEnter.append("text")
			.attr("y", function(d) { 
				return d.children || d._children ? -18 : 18; })
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.text(function(d) { return d.name; })
			.style("fill-opacity", 1);

		// Declare the links…
		var link = svg.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

		// Enter the links.
		link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", diagonal);

	}
}

async function generate_tree() {
	var data = await get_links()
	console.log(data.length)
	for (let i = 0; i < data.length; i++) {
		console.log(data[i])
		treeData[0].children.push({name: data[i], parent: "Start", "size": 3938})
	}

	var width = 600
	var height = 600
	var radius = width / 2

	var svg = d3.select("body")
		.append("svg")
			.attr("width", width)
			.attr("height", height)
		.append("g")
			.attr("transform", "translate(" + radius + "," + radius + ")");


	var cluster = d3.cluster()
		.size([360, radius - 60]);  // 360 means whole circle. radius - 60 means 60 px of margin around dendrogram

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
		.attr("r", 7)
		.style("fill", "#69b3a2")
		.attr("stroke", "black")
		.style("stroke-width", 2)

	svg.selectAll("g")
		.append("text")
		.attr("dx", 12)
		.attr("dy", "0.35em")
		.text(function(d) {return d.data.name})
		.attr("font-family", "sans-serif")
		.attr("font-size", "10px")
}

generate_tree()
