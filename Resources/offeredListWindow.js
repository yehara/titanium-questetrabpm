Ti.include('httpclient.js');
Ti.include('workitemCell.js');

var win = Ti.UI.currentWindow;
var tab = Ti.UI.currentWindow.tabGroup.tabs[1];
var emptyRow = WorkitemCell.createMessageCell('オファーされているタスクはありません');

var reloadButton = Ti.UI.createButton({
	systemButton : Ti.UI.iPhone.SystemButton.REFRESH
});
var tableView = Ti.UI.createTableView();
var activityIndicator = Titanium.UI.createActivityIndicator({
	style: Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
});
var workitems = [];

function updateTable(client) {
	var o = JSON.parse(client.responseText);
	workitems = o.workitems || [];
	workitems.sort(function(a, b) { /* 日付逆順 */
		if (a.offerDatetime < b.offerDatetime) {
			return 1;
		}
		if (a.offerDatetime > b.offerDatetime) {
			return -1;
		}
		return 0;
	});
	var data = [];
	for ( var i = 0; i < workitems.length; i++) {
		var row = WorkitemCell.createWorkitemCell(workitems[i]);
		data.push(row);
	}
	tab.setBadge(workitems.length > 0 ? workitems.length : null);
	if(workitems.length == 0) {
		data.push(emptyRow);
	}
	tableView.setData(data);
	activityIndicator.hide();
}

function update() {
	var contextRoot = Ti.App.Properties.getString('url');
	HttpClient.send({
		url : contextRoot + 'API/PE/Workitem/listOffered',
		parameters : [],
		success : updateTable
	});
}

reloadButton.addEventListener('click', update);
Ti.UI.currentWindow.rightNavButton = reloadButton;

win.addEventListener('focus', function(){
	if(workitems == null) {
		update();
	}
}) 

/** 状態のクリア。認証設定を変えたときに呼び出す */
function clear() {
	tab.setBadge(null);
	workitems = null;
	tableView.setData([]);	
}
Ti.App.addEventListener('clearAuth', clear);

/**
 * タスク引き受け処理
 * @param workitemId
 */
function accept(workitemId) {
	Ti.API.debug("accept: " + workitemId);
	activityIndicator.show();
	var contextRoot = Ti.App.Properties.getString('url');
	HttpClient.send({
		url : contextRoot + 'API/PE/Workitem/batchAccept',
		parameters : [ [ 'workitemIds', workitemId ] ],
		success : update,
		indicator : activityIndicator
	});
}

/**
 * タスク選択時の処理
 */
tableView.addEventListener('click', function(e) {
	var options = [];
	options.push('引き受ける');
	options.push('キャンセル');
	dialog = Ti.UI.createOptionDialog({
		options : options,
		cancel : 1
	});
	var acceptWorkitemId = workitems[e.index].id;
	dialog.addEventListener('click', function(e) {
		if (e.cancel == e.index) {
			return;
		} else {
			accept(acceptWorkitemId);
		}
	});
	dialog.show();
});

win.add(tableView);
win.add(activityIndicator);
update();
