/**
 * 文字型フォーム 現状は単一行と複数行は区別していない
 */
WorkitemForm.String = function(o) {
	WorkitemForm.call(this, o);
};
WorkitemForm.String.prototype = new WorkitemForm();

WorkitemForm.String.prototype.getEditorView = function(editWin, /* funciton */
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
		value : this.value,
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
		suppressReturn : false
	});
	editWin.addEventListener('close', function() {
		updateHandler(index, textArea.value);
	});
	view.add(textArea);
	return view;
};
