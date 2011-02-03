Ti.include('lib/TiDomParser.js');
Ti.include('workitemForm.js');
Ti.include('httpclient.js');

function stripNamespace(obj) {
	if( typeof obj != "object") {
		return;
	}
	for(var key in obj) {
		stripNamespace(obj[key]);
		var tokens = key.split(':');
		if(tokens.length == 2) {
			obj[tokens[1]] = obj[key];
			delete obj[key];
		}
	}
}

var workitemListParser = new com.hamasyou.XML.TiDOMParser();
workitemListParser.force_array = ['form-data','user-select','executing-role','process-data-definition-detail:item','ns2:item','qfile','ns2:sub-data-def'];
var formResultParser = new com.hamasyou.XML.TiDOMParser();
formResultParser.force_array = ['error'];

var win = Ti.UI.currentWindow;
win.stopOpenDetail = false;
Titanium.UI.setBackgroundColor('#fff');

var view = Ti.UI.createTableView({
	minRowHeight: 40
});

/* workitem-form オブジェクト */
var workitem = null;
/* 各データ項目毎の WorkitemForm インスタンスの配列 */
var formItems = null;
var dialog = null; 
/* 各データ項目毎の TableViewRow インスタンス */
var rowData = [];
/* submit ボタン */
var submitButtons = [];
/* 値を編集したかどうか */
var valueModified = false;


/* インジケータ */
var activityIndicator = Titanium.UI.createActivityIndicator({
	style: Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
});
win.activityIndicator = activityIndicator;
win.add(view);
win.add(activityIndicator);

function refreshView() {
	view.setData(rowData);	
}

function updateTable(client) {
	var obj = workitemListParser.dom2Json(client.responseXML);
	stripNamespace(obj);
	workitem = obj['workitem-form'];
	rowData = [];
	formItems = [];
	var deferRendering = false;
	if(workitem['form-data']) {
		for(var i=0; i<workitem['form-data'].length; i++) {
			var formData = workitem['form-data'][i];
			var formItem = WorkitemForm.createForm(formData);
			var row = formItem.getRow();
			formItems.push(formItem);
			rowData.push(row);
			deferRendering |= formItem.deferRendering;
			if(formItem.deferRendering) {
				formItem.onRender = function() {
					refreshView();
				};
			}
		}
	}
	submitButtons = [];
	if(workitem['user-selects'] && workitem['user-selects']['user-select']) {
		var userselects = workitem['user-selects']['user-select'];
		for(var j=0; j<userselects.length; j++) {
			submitButtons.push(userselects[j]);
		}
	} else {
		submitButtons.push({name: 'タスク終了'});
	}	
	view.setData(rowData);
	setTimeout(function(){
		view.setData(rowData);
	}, 100);
    activityIndicator.hide();
}

function update() {
	var contextRoot = Ti.App.Properties.getString('url');
    activityIndicator.show();
    HttpClient.send({
            url: contextRoot + 'API/PE/Workitem/Form/viewXml',
            parameters: [['workitemId', win.workitemId ]],
            success: updateTable,
            indicator: activityIndicator
    });
}

function showSubmitErrorDialog(result) {
	var message = '';
	var errors;
	if(result['process-data-validation-errors'] && result['process-data-validation-errors'].error) {
		errors = result['process-data-validation-errors'].error;
		for(var i=0; i<errors.length; i++) {
			for(var j=0; j<formItems.length; j++) {
				if(errors[i].key.indexOf(formItems[j].paramPrefix,0) == 0) {
					if(message != '') {
						message += '\n';
					}
					message += workitem['form-data'][j].name + ": " + errors[i].detail;
					break;
				}
			}
		}
	} 
	if(result.errors && result.errors.error) {
		errors = result.errors.error;
		for(var i=0; i<errors.length; i++) {
			if(message != '') {
				message += '\n';
			}
			message += errors[i].key + ": " + errors[i].detail;
		}
	} 
	Ti.UI.createAlertDialog({
        title: 'エラー',
        message: message
    }).show();	
}

