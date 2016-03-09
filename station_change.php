<?php
	include 'db_connect.php';
	//header("content-type:application/json");
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
	//$test = array('test', 'huest');
	echo json_encode($answer);
	//return json_encode($test);
	mysqli_close($dbc);
?>