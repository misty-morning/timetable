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
		array_push($error_messages, "tables query hasn't handled");
	}

    if (mysqli_num_rows($tables_result) == 0) {
        array_push($error_messages, "No tables data has come");
    }
	while ($row = mysqli_fetch_array($tables_result)) {
		$tables[$row['id']] = $row['name'];
    }

	$stations_query = "SELECT * FROM stations";
	$stations_result = mysqli_query($dbc, $stations_query);
	if (!$stations_result) {
		array_push($error_messages, "stations query hasn't handled");
	}
	class station {
		public $id;
		public $name;
		public $parent;
		public $hours;
		public $minutes;
		public $staying;
	}
	$stations = array();
	while ($row = mysqli_fetch_array($stations_result)) {
		$st = new station();
		$st->id = $row['id'];
		$st->name = $row['name'];
		$st->parent = $row['parent'];
		$st->hours = $row['hours'];
		$st->minutes = $row['minutes'];
		$st->staying = $row['staying'];
		array_push($stations, $st);
    }
    $pre_tables = array();
    class table {
		public $id;
		public $name;
		public $stations = array();
    }
    $count = 0;
    foreach($tables as $id => $name) {
    	$pre_tables[$count] = new table();
    	$pre_tables[$count]->id = $id;
    	$pre_tables[$count]->name = $name;
    	//$pre_tables[$name] = new table();
    	//$pre_tables[$name]->id = $id;
    	//$pre_tables[$name]->name = $name;
    	for ($i=0; $i < count($stations); $i++) { 
    		if($stations[$i]->parent == $id) {
    			array_push($pre_tables[$count]->stations, $stations[$i]);
    		}
    	}
    	$count++;
    }

    mysqli_close($dbc);

	$pre_tables = json_encode($pre_tables);
?>
<!DOCTYPE html>
<html lang="ru">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" type="text/css" href="lib/normalize.css">
		<link rel="stylesheet" type="text/css" href="index.css">
 		<title>Расписание</title>
	</head>
<body>
	<script type="text/javascript" src="lib/jquery-2.2.1.min.js"></script>


	<p class="server-errors">
		<?php 
			//echo 'test: ' . $test . "<br>";
			if ($error_messages) {
				foreach ($error_messages as $message) {
					echo 'server error: ' . $message . "<br>";
				}
			}
		?>
	</p>
	<script type="text/javascript">
		//window.preTables = $.parseJSON( <?php echo "'" . $pre_tables . "'" ?> );
		window.preTables = <?php echo $pre_tables; ?>;
		console.log(window.preTables);
	</script>
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

	
	<script type="text/javascript" src="index.js"></script>
</body>
</html>