var ui = {
	table: "#table",
	selectTable: "#select-table",

	newTable: "#new-table",
	newTableModal: "#new-table-modal",
	deleteTable: "#delete-table",
	tableNameInput: "#table-name-input",
	newTableOk: "#new-table-ok",
	newTableNo: "#new-table-no",
	newTableWarn: "#new-table-warn",

	delTableModal: "#del-table-modal",
	delTableSelect: "#del-table-select",
	delTableOk: "#del-table-ok",
	delTableNo: "#del-table-no",

	newStation: "#new-station",
	newStationModal: "#new-station-modal",
	deleteStation: "#delete-station",
	stationNameInput: "#station-name-input",
	stationTimeInput: "#station-time-input",
	stationStayInput: "#station-stay-input",
	stationStayInputLabel: ".station-stay-input-label",
	newStationOk: "#new-station-ok",
	newStationNo: "#new-station-no",
	newStationWarn: "#new-station-warn",

	delStationModal: "#del-station-modal",
	delStationSelect: "#del-station-select",
	delStationOk: "#del-station-ok",
	delStationNo: "#del-station-no",

	startTable: "#start-table",
	stopTable: "#stop-table",

	board: "#board",
};
var $ui = {};
for (el in ui) {
	$ui[el] = $(ui[el]);
}
//console.log($ui);
function millisecondToTime(millisecond) {
	var hours = Math.floor(((millisecond / 1000) / 60) / 60);
	var minutes = Math.floor((millisecond / 1000) / 60) % 60;
	//console.log(hours + ":" + minutes);
	return hours + " ч. " + minutes + " мин.";
}
function fillSelect() {
	$ui.selectTable.empty();
	for (var i = 0; i < tables.length; i++) {
		$ui.selectTable.append("<option value='"+i+"'>"+tables[i].name+"</option");
	};	
}
function timeForInput(hours, minutes) {
	hours = hours.toString();
	minutes = minutes.toString();
	if (hours.length == 1) hours = '0' + hours;
	if (minutes.length == 1) minutes = '0' + minutes;

	return hours + ":" + minutes;
}
function timePrefix(time) {
	time = time.toString();
	if (time.length == 1) time = '0' + time;
	return time;
}
var Station = function(name, arrivalHour, arrivalMin, stayingTime) {
	this.name = name;
	this.arrivalTime = new Date();
	this.arrivalTime.setHours(arrivalHour);
	this.arrivalTime.setMinutes(arrivalMin, 0);
	this.time = this.arrivalTime.getTime();
	this.departureTime = new Date();
	this.departureTime.setHours(arrivalHour);
	this.departureTime.setMinutes(arrivalMin, 0);
	if (stayingTime) {
		this.departureTime.setMinutes(this.arrivalTime.getMinutes() + stayingTime);
	}
	this.stayingTime = Math.floor(((this.departureTime.getTime() - this.arrivalTime.getTime()) / 1000) / 60);
	//console.log(this.stayingTime);
	//console.log(this.stayingTime);
	this.stayChange = function(minutes) {
		//this.stayingTime = minutes;
		this.departureTime.setMinutes(this.arrivalTime.getMinutes() + minutes);
		this.stayingTime = Math.floor(((this.departureTime.getTime() - this.arrivalTime.getTime()) / 1000) / 60);
		//console.log(this.stayingTime);

	}
	this.arrivalTimeChange = function(hours, minutes) {
		this.arrivalTime.setHours(hours, 0);
		this.arrivalTime.setMinutes(minutes, 0);
		this.time = this.arrivalTime.getTime();
		this.departureTime.setHours(hours);
		this.departureTime.setMinutes(this.arrivalTime.getMinutes() + this.stayingTime);
		//this.stayingTime = ((this.departureTime.getTime() - this.arrivalTime.getTime()) / 1000) / 60;
	}

}
var Table = function(name, firstStation, lastStation) {
	this.name = name;
	this.stations = [];
	if (firstStation) {
		this.stations.push(firstStation);
	}
	if (lastStation) {
		this.stations.push(lastStation);
	}
	this.renderAll = function() {
		$(".tt-row").remove();
		for (var i = 0; i < this.stations.length; i++) {
			var arrivalHoursEL = "<input type='number' min='0' max='23' data-id='"+i+"' class='time-number-input arrival-hour management-el' value='"+ timePrefix(this.stations[i].arrivalTime.getHours())+"'>";
			var arrivalMinutesEL = "<input type='number' min='0' max='59' data-id='"+i+"' class='time-number-input arrival-minute management-el' value='"+timePrefix(this.stations[i].arrivalTime.getMinutes())+"'>";
			var arrival = arrivalHoursEL + " : " + arrivalMinutesEL;
			if (i !== 0 && i !== this.stations.length - 1) {
				var stayTimeEl = "<input class='stay-time time-number-input management-el' data-id='"+i+"' min='0' type='number' value='"+ this.stations[i].stayingTime +"'> мин.";
				var departureTimeEl = "<span class='departure-time' data-id='"+i+"'>"+ this.stations[i].departureTime.getHours() + ":" + this.stations[i].departureTime.getMinutes() +"</span>";
			}
			else {
				var stayTimeEl = "";
				var departureTimeEl = "";
			}
			if (i !== this.stations.length - 1) {
				var newStationWay = millisecondToTime(this.stations[i].nextStationWay);
			}
			else {
				var newStationWay = "";
			}

			$ui.table.append("<tr class='tt-row'><td>"+ (i + 1) +"</td><td>"+ this.stations[i].name +
				"</td><td>" + arrival + "</td><td>"+ departureTimeEl +"</td><td>"+ stayTimeEl +
				"</td><td class='station-way' data-id='"+i+"'>"+ newStationWay +"</td></tr>");
		};
		$(".stay-time").change(function() {
			var id = $(this).data("id");
			var minutes = parseInt($(this).val());
			//console.log(id);
			activeTable.stations[id].stayChange(minutes);
			activeTable.sort();
			activeTable.renderStationWay();
			activeTable.renderDepartureTime();
		});
		function setNewArrivalTime(id, hours, minutes) {
			var newTime = new Date();
			newTime.setHours(hours, 0);
			newTime.setMinutes(minutes, 0);
			var newDepTimeMs = newTime.getTime() + (activeTable.stations[id].stayingTime*1000*60);
			if (activeTable.stations[id + 1] && newDepTimeMs >= activeTable.stations[id + 1].arrivalTime.getTime()) {
				alert("Неверное время");
				return false;
			}
			else if (activeTable.stations[id - 1] && newTime.getTime() <= activeTable.stations[id - 1].departureTime.getTime()) {
				alert("Неверное время");
				return false;
			}
			else {
				activeTable.stations[id].arrivalTimeChange(hours, minutes);

				if (id !== activeTable.stations.length - 1) {
					activeTable.stations[id].nextStationWay = activeTable.stations[id + 1].arrivalTime.getTime() - activeTable.stations[id].departureTime.getTime();
				}
				else {
					activeTable.stations[id].nextStationWay = 0;
				}
				activeTable.sort();
				if (activeTable.stations[id].nextStationWay < 0 || (activeTable.stations[id - 1] && activeTable.stations[id].time < activeTable.stations[id - 1].departureTime.getTime())) {
					//if (activeTable.stations[id].departureTime.getTime() > activeTable.stations[id + 1].arrivalTime.getTime() && activeTable.stations[id].departureTime.getTime() < (activeTable.stations[id + 1].arrivalTime.getTime() + activeTable.stations[id].stayingTime)) {
	/*				if (activeTable.stations[id].departureTime.getTime() > activeTable.stations[id + 1].arrivalTime.getTime()) {

						alert("Неправильное время");
					}
					else {
						activeTable.renderAll();
					}*/
					activeTable.renderAll();
				}
				else {
					
					activeTable.renderStationWay();
					activeTable.renderDepartureTime();				
				}
				return true;
			}

		}
		$(".arrival-hour").change(function() {
			var id = $(this).data("id");
			var hours = parseInt($(this).val());
			var minutes = parseInt($(".arrival-minute[data-id='"+ id +"']").val());
			var timeChanged = setNewArrivalTime(id, hours, minutes);
			if (!timeChanged) {
				$(this).val(activeTable.stations[id].arrivalTime.getHours());
				$(".arrival-minute[data-id='"+ id +"']").val(activeTable.stations[id].arrivalTime.getMinutes())
			}
			$(this).val(timePrefix($(this).val()));
		});
		$(".arrival-minute").change(function() {
			var id = $(this).data("id");
			var hours = parseInt($(".arrival-hour[data-id='"+ id +"']").val());
			var minutes = parseInt($(this).val());
			var timeChanged = setNewArrivalTime(id, hours, minutes);
			if (!timeChanged) {
				$(this).val(activeTable.stations[id].arrivalTime.getMinutes());
				$(".arrival-hour[data-id='"+ id +"']").val(activeTable.stations[id].arrivalTime.getHours())
			}
			$(this).val(timePrefix($(this).val()));
		});
	}
	this.renderStationWay = function() {
		for (var i = 0; i < this.stations.length - 1; i++) {
			var newStationWay = millisecondToTime(this.stations[i].nextStationWay);
			$(".station-way[data-id='"+i+"']").html(newStationWay);
		}
		$(".station-way[data-id='"+ (this.stations.length - 1)+"']").html("");
	}
	this.renderDepartureTime = function() {
		for (var i = 0; i < this.stations.length; i++) {
			//var newStationWay = millisecondToTime(this.stations[i].nextStationWay);
			if (i === this.stations.length - 1) {
				$(".departure-time[data-id='"+i+"']").html("");
			}
			else {
				$(".departure-time[data-id='"+i+"']").html(this.stations[i].departureTime.getHours() + ":" + this.stations[i].departureTime.getMinutes());
			}
		}
		
	}
	this.sort = function() {
		var count = this.stations.length - 1;
		for (var i = 0; i < count; i++) {
			for (var j = 0; j < count-i; j++) {
				if (this.stations[j].time > this.stations[j+1].time) {
					var max = this.stations[j];
					this.stations[j] = this.stations[j+1];
					this.stations[j+1] = max;
				}
			}
		}

		for (var i = 0; i < count; i++) {
			this.stations[i].nextStationWay = this.stations[i + 1].arrivalTime.getTime() - this.stations[i].departureTime.getTime();
		}

	}
	this.add = function(station) {
		this.stations.push(station);
		this.sort();
		//this.renderAll();
	}

	//this.renderAll();
}

