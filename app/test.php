<?php

$dir    = '../json/';
$scan = scandir($dir);

array_shift($scan);
array_shift($scan);
//$key = array_search('main.json', $scan);
//unset($scan[$key]);

var_dump($scan);
echo "<br>";

$count = count($scan);

$files = "[";
for ( $i=0; $i<=$count-1; $i++ ) {
//    if ( $scan[$i] != "main.json" ) {
        $files .= '"'.str_replace( ".json", "", $scan[$i] ).'"';
        if ( $i < $count-1 ) {
            $files .= ',';
        }
//    }
}
$files .= "]";

echo $files;

?>