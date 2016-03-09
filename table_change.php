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
	else if ($action == 'delete') {
		$id = $_POST['id'];

		$query = "DELETE FROM tables WHERE id=".$id."";
		$result = mysqli_query($dbc, $query);

		$answer = array('result' => $result);
	}
	echo json_encode($answer);
	mysqli_close($dbc);
?>