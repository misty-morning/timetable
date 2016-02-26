var ui = {
	table: "#table",
	selectTable: "#select-table",
	newTable: "#new-table",
	newTableModal: "#new-table-modal",
	deleteTable: "#delete-table",
	tableNameInput: "#table-name-input",
	newTableOk: "#new-table-ok",
	newStation: "#new-station",
	newStationModal: "#new-station-modal",
	deleteStation: "#delete-station",
	stationNameInput: "#station-name-input",
	stationTimeInput: "#station-time-input",
	newStationOk: "#new-station-ok",
	startTable: "#start-table",
	stopTable: "#stop-table",
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
	this.stayingTime = ((this.departureTime.getTime() - this.arrivalTime.getTime()) / 1000) / 60;
	//console.log(this.stayingTime);
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
	this.render = function() {
		$(".tt-row").remove();
		for (var i = 0; i < this.stations.length; i++) {
			var newStationWay = millisecondToTime(this.stations[i].nextStationWay);
			if (i === this.stations.length - 1) {
				newStationWay = "Станция прибытия";
			}
			
			$ui.table.append("<tr class='tt-row'><td>"+ (i + 1) +"</td><td>"+ this.stations[i].name +"</td><td>"
				+ this.stations[i].arrivalTime.getHours() + ":" + this.stations[i].arrivalTime.getMinutes() 
				+"</td><td>"
				+ this.stations[i].departureTime.getHours() + ":" + this.stations[i].departureTime.getMinutes() 
				+"</td><td>"+ this.stations[i].stayingTime +"</td><td>"+ newStationWay +"</td></tr>");
			//this.stations[i];
		};
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
		this.stations[0].stayingTime = "Станция отправления";
		this.stations[this.stations.length - 1].stayingTime = "Станция прибытия";

		for (var i = 0; i < count; i++) {
			this.stations[i].nextStationWay = this.stations[i + 1].arrivalTime.getTime() - this.stations[i].departureTime.getTime();
		}

	}
	this.add = function(station) {
		this.stations.push(station);
		this.sort();
		//this.render();
	}

	//this.render();
}
var time = new Date();
//console.log(time.getMilliseconds());

var mskSpb = new Table("Москва - Спб", new Station("Москва", 8, 0), new Station("Санкт-Петербург", 18, 30));
mskSpb.add(new Station("Тверь", 10, 15, 20));
mskSpb.add(new Station("Бологое", 13, 37, 7));
mskSpb.add(new Station("Малая Вишера", 17, 10, 5));

var mskPod = new Table("Подольск - Москва", new Station("Подольск", 7, 10), new Station("Москва", 9, 0));
mskPod.add(new Station("Царицыно", 8, 15, 3));
mskPod.add(new Station("Красный строитель", 8, 37, 5));

var tables = [mskSpb, mskPod];
var activeTable = tables[0];

function fillSelect() {
	$ui.selectTable.empty();
	for (var i = 0; i < tables.length; i++) {
		$ui.selectTable.append("<option value='"+i+"'>"+tables[i].name+"</option");
	};	
}
$(document).ready(function() {
	activeTable.render();
	fillSelect();

	$ui.selectTable.change(function() {
		var id = $(this).children("option:selected").attr("value");
		activeTable = tables[id];
		activeTable.render();
	});
	$ui.newTable.click(function() {
		$ui.newTableModal.show();
	});
	$ui.newTableOk.click(function() {
		var name = $ui.tableNameInput.val();
		tables.push(new Table(name));
		activeTable = tables[tables.length - 1];
		activeTable.render();
		fillSelect();
		$ui.selectTable.children("option[value='"+(tables.length - 1)+"']").prop('selected', true);
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
		//console.log(hours + minutes);
		activeTable.add(new Station(name, hours, minutes));
		activeTable.render();
		$ui.newStationModal.hide();
	});
});

