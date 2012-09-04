<?php
$fname = $_POST['name'];
if (preg_match('/^\w+$/',$fname)) {
    $was = @filesize('save/'.$fname);
    $was = is_numeric($was)? "was $was bytes": "new file";
    file_put_contents('save/'.$fname, $_POST['tcgt']);
    echo ("Wrote ".strlen($_POST['tcgt'])." bytes into file '$fname' ($was)");
 } 
else
    echo ("'$fname' is not a valid name");
?>