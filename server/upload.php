<?php

/*
 * asyncupload.js
 * https://github.com/damianpolak/asyncupload.js
 *
 * Copyright 2017, Damian Polak
 * lib used: Bootstrap 4.0.0
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 */

$root = $_SERVER['DOCUMENT_ROOT'].'/asyncupload.js/';
if(isset($_FILES)) {

  // debug
  echo '<pre>';
  print_r($_FILES);
  echo '</pre>';

  $uploadDir = $root.'uploads/';
  $approvedFiles = json_decode($_POST['approvedFiles']);

  foreach ($_FILES['userfile']['error'] as $key => $error) {
    if ($error == UPLOAD_ERR_OK) {
      $tmpName = $_FILES['userfile']['tmp_name'][$key];
      $fileName = basename($_FILES['userfile']['name'][$key]);
      $path = $uploadDir . $fileName;

      foreach($approvedFiles as $key => $object) {
        if(strpos($path, $object->name))
          move_uploaded_file($tmpName, $path);
      }
    }
  }

  foreach($_FILES['userfile']['error'] as $item => $error) {
    $n = $_FILES['userfile']['name'][$item];
  }
}

?>
