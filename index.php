<!DOCTYPE html>
<html lang="en">
  <head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
    <meta charset="utf-8">

    <title>Web trace</title>

    <style>

html {
    width: 100%;
    height: 100%;
}

body {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

 .node circle {
   fill: #fff;
   stroke: steelblue;
   stroke-width: 3px;
 }

 .node text { font: 12px sans-serif; }

 .link {
   fill: none;
   stroke: #ccc;
   stroke-width: 2px;
 }

#list {
  position: absolute;
  left: 0;
  top: 0;
  background: black;
  color: white;
  opacity: 50%;
  text-overflow: auto;
}
#inputs {
  padding: 1%;
  position: absolute;
  right: 0;
  top: 0;
  background: black;
  color: white;
  opacity: 50%;
}

.pink {
  fill: magenta;
}
 
    </style>

  </head>

  <body>

<script src="https://d3js.org/d3.v4.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="main.js" type="module" defer></script>

<div id="list"> </div>
<div id="inputs">
   <div class="form-group">
    <label for="exampleInputName2">Name</label>
    <input id="find" type="text" class="form-control" id="exampleInputName2" placeholder="http://...">
  </div>
    
  <div class="form-group">
    <label for="exampleInputName2">Depth</label>
    <input type="number" class="form-control" id="exampleInputName2" placeholder="3">
  </div>
</div>
</body>
</html>
