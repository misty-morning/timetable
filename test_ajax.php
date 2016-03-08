<?php
	include 'db_connect.php';

	$data = $_POST['name'];



	$query = "INSERT INTO test (name) VALUES ('".$data."')";
	mysqli_query($dbc, $query);

	mysqli_close($dbc);
