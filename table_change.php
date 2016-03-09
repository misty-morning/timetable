<?php
	include 'db_connect.php';
	$action = $_POST['action'];

	if ($action == 'add') {
		$name = $_POST['name'];

		$query = "INSERT INTO tables (name) VALUES ('".$name."')";

		mysqli_query($dbc, $query);
		$id = mysqli_insert_id($dbc);

		$answer = array('id' => $id);
	}
	echo json_encode($answer);
	mysqli_close($dbc);
?>