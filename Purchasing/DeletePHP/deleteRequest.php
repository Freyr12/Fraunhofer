<?php
include '../../connection.php';
$request_ID = mysqli_real_escape_string($link, $_POST['request_ID']);

// Delete all quotes linked to this request
$quoteSql = "DELETE FROM quote
						 WHERE request_ID = '$request_ID';";
$quoteResult = mysqli_query($link, $quoteSql);

// After we delete the quotes we can delete the request
$sql = "DELETE FROM order_request
				WHERE request_ID ='$request_ID';";
$result = mysqli_query($link, $sql);

if(!$result){
	die("Could not delete request: ".mysqli_error($link));
}

mysqli_close($link);
?>
