/**
 * 掲示板型フォーム
 */
WorkitemForm.Discussion = function(o) {
	WorkitemForm.call(this, o);
	this.console = '';
};
WorkitemForm.Discussion.prototype = new WorkitemForm();

WorkitemForm.Discussion.prototype.appendParameter = function(/* Array */params) {
	if (this.console) {
		params.push([ this.paramPrefix + 'console', this.console ]);
	}
};

WorkitemForm.Discussion.prototype.applyValue = function(newValue) {
	if(this.console == newValue) {
		return false;
	}
	this.console = newValue;
	return true;
};

WorkitemForm.Discussion.prototype.getRow = function() {
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
	if (this.console) {
		var console = Ti.UI.createLabel({
			color : '#0000FF',
			text : '-------\n' + this.console,
			left : WorkitemForm.ROW_BODY_LEFT,
			height : 'auto',
			font : {
				fontSize : 10
			}
		});
		row.add(console);
	}
	return row;
};
WorkitemForm.Discussion.prototype.getEditorView = function(editWin, /* funciton */
updateHandler, index) {
	var view = Ti.UI.createScrollView({
		layout : 'vertical'
	});
	this.appendDesciptionView(view);
	var textArea = Ti.UI.createTextArea({
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		top : 5,
		width : 300,
		height : 180,
		value : this.console || '',
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
		suppressReturn : false
	});
	var that = this;
	editWin.addEventListener('close', function() {
		updateHandler(index, textArea.value);
	});
	view.add(textArea);
	return view;
};
