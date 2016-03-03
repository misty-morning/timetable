<?php
	$db_host = "localhost";
	$db_user = "root";
	$db_password = "5413";
	$db_name = "time_table";

	$dbc = mysqli_connect($db_host, $db_user, $db_password, $db_name) or die ('Ошибка соединения с MySQL-сервером');
?>