/**
 * submit のレスポンス処理
 * @param client
 */
function receiveSubmit(client) {
	activityIndicator.hide();
	try {
		var result = formResultParser.dom2Json(client.responseXML).result;
		if(result.success == 'true') {
            Ti.UI.createAlertDialog({
                title: '完了しました',
                message: ''
            }).show();
            win.updateWorkitemList();
            win.close();
		} else {
			showSubmitErrorDialog(result);
		}
	} catch (e) {
		Ti.API.info("receiveSubmit error: " + JSON.stringify(e));
        Ti.UI.createAlertDialog({
            title: '不明エラー',
            message: e + client.responseText
        }).show();			
	}
};

/**
 * submit のリクエスト発行
 * @param saveOnly
 * @param buttonIndex
 */
function submit(/* boolean */saveOnly, buttonIndex) {
    activityIndicator.show();
	var parameters = [['workitemId', win.workitemId ]];
	if(saveOnly) {
		parameters.push(['saveOnly', 'true']);
	} else {
		if(submitButtons[buttonIndex]['flow-id']) {
			parameters.push(['flow', submitButtons[buttonIndex]['flow-id']]);			
		}
	}
	if(workitem['executing-roles'] && workitem['executing-roles']['executing-role']) {
		/* 複数ロールが選択できる場合、プライマリグループを自動選択する */
		parameters.push(['qgroupId', workitem['executing-roles']['executing-role'][0]['qgroup-id']]);
	}
	for(var i=0; i<formItems.length; i++) {
		formItems[i].appendParameter(parameters);
	}
	var contextRoot = Ti.App.Properties.getString('url');
    HttpClient.send({
            url: contextRoot + 'API/PE/Workitem/Form/save',
            parameters: parameters,
            success: receiveSubmit,
            indicator: activityIndicator
    });
};

function replaceBackButton() {
	var backButton = Ti.UI.createButton({
		title: '中断',
		style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
	})
	backButton.addEventListener('click', function(){
		var options = ['変更を破棄', 'キャンセル'];
		dialog = Titanium.UI.createOptionDialog({
			title: '変更されています',
			options: options,
			cancel: 1,
			destructive: 0
		});
		dialog.addEventListener('click', function(e) {
			if(e.cancel == e.index) {
				return;
			} else {
				win.close();
			}
		});
		dialog.show();	
	});
	win.setLeftNavButton(backButton);
}

/** タスク終了 */
var doneButton = Titanium.UI.createButton({
	title:'完了',
	style: Ti.UI.iPhone.SystemButtonStyle.DONE
});
doneButton.addEventListener('click', function(){
	var options = [];
	for(var i=0; i<submitButtons.length; i++) {
		options.push(submitButtons[i].name);
	}
	options.push('保存のみ');
	options.push('キャンセル');
	dialog = Titanium.UI.createOptionDialog({
		options: options,
		cancel: options.length-1
	});
	dialog.addEventListener('click', function(e) {
		if(e.cancel == e.index) {
			return;
		} else {
			submit((e.cancel-1) == e.index, e.index); // true if saveOnly
		}
	});
	dialog.show();	
});
Ti.UI.currentWindow.rightNavButton = doneButton;

/** 項目編集 */
function updateItem(/* number */ index, newValue) {
	var formItem = formItems[index];
	if(formItem.applyValue(newValue)) {
		rowData[index] = formItem.getRow();
		view.setData(rowData);
		if(!valueModified) {
			valueModified = true;
			replaceBackButton();
		}
	}
};

view.addEventListener('click', function(e) {
	if(win.stopOpenDetail) {
		win.stopOpenDetail = false;
		return;
	}
	var formItem = formItems[e.index];
	if(formItem.isWritable()) {
		var editWin = Titanium.UI.createWindow({
			title: formItem.formData.name
		});
		var editorView = formItem.getEditorView(editWin, updateItem, e.index);
		if(editorView) {
			editWin.add(editorView);
			Ti.UI.currentTab.open(editWin, {animated:true});
		}
	}
});

update();
