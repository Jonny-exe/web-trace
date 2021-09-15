<?php
header("Access-Control-Allow-Origin: *");

if ($_GET["url"]) {
  $url = $_GET["url"];
}

function extract_links($url) {

  $data=file_get_contents($url);
  $data = strip_tags($data,"<a>");
  $d = preg_split("/<\/a>/",$data);
  $links = array();
  foreach ( $d as $k=>$u ){
    if( strpos($u, "<a href=") !== FALSE ){
      $u = preg_replace("/.*<a\s+href=\"/sm","",$u);
      $u = preg_replace("/\".*/","",$u);
      # print $u."\n";
      array_push($links, $u);
    }
  }
  return $links;
}

$json_response = json_encode(extract_links($url));
echo $json_response;

?>
