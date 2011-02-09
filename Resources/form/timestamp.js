/**
 * 日時型フォーム
 */
WorkitemForm.Timestamp = function(o) {
	WorkitemForm.call(this, o);
	this.value = o.value || { date: '', time: ''};
};
WorkitemForm.Timestamp.prototype = new WorkitemForm();

WorkitemForm.Timestamp.prototype.applyValue = function(newValue) {
	if (this.value.date == newValue.date && this.value.time == newValue.time) {
		return false;
	}
	this.value = newValue;
	return true;
};

WorkitemForm.Timestamp.prototype.appendParameter = function(/* Array */params) {
	if (this.value && this.value.date && this.value.time) {
		params.push([ this.paramPrefix + 'input', this.value.date ]);
		params.push([ this.paramPrefix + 'time', this.value.time ]);
	}
};

WorkitemForm.Timestamp.prototype.getRow = function() {
	var row = this.getRowTemplate();
	var text = (this.value.date || '') + ' ' + (this.value.time || '');
	var content = Ti.UI.createLabel({
		text : text,
		left : WorkitemForm.ROW_BODY_LEFT,
		height : 'auto',
		font : {
			fontSize : 10
		}
	});
	row.add(content);
	return row;
};

WorkitemForm.Timestamp.prototype.getEditorView = function(editWin, /* funciton */
		updateHandler, index) {
	var view = Ti.UI.createScrollView({
		layout : 'vertical'
	});
	this.appendDesciptionView(view);
	var height = 30;
	var dateLabel = Titanium.UI.createLabel({
		height : height,
		left : 10,
		right : 10,
		text : '日付'
	});
	var dateField = Titanium.UI.createTextField({
		height : 25,
		left : 10,
		right : 10,
		value : this.value.date || '',
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	var timeLabel = Titanium.UI.createLabel({
		height : height,
		left : 10,
		right : 10,
		text : '時刻'
	});
	var timeField = Titanium.UI.createTextField({
		height : height,
		left : 10,
		right : 10,
		value : this.value.time || '',
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	editWin.addEventListener('close', function() {
		updateHandler(index, {
			date : dateField.value,
			time : timeField.value
		});
	});
	view.add(dateLabel);
	view.add(dateField);
	view.add(timeLabel);
	view.add(timeField);
	return view;
};
