<?php
include '../../connection.php';
$esignature = mysqli_real_escape_string($link, $_POST['esignature']);
$user = $_SESSION["username"];

// Find the e-signature of the employee that is logged in
$sql = "SELECT employee_signature
        FROM employee
        WHERE employee_name = '$user';";
$result = mysqli_query($link, $sql);
$row = mysqli_fetch_array($result);

if($esignature == 'on'){
  echo "<p> Signature: <input type='image' src='../Scan/getSignature.php' width='100' height='100' onerror=\"this.src='../images/noimage.jpg'\"/></p>";
}else{
  echo"<p id='signatureLine'> Signature: <hr id='signature'></p>";
}
?>
