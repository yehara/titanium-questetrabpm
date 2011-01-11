Ti.include('ISO8601Date.js');

function fillZero(/* Number */n, length) {
	return ("0000" + n).slice(-length);
}
function formatHHMM(/* Date */d) {
	return fillZero(d.getHours(), 2) + ':' + fillZero(d.getMinutes(), 2);
}
function formatYYYYMMDD(/* Date */d) {
	return fillZero(d.getFullYear(), 4) + '/' + fillZero(d.getMonth() + 1, 2)
			+ '/' + fillZero(d.getDate(), 2);
}

var WorkitemCell = {};
WorkitemCell.HEIGHT = 60;

WorkitemCell.createWorkitemCell = function(/* Object */workitem) {
	var row = Ti.UI.createTableViewRow({
		height : WorkitemCell.HEIGHT
	});
	if (workitem.processInstanceTitle === null
			|| workitem.processInstanceTitle == "") {
		workitem.processInstanceTitle = '(件名なし)';
	}
	var offerDatetime = new Date();
	offerDatetime.setISO8601(workitem.offerDatetime);
	var now = new Date();
	var offerDateString = '';
	if (now.getTime() - offerDatetime.getTime() < 1000 * 60 * 60 * 24
			&& now.getDate() == offerDatetime.getDate()) {
		offerDateString = formatHHMM(offerDatetime);
	} else {
		offerDateString = formatYYYYMMDD(offerDatetime);
	}
	var processModelNameLabel = Ti.UI.createLabel({
		text : workitem.processModelInfoName,
		left : 10,
		right : 50,
		top : 4,
		height : 12,
		font : {
			fontSize : 12
		}
	});
	var nodeNameLabel = Ti.UI.createLabel({
		text : workitem.nodeName,
		left : 10,
		right : 50,
		top : 18,
		height : 12,
		font : {
			fontSize : 12
		}
	});
	var titleLabel = Ti.UI.createLabel({
		text : workitem.processInstanceTitle,
		left : 20,
		right : 50,
		top : 32,
		height : 21,
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		}
	});
	var dateLabel = Ti.UI.createLabel({
		text : offerDateString,
		right : 10,
		width : 100,
		top : 0,
		height : 21,
		textAlign : 'right',
		color : '#0000DD',
		font : {
			fontSize : 12
		}
	});
	row.add(processModelNameLabel);
	row.add(nodeNameLabel);
	row.add(titleLabel);
	row.add(dateLabel);
	return row;
};

WorkitemCell.createMessageCell = function(message) {
	var row = Ti.UI.createTableViewRow({
		height : WorkitemCell.HEIGHT
	});
	var label = Ti.UI.createLabel({
		text : message,
		textAlign: 'center',
		left : 20,
		right : 20,
		font : {
			fontSize : 12
		}
	});
	row.add(label);
	return row;
};


