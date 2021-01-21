<?php

require('db_connection.php');

$data = file_get_contents('php://input');
$mydata = json_decode($data, true);

$id = $mydata['id'];

$query = "SELECT * FROM users WHERE id = '$id'";
$result = mysqli_query($conn, $query);

$row = mysqli_fetch_assoc($result);
    
echo json_encode($row);

?>
