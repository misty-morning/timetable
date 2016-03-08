<?php
	include 'db_config.php';

	$data = $_POST['name'];

	$dbc = mysqli_connect($db_host, $db_user, $db_password, $db_name);
	$charset = mysqli_set_charset($dbc, "utf8");

	$query = "INSERT INTO test (name) VALUES ('".$data."')";
	mysqli_query($dbc, $query);

	mysqli_close($dbc);
?>