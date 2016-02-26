var ui = {
	table: "#table",
	selectTable: "#select-table",
	newTable: "#new-table",
	deleteTable: "#delete-table",
	tableNameInput: "#table-name-input",
	tableNameOk: "#new-table-ok",
	newStation: "#new-station",
	newStationModal: "#new-station-modal",
	deleteStation: "#delete-station",
	stationNameInput: "#station-name-input",
	stationTimeInput: "#station-time-input",
	newStationOk: "#new-station-ok",
	startTable: "#start-table",
	stopTable: "#stop-table",
};
window.App = {
    Models: {},
    Views: {},
    Collections: {},
};
$(document).ready(function() {


	window.App.Models.Station = Backbone.Model.extend({
		defaults: {
			id: 0,
			name: "name",
/*			arrivalTime: new Date,
			departureTime: this.arrivalTime,
			stayingTime: 0,
			timeBeforeTheNext: 0,*/
		},
	});
	window.App.Collections.Table = Backbone.Collection.extend({
		model: window.App.Models.Station,
	});
	window.App.Views.Station = Backbone.Epoxy.View.extend({
		el: "<tr><td class='station-id'></td><td class='station-name'></td><td></td><td></td><td></td><td></td></tr>",
		bindings: {
			"td.station-id" : "text:id",
			"td.station-name" : "text:name",
		},
	});
	window.App.Views.Table = Backbone.Epoxy.View.extend({
	    el: ".table-block",
	    collection: new window.App.Collections.Table(),
	    itemView: window.App.Views.Station,
	    bindings: {
	    	"#table" : "collection:$collection"
	    },
	    events: {
	    	//"click #new-station": "showModal",
	    	"click #new-station-ok": "add",
	    },
	    showModal: function() {
	    	$("#new-station-modal").show();
	    },
	    add: function() {
	    	this.collection.create({name: $("#station-name-input").val()});
	    },
	});
	var table = new window.App.Views.Table();

	$("#new-station").click(function() {
		$("#new-station-modal").show();
	});
});

