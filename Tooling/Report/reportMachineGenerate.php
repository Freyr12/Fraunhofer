<?php
/*
	This file generates the report data from the user input
*/

include '../connection.php';
session_start();

$machine       = mysqli_real_escape_string($link, $_POST['machine_ID']);
$first_date    = mysqli_real_escape_string($link, $_POST['date_from']);
$last_date     = mysqli_real_escape_string($link, $_POST['date_to']);
$date_type     = mysqli_real_escape_string($link, $_POST['date_type']);
$show_discount = mysqli_real_escape_string($link, $_POST['show_discount']);

if($show_discount != 'on'){
	$hide_discount = "style='display:none' ";
}
//Get machine name from machine_ID
$machSql = "SELECT machine_name
						FROM machine
						WHERE machine_ID = '$machine'";
$machResult = mysqli_query($link, $machSql);
while($row = mysqli_fetch_array($machResult)){
	$machine_name = $row[0];
}
$date_format = "";
if($date_type == "Year"){
	$date_format = "%Y";
}
if($date_type == "Month"){
	$date_format = "%Y/%m";
}
if($date_type == "Week"){
	$date_format = "%Y/%m/%u";
}

/*
	Query that fetches most of the info needed.
	The date type can be MONTH, YEAR or WEEK and the query
	is grouped by that.
*/

$poSql = "SELECT DATE_FORMAT(run_date, '".$date_format."'), COUNT(DISTINCT r.run_ID), ROUND(SUM(lir.number_of_items_in_run * l.price)/SUM(lir.number_of_items_in_run), 2), ROUND(AVG(TOTAL_WEEKDAYS(receiving_date, run_date)), 2), SUM(ROUND(l.price * lir.number_of_items_in_run, 2)), m.machine_acronym, SUM(lir.number_of_items_in_run)
				  FROM machine m, pos p, run r, lineitem l, lineitem_run lir
				  WHERE m.machine_ID = r.machine_ID
				  AND r.run_ID = lir.run_ID
				  AND lir.lineitem_ID = l.lineitem_ID
				  AND l.po_ID = p.po_ID ";

// Query that fetches info from the discount table and makes sure that
// we don't count the same lineitem twice.
// If the item doesn't have a discount, then the table will show 0 instead of NULL
$lineitemSql = "SELECT IF(SUM(p.amount) IS NULL, 0, SUM(p.amount)), IF(SUM(p.total) IS NULL, 0, SUM(ROUND(p.total, 2))), SUM(l.quantity)
								FROM lineitem AS l
									LEFT JOIN (SELECT lineitem_ID, discount_ID, SUM(number_of_tools) AS amount, SUM(discount * number_of_tools) AS total
						 					   FROM discount
						 					   GROUP BY lineitem_ID) AS p
									ON l.lineitem_ID = p.lineitem_ID, pos, machine m, lineitem_run lir, run r
								WHERE pos.po_ID = l.po_ID
								AND r.run_ID = lir.run_ID
						    AND lir.lineitem_ID = l.lineitem_ID
						    AND m.machine_ID = r.machine_ID ";

if($machine != 'machine'){
	if(!empty($machine)){
		$poSql .= "AND m.machine_ID = '$machine' ";
		$lineitemSql .= "AND m.machine_ID = '$machine' ";
	}
}

// We don't want to calculate the revenue from POs that haven't been shipped yet
$poSql .= "AND p.po_ID NOT IN (SELECT po_ID
		  				     FROM pos
		                     WHERE shipping_date IS NULL) ";
$lineitemSql .= "AND pos.po_ID NOT IN (SELECT po_ID
				  				   FROM pos
				                   WHERE shipping_date IS NULL) ";

// Filtering options
if(!empty($first_date)){
	$poSql 		 .= "AND run_date >= '$first_date' ";
	$lineitemSql .= "AND run_date >= '$first_date' ";
}
if(!empty($last_date)){
	$poSql 		 .= "AND run_date <= '$last_date' ";
	$lineitemSql .= "AND run_date <= '$last_date' ";
}
if($machine != 'machine'){
	$poSql 		 .= "GROUP BY YEAR(run_date), ".$date_type." (run_date) DESC;";
	$lineitemSql .= "GROUP BY YEAR(run_date), ".$date_type." (run_date) DESC;";
}else{
	$poSql 		 .= "GROUP BY r.machine_ID;";
	$lineitemSql .= "GROUP BY m.machine_ID";
}
$poResult = mysqli_query($link, $poSql);

$lineitemResult = mysqli_query($link, $lineitemSql);

if(!$poResult){echo "po error " .mysqli_error($link);}

if(!$lineitemResult){echo "lineitem error " . mysqli_error($link);}

?>
<!-- The header of the output table -->
<div id='output'>
	<h4><?php echo $machine_name;?></h4>
	<table class='table table-striped table-bordered'>
		<tr>
			<?php
				if($machine != 'machine'){
					echo "<th>Date</th>";
				}else{
					echo "<th>Machine</th>";
				} ?>
			<th># of runs</th>
			<th># of tools</th>
		    <th>Avg tool price</th>
			<th>Avg time to run W/O weekends</th>
			<?php echo "<th ".$hide_discount.">Number of tools with discount</th>"; ?>
			<?php echo "<th ".$hide_discount.">Sum of discount</th>"; ?>
			<th>Avg run revenue</th>
			<th>Revenue</th>
		<tr>
<?php
while($row = mysqli_fetch_array($poResult)){
	$lrow = mysqli_fetch_array($lineitemResult);
	if($show_discount == 'on'){
		$final_price = $row[4] - $lrow[1];
		$avgToolPrice = ($final_price / $row[6]);
	}
	else{
		$final_price = $row[4];
		$avgToolPrice = ($row[4] / $row[6]);
	}
	echo "<tr>";
	if($machine != 'machine'){
		echo "<td>".$row[0]."</td>";// month
	}else{
		echo "<td>".$row[5]."</td>";// machine name
	}
		echo "<td>".$row[1]."</td>";// # of runs
		echo "<td>".$row[6]."</td>";// # of tools
		echo "<td>$".$row[2]."</td>";// AVG tool price
		echo "<td>".$row[3]."</td>";// AVG turn around time
		// echo "<td>".$lrow[2]."</td>";// total tools
		echo "<td ".$hide_discount.">".$lrow[0]."</td>";// Number of tools with discount
		echo "<td ".$hide_discount.">".$lrow[1]."</td>";//	Total Discount $
		echo "<td>$".round($final_price/$row[1], 2)."</td>";// average run price
		echo "<td>$".$final_price."</td>";// Total price
}
?>
	</table>
</div>