function saveAllTables() {
	//var jsonTables = JSON.stringify(tables);
	//localStorage.setItem("tables", jsonTables);
/*	for (var i = 0; i < tables.length; i++) {
		var jsonTable = JSON.stringify(tables[i]);
		localStorage.setItem("table" + i, jsonTable);
		localStorage.setItem("activeTableId", activeTable.id);
	};*/
}
if (window.sessionStorage && window.localStorage && localStorage.getItem("tables")) {

}
else {
	var mskSpb = new Table("Москва - Спб", new Station("Москва", 8, 0), new Station("Санкт-Петербург", 23, 30));
	mskSpb.add(new Station("Тверь", 10, 15, 20));
	mskSpb.add(new Station("Бологое", 13, 37, 7));
	mskSpb.add(new Station("Окуловка", 17, 33, 4));
	mskSpb.add(new Station("Малая Вишера", 20, 40, 5));

	var mskPod = new Table("Подольск - Москва", new Station("Подольск", 7, 10), new Station("Москва", 9, 0));
	mskPod.add(new Station("Царицыно", 8, 15, 3));
	mskPod.add(new Station("Красный строитель", 8, 37, 5));

	var tables = [mskSpb, mskPod];
	var activeTable = tables[0];
	activeTable.id = 0;

}


