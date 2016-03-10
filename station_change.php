<?php
	include 'db_connect.php';
	$action = $_POST['action'];
	
	if ($action == 'add') {
		$name = $_POST['name'];
		$hours = $_POST['hours'];
		$minutes = $_POST['minutes'];
		$staying = $_POST['staying'];
		$parent = $_POST['parent'];

		$query = "INSERT INTO stations (name, parent, hours, minutes, staying) VALUES ('".$name."', '".$parent."', '".$hours."', '".$minutes."', '".$staying."')";
		//$query = "INSERT INTO test (name) VALUES ('".$name."')";

		mysqli_query($dbc, $query);
		$id = mysqli_insert_id($dbc);

		$answer = array('id' => $id);
	}
	else if ($action == 'delete') {
		$id = $_POST['id'];

		$query = "DELETE FROM stations WHERE id=".$id."";
		$result = mysqli_query($dbc, $query);

		$answer = array('result' => $result);
	}
	else if ($action == 'change_time') {
		$id = $_POST['id'];
		$hours = $_POST['hours'];
		$minutes = $_POST['minutes'];

		$query = "UPDATE stations SET hours='".$hours."', minutes='".$minutes."' WHERE id='".$id."'";
		$result = mysqli_query($dbc, $query);

		$answer = array('result' => $result);

	}
	else if ($action == 'change_staying') {
		$id = $_POST['id'];
		$staying = $_POST['staying'];

		$query = "UPDATE stations SET staying='".$staying."' WHERE id='".$id."'";
		$result = mysqli_query($dbc, $query);

		$answer = array('result' => $result);

	}
	echo json_encode($answer);
	mysqli_close($dbc);
?>