Ti.include('httpclient.js');
Ti.include('workitemCell.js');

var win = Ti.UI.currentWindow;
var tab = Ti.UI.currentWindow.tabGroup.tabs[0];
var emptyRow = WorkitemCell.createMessageCell('割り当てられているタスクはありません');

var reloadButton = Ti.UI.createButton({
	systemButton : Ti.UI.iPhone.SystemButton.REFRESH
});
var tableView = Ti.UI.createTableView();
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
		row.hasChild = false;
		data.push(row);
	}
	tab.setBadge(workitems.length > 0 ? workitems.length : null);
	if(workitems.length == 0) {
		data.push(emptyRow);
	}
	tableView.setData(data);
}

function update() {
	var contextRoot = Ti.App.Properties.getString('url');
	HttpClient.send({
		url : contextRoot + 'API/PE/Workitem/listAllocated',
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
});

/** 状態のクリア。認証設定を変えたときに呼び出す */
function clear() {
	tab.setBadge(null);
	workitems = null;
	tableView.setData([]);	
}
Ti.App.addEventListener('clearAuth', clear);

/** 詳細画面への遷移 */
tableView.addEventListener('click', function(e) {
	var detailwin = Ti.UI.createWindow({
		url : 'workitemDetailWindow.js',
		title : workitems[e.index].processInstanceTitle || '(件名なし)'
	});
	detailwin.workitemId = workitems[e.index].id;
	detailwin.updateWorkitemList = update;
	Ti.UI.currentTab.open(detailwin, {
		animated : true
	});
});

win.add(tableView);
update();
