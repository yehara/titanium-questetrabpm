/**
 * 数値型フォーム
 */
WorkitemForm.Decimal = function(o) {
	WorkitemForm.call(this, o);
};
WorkitemForm.Decimal.prototype = new WorkitemForm();

WorkitemForm.Decimal.prototype.getEditorView = function(editWin, /* funciton */
		updateHandler, index) {
	var view = Ti.UI.createScrollView({
		layout : 'vertical'
	});
	this.appendDesciptionView(view);
	var textField = Titanium.UI.createTextField({
		height : 25,
		top : 5,
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
