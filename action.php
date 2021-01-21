<?php 

require('db_connection.php');

// check for POST variable
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents("php://input");
    $mydata = json_decode($data, true);
   
    $id = $mydata['id'];
    $name = $mydata['name'];
    $country = $mydata['country'];
    $gender = $mydata['gender'];
        
    
    if(!empty($name) && !empty($country) && !empty($gender)){

        $query = "INSERT INTO `users` (`id`, `name`, `country`, `gender`) VALUES ('$id', '$name', '$country', '$gender') ON DUPLICATE KEY UPDATE name = '$name', country = '$country', gender = '$gender'";

        if(mysqli_query($conn, $query)){
            echo ' User saved successfully';
        } else {
            echo "ERROR: Unable to save user". mysqli_error($conn);
        }
    } else {
        echo "error";
    }

}

// check for GET variable

if($_SERVER['REQUEST_METHOD'] === 'GET') {
   
    $query = "SELECT * FROM users ORDER BY created_at DESC";

    $result = mysqli_query($conn, $query);
    
    if($rows = mysqli_fetch_all($result, MYSQLI_ASSOC)) {
        echo json_encode($rows);
    } else {
        echo http_response_code(204);
    }
       	
}

// // check for PUT variable
// if($_SERVER['REQUEST_METHOD'] === 'PUT') {
//     $data = file_get_contents("php://input");
//     $mydata = json_decode($data, true);
    
//     $id = $mydata['id'];
//     $name = $mydata['n'];
//     $country = $mydata['c'];
//     $gender = $mydata['g'];

//     $query = "UPDATE users SET name = '$name', country = '$country', gender = '$gender' WHERE id = '$id'";

//      if(mysqli_query($conn, $query)){
//         echo ' Updated successfully';
//     } else {
//         echo "ERROR: Unable to update user". mysqli_error($conn);
//     }
// }


// check for DELETE variable
if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = file_get_contents("php://input");
    $mydata = json_decode($data, true);

    $id = $mydata['id'];

    $query = "DELETE FROM users WHERE id={$id}";

    if(mysqli_query($conn, $query)){
        echo ' Deleted successfully';
    } else {
        echo "ERROR: Unable to delete user". mysqli_error($conn);
    }

}
// mysqli_close($conn);
 ?>