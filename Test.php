<?php
ini_set('memory_limit','4048M');
include 'SpellCorrector.php';
include 'simple_html_dom.php';

if(isset($_GET['id'])){
  $qry = $_GET['qry'];
  $result = '';
  $file = file_get_html("./LATimesDownloadData/0a0ab482-3c21-45e5-b8a3-db5615b9db1a.html");
  $body = $file->plaintext;
  $lines = explode(".",$body);
  foreach($lines as $line){
    if (strpos(strtolower($line),strtolower($qry)) !== false) {
      $result = $line;
      break;
  }
}
  header("Access-Control-Allow-Origin: *");
  echo $result;
}

$words = explode(" ",$_GET["qry"]);
$result = "";
foreach ($words as $word){
  $res = SpellCorrector::correct($word);
  $result = $result.$res." ";
}
header("Access-Control-Allow-Origin: *");
echo $result;
?>
