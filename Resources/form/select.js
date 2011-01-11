/**
 * 選択型フォーム 現状は選択肢項目が固定のものだけ対応。 他データ項目や外部HTTPリソースから選択肢を取得するタイプには対応していない。
 */
WorkitemForm.Select = function(o) {
	WorkitemForm.call(this, o);
	this.value = o.value || {
		item : []
	};
	this.singleSelect = (o['form-type'] != '3');
};
WorkitemForm.Select.prototype = new WorkitemForm();

WorkitemForm.Select.prototype.appendParameter = function(/* Array */params) {
	if (this.formData['select-detail']) {
		for ( var i = 0; i < this.value.item.length; i++) {
			params.push([ this.paramPrefix + 'selects',
					this.value.item[i].value ]);
		}
	}
};

WorkitemForm.Select.prototype.getRow = function() {
	var row = this.getRowTemplate();
	var text = '';
	for ( var i = 0; i < this.value.item.length; i++) {
		if (i > 0) {
			text += '\n';
		}
		text += this.value.item[i].display;
	}
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

WorkitemForm.Select.prototype.getEditorView = function(editWin, /* funciton */
		updateHandler, index) {
	// if(!this.singleSelect || !this.formData['select-detail']) {
	if (!this.formData['select-detail']) {
		return WorkitemForm.NotImplemented.prototype.getEditorView(editWin,
				updateHandler, index);
	}

	var view = Ti.UI.createView();
	var tableView = Ti.UI.createTableView({
		top : 0
	});
	var items = this.formData['select-detail'].items.item;
	var data = [];
	for ( var i = 0; i < items.length; i++) {
		var selected = false;
		for ( var j = 0; j < this.value.item.length; j++) {
			if (items[i].value == this.value.item[j].value) {
				selected = true;
				this.lastCheckedIndex = i;
				break;
			}
		}
		var row = Ti.UI.createTableViewRow({
			title : items[i].display,
			hasCheck : selected
		});
		data.push(row);
	}
	tableView.setData(data);
	var that = this;
	tableView.addEventListener('click', function(e) {
		row = data[e.index];
		if (data[e.index].hasCheck) {
			data[e.index].hasCheck = false;
			this.lastCheckedIndex = -1;
		} else {
			if (that.singleSelect && that.lastCheckedIndex >= 0) {
				data[that.lastCheckedIndex].hasCheck = false;
			}
			data[e.index].hasCheck = true;
			that.lastCheckedIndex = e.index;
		}
		tableView.setData(data);
	});
	editWin.addEventListener('close', function() {
		var value = {
			item : []
		};
		for ( var i = 0; i < data.length; i++) {
			if (data[i].hasCheck) {
				value.item.push(that.formData['select-detail'].items.item[i]);
			}
		}
		updateHandler(index, value);
	});

	view.add(tableView);
	return view;
};
