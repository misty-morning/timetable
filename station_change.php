<?php
	include 'db_config.php';

	$dbc = mysqli_connect($db_host, $db_user, $db_password, $db_name);
	$charset = mysqli_set_charset($dbc, "utf8");

	$action = $_POST['action'];
	
	if ($action == 'add') {
		$name = $_POST['name'];
		$hours = $_POST['hours'];
		$minutes = $_POST['minutes'];
		$staying = $_POST['staying'];

		$query = "INSERT INTO stations (name, parent, hours, minutes, staying) VALUES ('".$name."', '2', '".$hours."', '".$minutes."', '".$staying."')";
		//$query = "INSERT INTO test (name) VALUES ('".$name."')";
	}
	mysqli_query($dbc, $query);
	mysqli_close($dbc);
?>