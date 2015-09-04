<?php
include '../../connection.php';

$request_supplier     = mysqli_real_escape_string($link, $_POST['request_supplier']);
$timeframe            = mysqli_real_escape_string($link, $_POST['orderTimeframe']);
$department           = mysqli_real_escape_string($link, $_POST['department']);
$approved_by_employee = mysqli_real_escape_string($link, $_POST['approved_by_employee']);
$request_description  = mysqli_real_escape_string($link, $_POST['request_description']);
$employee_ID          = mysqli_real_escape_string($link, $_POST['employee_ID']);
$part_number          = mysqli_real_escape_string($link, $_POST['part_number']);
$quantity             = mysqli_real_escape_string($link, $_POST['quantity']);

$sql = "INSERT INTO order_request (employee_ID, timeframe, department, approved_by_employee, request_description, request_date, active, request_supplier, part_number, quantity)
        VALUES ('$employee_ID', '$timeframe', '$department', '$approved_by_employee', '$request_description', CURDATE(), 1, '$request_supplier', '$part_number', '$quantity');";
$result = mysqli_query($link, $sql)
?>
