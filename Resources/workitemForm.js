/**
 * コンストラクタ
 * 
 * @param o
 * @returns
 */
var WorkitemForm = function(o) {
	if (o) {
		this.formData = o;
		this.value = o.value || '';
		this.errorMessage = '';
		this.paramPrefix = 'data[' + o.number + '].';
	}
};
WorkitemForm.ROW_HEADER_LEFT = 10;
WorkitemForm.ROW_BODY_LEFT = 20;
WorkitemForm.ROW_BODY_TOP = 15;
WorkitemForm.ROW_BACKGROUND_COLOR = '#ffffff';
WorkitemForm.ROW_BACKGROUND_COLOR_RO = '#eeffff';

WorkitemForm.applyHtmlTemplate = function(body) {
	return '<html><head>'
			+ '<style type="text/css">'
			+ 'body {font-size: small; font-family: sans-serif;} '
			+ 'th, td {font-size: x-small;} '
			+ '</style>'
			+ '</head><body>' + body + '</body></html>';
};

/**
 * (private) ベースとなる TableViewRow を生成する
 * 
 * @returns TableViewRow
 */
WorkitemForm.prototype.getRowTemplate = function() {
	var row = Ti.UI.createTableViewRow({
		height : 'auto',
		layout : 'vertical'
	});
	if (this.isWritable()) {
		row.hasChild = true;
	} else {
		row.backgroundColor = WorkitemForm.ROW_BACKGROUND_COLOR_RO;
	}
	var nameLabel = Ti.UI.createLabel({
		text : this.formData.name,
		top : 2,
		left : WorkitemForm.ROW_HEADER_LEFT,
		height : 16,
		font : {
			fontSize : 12,
			fontWeight : 'bold'
		}
	});
	row.add(nameLabel);
	return row;
};

/**
 * 一覧表示用のTableViewRow を生成する
 * 
 * @returns TableViewRow
 */
WorkitemForm.prototype.getRow = function() {
	var row = this.getRowTemplate();
	var content = Ti.UI.createLabel({
		text : this.value,
		left : WorkitemForm.ROW_BODY_LEFT,
		height : 'auto',
		font : {
			fontSize : 10
		}
	});
	row.add(content);
	return row;
};
/**
 * 項目編集画面に説明 View を追加する
 * 
 * @param parentView
 *            項目編集画面の View
 * @param top
 *            表示ポジション
 */
WorkitemForm.prototype.appendDesciptionView = function(/* View */parentView) {
	if (this.formData.description) {
		var descriptionView = Ti.UI.createWebView({
			touchEnabled: false,
			html : WorkitemForm.applyHtmlTemplate(this.formData.description),
			height: 'auto'
		});
		parentView.add(descriptionView);
	}
};

/**
 * 項目編集画面用の View を生成する
 * 
 * @param editWin
 *            項目編集画面の Window オブジェクト
 * @param updateHandler
 *            編集終了時に呼び出すイベントハンドラ関数
 * @param index
 *            表示順何番目の項目か
 * @returns View
 */
WorkitemForm.prototype.getEditorView = function(editWin, /* funciton */
		updateHandler, index) {
	var view = Ti.UI.createScrollView({
		layout: 'vertical'
	});
	this.appendDesciptionView(view);
	var textField = Titanium.UI.createTextField({
		height : 25,
		left : 10,
		right : 10,
		value : this.value,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	editWin.addEventListener('close', function() {
		updateHandler(index, textField.value);
	});
	view.add(textField);
	return view;
};

/**
 * フォームサブミット時のパラメータを設定する
 * 
 * @param params
 *            フォームパラメータの配列
 */
WorkitemForm.prototype.appendParameter = function(/* Array */params) {
	params.push([ this.paramPrefix + 'input', this.value ]);
};

/** return true if value changed */
WorkitemForm.prototype.applyValue = function(newValue) {
	if (this.value == newValue) {
		return false;
	}
	this.value = newValue;
	return true;
};
WorkitemForm.prototype.isReadOnly = function() {
	return this.formData.accessibility == '1';
};
WorkitemForm.prototype.isWritable = function() {
	return parseInt(this.formData.accessibility) >= 2;
};


/** 未実装データ型 */
WorkitemForm.NotImplemented = function(o) {
	WorkitemForm.call(this, o);
};
WorkitemForm.NotImplemented.prototype = new WorkitemForm();
WorkitemForm.NotImplemented.prototype.appendParameter = function(
		/* Array */params) {
};
WorkitemForm.NotImplemented.prototype.getEditorView = function(
		/* Window */editWin, /* funciton */updateHandler, index) {
	var view = Ti.UI.createView();
	var label = Ti.UI.createLabel({
		textAlign: 'center',
		text : 'このアプリケーションからは\n編集できません。'
	});
	view.add(label);
	return view;
};

Ti.include('form/string.js');
Ti.include('form/decimal.js');
Ti.include('form/select.js');
Ti.include('form/timestamp.js');
Ti.include('form/file.js');
Ti.include('form/user.js');
Ti.include('form/discussion.js');
Ti.include('form/table.js');
Ti.include('form/html.js');

WorkitemForm.createForm = function(o) {
	var form = {};
	switch (parseInt(o['data-type'])) {
	case 0:
		form = new WorkitemForm.String(o);
		break;
	case 5: /* Date */
		form = new WorkitemForm(o);
		break;
	case 8: /* User */
		form = new WorkitemForm.User(o);
		break;
	case 9: /* Discussion */
		form = new WorkitemForm.Discussion(o);
		break;
	case 10: /* Timestamp */
		form = new WorkitemForm.Timestamp(o);
		break;
	case 11: /* Select */
		form = new WorkitemForm.Select(o);
		break;
	case 12: /* Decimal */
		form = new WorkitemForm.Decimal(o);
		break;
	case 13: /* Table */
		form = new WorkitemForm.Table(o);
		break;
	case 14: /* File */
		form = new WorkitemForm.File(o);
		break;
	case 15: /* HTML Panel */
		form = new WorkitemForm.Html(o);
		break;
	default:
		form = new WorkitemForm.NotImplemented(o);
	}
	return form;
};
