<?php
header("Access-Control-Allow-Origin: *");

if ($_GET["url"]) {
  $url = $_GET["url"];
} else {
  $url = "https://wikipedia.org";
}

if ($_GET["depth"]) {
  $depth = $_GET["depth"];
} else {
  $depth = 1;
}

$GLOBALS["all_links"] = array();
function extract_links($url, $idx) {
  if ($idx == 2) {
    return array();
  }

  $data=file_get_contents($url);
  $data = strip_tags($data,"<a>");
  $d = preg_split("/<\/a>/",$data);
  $links = array();
  foreach ( $d as $k=>$u ){
    if( strpos($u, "<a href=\"http") !== FALSE ){
      $u = preg_replace("/.*<a\s+href=\"/sm","",$u);
      $u = preg_replace("/\".*/","",$u);
      # print $u."\n";
      if (in_array($u, $GLOBALS["all_links"])) {
        continue;
      }
      array_push($GLOBALS["all_links"], $u);
      $children = extract_links($u, $idx+1);
      array_push($links, array("name" => $u, "children" => $children, "parent" => $url));
    }
  }
  # return array("name" => $url, "children" => $links, "parent" => $parent);
  return $links;
}

$nodes = array("name" => $url, "children" => extract_links($url, 0, "null"));
$json_response = json_encode(array("all_links" => $GLOBALS["all_links"], "nodes" => $nodes, "parent" => $parent));
echo $json_response;

?>
