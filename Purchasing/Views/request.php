<?php
include '../../connection.php';
session_start();
//find the current user
$user = $_SESSION["username"];
//find his level of security
$secsql = "SELECT security_level, employee_ID
           FROM employee
           WHERE employee_name = '$user'";
$secResult = mysqli_query($link, $secsql);

while($row = mysqli_fetch_array($secResult)){
  $user_sec_lvl = $row[0];
  $employee_ID = $row[1];
}
?>
<head>
  <title>Fraunhofer CCD</title>
</head>
<body>
  <?php include '../header.php'; ?>
  <?php echo "<input type='hidden' id='employee_ID' value='".$employee_ID."'>"; ?>
  <div class='container'>
    <div class='row well well-lg'>
      <form>
        <h4>Make a request for a purchase order</h4>
        <p class='col-md-6 form-group'>
          <label>Supplier: </label>
          <input type="text" id='request_supplier' class='form-control'>
        </p>
        <p class='col-md-6 form-group'>
          <label>Quantity: </label>
          <input type="text" id='request_quantity' class='form-control'>
        </p>
        <p class='col-md-6 form-group'>
          <label>Approved by: </label>
          <input type="text" id='approved_by_employee' class='form-control'>
        </p>
        <p class='col-md-6 form-group'>
          <label>Description: </label>
          <textarea id='request_description' class='form-control'></textarea>
        </p>
        <input class='form-control btn btn-primary' type="button" value="Request" onclick='orderRequest()'>
      </form>
    </div>
  </div>
</body>
