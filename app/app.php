<?php

// =================================================

if ( $_POST['action'] == "load_db" )
{
    $dir    = '../json/';
    $scan = scandir($dir);

    array_shift($scan);
    array_shift($scan);

    $count = count($scan);

    $files = "[";
    for ( $i=0; $i<=$count-1; $i++ ) {
            $files .= '"'.str_replace( ".json", "", $scan[$i] ).'"';
            if ( $i < $count-1 ) {
                $files .= ',';
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

if ( $_POST['action'] == "upload_db" )
{
    if ( $_FILES['file'] && ($_FILES['file']['size'] > 0) && ($_FILES['file']['type'] == 'application/octet-stream') ) {
        $file = $_FILES['file'];
        $name = $_FILES['file']['name'];
        $name_wo = substr( $name, 0, count($name)-6 );
        
        preg_match('/.json/', $name, $is_json);
        preg_match('/[a-zA-Z0-9]+/', $name_wo, $is_correct_name);
        
        if ( $is_json && $is_correct_name ) {
            move_uploaded_file( $file['tmp_name'], "../json/".$name );
        }
    }
    header("location: /");
}

// =================================================

if ( $_GET["db"] )
{
    $file = "../json/".$_GET["db"].".json";

    if (file_exists($file)) 
    {
        // сбрасываем буфер вывода PHP, чтобы избежать переполнения памяти выделенной под скрипт
        // если этого не сделать файл будет читаться в память полностью!
        if (ob_get_level()) {
            ob_end_clean();
        }
        // заставляем браузер показать окно сохранения файла
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . basename($file));
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file));
        // читаем файл и отправляем его пользователю
        readfile($file);
        exit;
    }
}

// =================================================

?>