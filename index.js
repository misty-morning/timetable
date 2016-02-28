var ui = {
	table: "#table",
	selectTable: "#select-table",
	newTable: "#new-table",
	newTableModal: "#new-table-modal",
	deleteTable: "#delete-table",
	tableNameInput: "#table-name-input",
	newTableOk: "#new-table-ok",
	newTableNo: "#new-table-no",
	newStation: "#new-station",
	newStationModal: "#new-station-modal",
	deleteStation: "#delete-station",
	stationNameInput: "#station-name-input",
	stationTimeInput: "#station-time-input",
	stationStayInput: "#station-stay-input",
	newStationOk: "#new-station-ok",
	newStationNo: "#new-station-no",
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
			


			var arrivalHoursEL = "<input type='number' min='0' max='23' data-id='"+i+"' class='time-number-input arrival-hour' value='"+this.stations[i].arrivalTime.getHours()+"'>";
			var arrivalMinutesEL = "<input type='number' min='0' max='59' data-id='"+i+"' class='time-number-input arrival-minute' value='"+this.stations[i].arrivalTime.getMinutes()+"'>";
			var arrival = arrivalHoursEL + " : " + arrivalMinutesEL;
			if (i !== 0 && i !== this.stations.length - 1) {
				var stayTimeEl = "<input class='stay-time time-number-input' data-id='"+i+"' type='number' value='"+ this.stations[i].stayingTime +"'> мин.";
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
		$(".arrival-hour").change(function() {
			var id = $(this).data("id");
			
			var hours = parseInt($(this).val());
			var minutes = parseInt($(".arrival-minute[data-id='"+ id +"']").val());
			activeTable.stations[id].arrivalTimeChange(hours, minutes);
			activeTable.stations[id].nextStationWay = activeTable.stations[id + 1].arrivalTime.getTime() - activeTable.stations[id].departureTime.getTime();
			if (activeTable.stations[id].nextStationWay < 0 || activeTable.stations[id].time < activeTable.stations[id - 1].departureTime.getTime()) {
				activeTable.sort();
				activeTable.renderAll();
			}
			else {
				activeTable.sort();
				activeTable.renderStationWay();
				activeTable.renderDepartureTime();				
			}

		});
		$(".arrival-minute").change(function() {
			var id = $(this).data("id");
			
			var hours = parseInt($(".arrival-hour[data-id='"+ id +"']").val());
			var minutes = parseInt($(this).val());
			activeTable.stations[id].arrivalTimeChange(hours, minutes);
			activeTable.stations[id].nextStationWay = activeTable.stations[id + 1].arrivalTime.getTime() - activeTable.stations[id].departureTime.getTime();
			if (activeTable.stations[id].nextStationWay < 0 || activeTable.stations[id].time < activeTable.stations[id - 1].departureTime.getTime()) {
				activeTable.sort();
				activeTable.renderAll();
			}
			else {
				activeTable.sort();
				activeTable.renderStationWay();
				activeTable.renderDepartureTime();				
			}

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
		//this.stations[0].stayingTime = "Станция отправления";
		//this.stations[this.stations.length - 1].stayingTime = "Станция прибытия";
		//this.stations[this.stations.length - 1].stayingTime = "Станция прибытия";

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

//console.log(time.getMilliseconds());

var mskSpb = new Table("Москва - Спб", new Station("Москва", 8, 0), new Station("Санкт-Петербург", 23, 30));
mskSpb.add(new Station("Тверь", 10, 15, 20));
mskSpb.add(new Station("Бологое", 13, 37, 7));
mskSpb.add(new Station("Малая Вишера", 20, 40, 5));

var mskPod = new Table("Подольск - Москва", new Station("Подольск", 7, 10), new Station("Москва", 9, 0));
mskPod.add(new Station("Царицыно", 8, 15, 3));
mskPod.add(new Station("Красный строитель", 8, 37, 5));

var tables = [mskSpb, mskPod];
var activeTable = tables[0];

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
	});
	$ui.stopTable.click(function() {
		clearBoard();
	});

	$ui.selectTable.change(function() {
		var id = $(this).children("option:selected").attr("value");
		activeTable = tables[id];
		activeTable.renderAll();
		//if (tableActive) restartBoard();
		clearBoard();
	});
	$ui.newTable.click(function() {
		$ui.newTableModal.show();
	});
	$ui.newTableOk.click(function() {
		var name = $ui.tableNameInput.val();
		tables.push(new Table(name));
		activeTable = tables[tables.length - 1];
		activeTable.renderAll();
		fillSelect();
		//if (tableActive) restartBoard();
		clearBoard();
		$ui.selectTable.children("option[value='"+(tables.length - 1)+"']").prop('selected', true);
		$ui.newTableModal.hide();
	});
	$ui.newTableNo.click(function() {
		$ui.newTableModal.hide();
	});

	$ui.newStation.click(function() {
		$ui.newStationModal.show();
	});
	$ui.newStationOk.click(function() {
		var name = $ui.stationNameInput.val();
		var time = $ui.stationTimeInput.val();
		var hours = parseInt(time[0] + time[1]);
		var minutes = parseInt(time[3] + time[4]);
		var stay = parseInt($ui.stationStayInput.val());
		//console.log(hours + minutes);
		activeTable.add(new Station(name, hours, minutes, stay));
		activeTable.renderAll();
		$ui.newStationModal.hide();
	});
	$ui.newStationNo.click(function() {
		$ui.newStationModal.hide();
	});

});

