<?php
	include 'db_config.php';
?>
<?php
/*	$dbc = mysqli_connect($db_host, $db_user, $db_password, $db_name) or die ('Ошибка соединения с MySQL-сервером');

	$test_query = "INSERT INTO `t_table`(`name`, `test`) VALUES ('hey', 'heey')";
	$result = mysqli_query($dbc, $test_query) or die ('Ошибка при выполнении запроса к базе данных');

	mysqli_close($dbc);*/

?>
<!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="lib/normalize.css">
		<link rel="stylesheet" type="text/css" href="index.css">
 		<title>Расписание</title>
	</head>
<body>
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