<?php
	include 'db_config.php';
?>
<?php
	$dbc = mysqli_connect($db_host, $db_user, $db_password, $db_name);
	$charset = mysqli_set_charset($dbc, "utf8");
	setlocale(LC_ALL, 'ru_RU.65001', 'rus_RUS.65001', 'Russian_Russia. 65001', 'russian');
	$error_messages = array();
	if (!$charset) {
		array_push($error_messages, "No charset set");
	}
	if (!$dbc) {
		array_push($error_messages, "No connection to the base");
	}

	$tables_query = "SELECT * FROM tables";
	$tables_result = mysqli_query($dbc, $tables_query);
	if (!$tables_result) {
		array_push($error_messages, "The query hasn't handled");
	}

    if (mysqli_num_rows($tables_result) == 0) {
        array_push($error_messages, "No data has come");
    }

	//$stations_query = "SELECT * FROM stations";
	//$stations_result = mysqli_query($dbc, $stations_query) or die ('Ошибка при выполнении запроса к базе данных');

	while ($row = mysqli_fetch_array($tables_result)) {
		$tables[$row['id']] = $row['name'];
    }
    mysqli_close($dbc);
?>
<!DOCTYPE html>
<html lang="ru">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<!-- <meta charset="utf-8">  -->
		<link rel="stylesheet" type="text/css" href="lib/normalize.css">
		<link rel="stylesheet" type="text/css" href="index.css">
 		<title>Расписание</title>
	</head>
<body>
	<p class="server-errors">
		<?php 
			if ($error_messages) {
				foreach ($error_messages as $message) {
					echo 'server error: ' . $message . "<br>";
				}
			}
		?>
	</p>
	<script type="text/javascript">
/*		window.preTables = [
			<?php
				while ($row = mysql_fetch_assoc($tables_result)) {
				        echo $row["id"];
				        echo $row["name"];
				    }
			?>
		];*/
	</script>
	<p> 
		<?php 
			foreach ($tables as $key => $value) {
				echo $key . " " . $value . "<br>";
			}
		?>
	</p>
	<p class="board__head">Информационное табло</p>
	<div class="board" id="board"></div>
	<div class="select-block">
		<div id="new-table-modal" class="modal">
			<label for="table-name-input">Имя</label>
			<br>
			<input id="table-name-input" type="text">
			<p id="new-table-warn" class="warn">TEST</p>
			<div class="modal-end-btns">
				<button id="new-table-ok">OK</button>
				<button id="new-table-no">Отмена</button>	
			</div>

		</div>
		<div id="del-table-modal" class="modal">
			<p>
				Выберите расписание для удаления
			</p>
			<select id="del-table-select">
				<option disabled="disabled">Расписание</option>
			</select>
			<br>
			<div class="modal-end-btns">
				<button id="del-table-ok">OK</button>
				<button id="del-table-no">Отмена</button>
			</div>		
		</div>	
		<span>Расписание</span>
		<select id="select-table">
			
		</select>
		<button id="new-table">Новое</button>

		<button id="delete-table">Удалить</button>

	</div>

	<div class="table-block">
		<div class="table-block__station-management">
			<div id="new-station-modal" class="modal">
				<label for="station-name-input">Название</label>
				<br>
				<input id="station-name-input" class="modal-input" type="text">
				<br>
				<label for="station-time-input">Время прибытия</label>
				<br>
				<input id="station-time-input" class="modal-input" type="time">
				<br>
				<label class="station-stay-input-label" for="station-stay-input">Время стоянки</label>
				<br>
				<input id="station-stay-input" class="time-number-input" min='0' type="number">
				<br>
				<p id="new-station-warn" class="warn">TEST</p>
				<div class="modal-end-btns">
					<button id="new-station-ok">OK</button>
					<button id="new-station-no">Отмена</button>
				</div>
			</div>
			<div id="del-station-modal" class="modal">
				<p>
					Выберите станцию для удаления
				</p>
				<select id="del-station-select">
					<option disabled="disabled">Станция</option>
				</select>
				<div class="modal-end-btns">
					<button id="del-station-ok">OK</button>
					<button id="del-station-no">Отмена</button>
				</div>
			</div>
			<button id="new-station">Добавить остановку</button>
			<button id="delete-station">Удалить</button>

		</div>
		<table id="table" class="table-block__table">
			<tr>
				<th>
					№
				</th>
				<th>
					Станция
				</th>
				<th>
					Время прибытия
				</th>
				<th>
					Время отправления
				</th>
				<th>
					Время стоянки
				</th>
				<th>
					Время до следующей стоянки
				</th>
			</tr>
		</table>
		<div class="table-block__table-management">
			<button id="start-table">Старт</button>
			<button id="stop-table">Стоп</button>	
		</div>
	</div>

	<script type="text/javascript" src="lib/jquery-2.2.1.min.js"></script>
	<script type="text/javascript" src="index.js"></script>
</body>
</html>