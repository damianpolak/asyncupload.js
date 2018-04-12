<?php
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
      echo "UPLOAD ERR OK"."<br>";
      $tmpName = $_FILES['userfile']['tmp_name'][$key];
      $name = $uploadDir . basename($_FILES['userfile']['name'][$key]);
      foreach($approvedFiles as $key => $object) {
        if(strpos($name, $object->name))

          move_uploaded_file($tmpName, $name);
          echo "MOVE TMP: ".$tmpName." TO : ". $name.'<br>';
      }
    }
  }

  foreach($_FILES['userfile']['error'] as $item => $error) {
    $n = $_FILES['userfile']['name'][$item];
  }
}

?>
