<?php
    if ( !empty($_POST['data']) && !empty($_POST['blog']) )
    {
        $file = '../posts/'.$_POST['blog'].'.json';
        $data = $_POST['data'];
        file_put_contents($file, $data);
    }
?>