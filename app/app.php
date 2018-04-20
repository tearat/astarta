<?php

// =================================================

if ( $_POST['action'] == "load_db" )
{
    $dir    = '../json/';
    $scan = scandir($dir);

    array_shift($scan);
    array_shift($scan);
    $key = array_search('main.json', $scan);
    unset($scan[$key]);

    $count = count($scan);

    $files = "[";
    for ( $i=0; $i<=$count-1; $i++ ) {
        if ( $scan[$i] != "main.json" ) {
            $files .= '"'.str_replace( ".json", "", $scan[$i] ).'"';
            if ( $i < $count-1 ) {
                $files .= ',';
            }
        }
    }
    $files .= "]";

    echo $files;
}

// =================================================

if ( $_POST['action'] == "save_db" )
{
    $data = $_POST['data'];

    $file = '../json/'.$_POST['link'].'.json';

    file_put_contents($file, $data);
}

// =================================================

if ( $_POST['action'] == "delete_db" )
{
    $file = '../json/'.$_POST['link'].'.json';
    unlink($file);
}

// =================================================

?>