function board(activeTable) {
	//console.log("board");
	$ui.board.html("Расписание активно");
	var time = new Date().getTime();
	for (var i = 0; i < activeTable.stations.length; i++) {
		var remainingMinutesж
		var timeToAnnounce = activeTable.stations[i].time - 15*60*1000;
		if(time >= timeToAnnounce && time < activeTable.stations[i].time) {
			remainingMinutes = Math.ceil(((activeTable.stations[i].time - time) / 1000) / 60);
			//console.log(remainingMinutes);
			$ui.board.html("Следующая станция: " + activeTable.stations[i].name + ". Прибытие через "+ remainingMinutes +" минут.");
			break;
		}
		else if (time >= activeTable.stations[i].time && time <= activeTable.stations[i].departureTime.getTime()) {
			remainingMinutes = Math.ceil(((activeTable.stations[i].departureTime.getTime() - time) / 1000) / 60);
			$ui.board.html("Стоянка: " + activeTable.stations[i].name + ". Отправление через "+ remainingMinutes +" минут.");
			break;
		}
	};

}

$(document).ready(function() {
	activeTable.renderAll();
	fillSelect();
	var boardIntervalID;
	var interval = 1000;
	function restartBoard() {
		clearInterval(boardIntervalID);
		$ui.board.empty();
		boardIntervalID = setInterval("board(activeTable)", interval);	
	}
	function clearBoard() {
		clearInterval(boardIntervalID);
		$ui.board.empty();
	}
	//var tableActive = false;
	$ui.startTable.click(function() {
		//tableActive = true;
		board(activeTable);
		boardIntervalID = setInterval("board(activeTable)", interval);
		$(".management-el").prop("disabled", true);
		$ui.newTable.prop("disabled", true);
		$ui.deleteTable.prop("disabled", true);
		$ui.newStation.prop("disabled", true);
		$ui.deleteStation.prop("disabled", true);
		$ui.selectTable.prop("disabled", true);
	});
	$ui.stopTable.click(function() {
		clearBoard();
		$(".management-el").prop("disabled", false);
		$ui.newTable.prop("disabled", false);
		$ui.deleteTable.prop("disabled", false);
		$ui.newStation.prop("disabled", false);
		$ui.deleteStation.prop("disabled", false);
		$ui.selectTable.prop("disabled", false);
	});

	$ui.selectTable.change(function() {
		var id = $(this).children("option:selected").attr("value");
		activeTable = tables[id];
		activeTable.id = id;
		activeTable.renderAll();
		//if (tableActive) restartBoard();
		clearBoard();
	});
	$ui.newTable.click(function() {
		$ui.newTableModal.show();
		$ui.newTableWarn.hide();
		$ui.newTableWarn.empty();
	});
	$ui.newTableOk.click(function() {
		if ($ui.tableNameInput.val() !== "") {
			$ui.newTableWarn.hide();
			$ui.newTableWarn.empty();

			var name = $ui.tableNameInput.val();
			tables.push(new Table(name));
			activeTable = tables[tables.length - 1];
			activeTable.id = tables.length - 1;
			activeTable.renderAll();
			fillSelect();
			//if (tableActive) restartBoard();
			clearBoard();
			$ui.selectTable.children("option[value='"+(tables.length - 1)+"']").prop('selected', true);

			$ui.newTableModal.hide();
			$ui.tableNameInput.val("");
		}
		else {
			$ui.newTableWarn.show();
			$ui.newTableWarn.html("Введите имя");
		}

	});
	$ui.newTableNo.click(function() {
		$ui.newTableModal.hide();
	});
	$ui.deleteTable.click(function() {
		$ui.delTableSelect.empty();
		for (var i = 0; i < tables.length; i++) {
			$ui.delTableSelect.append("<option value='"+i+"'>"+ tables[i].name +"</option>");
		};

		$ui.delTableModal.show();
	});
	$ui.delTableNo.click(function() {
		$ui.delTableModal.hide();
	});
	$ui.delTableOk.click(function() {
		var id = $ui.delTableSelect.children("option:selected").attr("value");

		tables.splice(id, 1);
		if (activeTable.id === id) {
			activeTable = tables[0];
			activeTable.id = 0;
			activeTable.renderAll();
		}
		fillSelect();

		$ui.delTableModal.hide();
	});


	$ui.newStation.click(function() {
		$ui.newStationModal.show();
		$ui.newStationWarn.hide();
		$ui.newStationWarn.empty();
		$ui.stationStayInput.show();
		$ui.stationStayInputLabel.show();
		if (activeTable.stations.length < 2) {
			$ui.stationStayInput.val(0);
			$ui.stationStayInput.hide();
			$ui.stationStayInputLabel.hide();
		}
	});
	$ui.newStationOk.click(function() {


		if ($ui.stationTimeInput.val() !== "" && $ui.stationNameInput.val() !== "" && $ui.stationStayInput.val() !== "") {
			$ui.newStationWarn.hide();
			$ui.newStationWarn.empty();
			var name = $ui.stationNameInput.val();
			var time = $ui.stationTimeInput.val();
			var hours = parseInt(time[0] + time[1]);
			var minutes = parseInt(time[3] + time[4]);

			var stay = parseInt($ui.stationStayInput.val());
			//console.log(hours + minutes);
			activeTable.add(new Station(name, hours, minutes, stay));
			activeTable.renderAll();

			$ui.newStationModal.hide();
			$ui.stationNameInput.val("");
			$ui.stationTimeInput.val("");
			$ui.stationStayInput.val("");
		}
		else {
			$ui.newStationWarn.show();
			$ui.newStationWarn.html("Заполните все поля");
		}

	});
	$ui.newStationNo.click(function() {
		$ui.newStationModal.hide();
	});
	$ui.deleteStation.click(function() {
		$ui.delStationSelect.empty();
		for (var i = 0; i < activeTable.stations.length; i++) {
			//activeTable.stations[i]
			$ui.delStationSelect.append("<option value='"+i+"'>"+ activeTable.stations[i].name +"</option>");
		};
		$ui.delStationModal.show();
	});
	$ui.delStationNo.click(function() {
		$ui.delStationModal.hide();
	});
	$ui.delStationOk.click(function() {
		var id = $ui.delStationSelect.children("option:selected").attr("value");
		//console.log(id);
		activeTable.stations.splice(id, 1);
		activeTable.sort();
		activeTable.renderAll();
		$ui.delStationModal.hide();
	});
});

