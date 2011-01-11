/**
 * テーブル型フォーム
 * 現状はデータ編集には対応していない。
 */
WorkitemForm.Table = function(o) {
	WorkitemForm.call(this, o);
};
WorkitemForm.Table.prototype = new WorkitemForm();

// 更新はサポートしない
WorkitemForm.Table.prototype.appendParameter = function(/* Array */params) {
};
WorkitemForm.Table.prototype.applyValue = function(newValue) {
	return false;
};

WorkitemForm.Table.prototype.getRow = function() {
	var row = this.getRowTemplate();
	if (this.value) {
		this.deferRendering = true;
		var tableheader = '<tr>';
		var subdata = this.formData['list-detail']['sub-data-defs']['sub-data-def'];
		for ( var i = 0; i < subdata.length; i++) {
			tableheader += '<th>' + subdata[i].name + '</th>';
		}
		tableheader += '</tr>'
		var body = this.value.replace(/<\?xml .*\?>/, '').replace(
				'<list>',
				'<table cellspacing="1" border="0" bgcolor="#777777">'
						+ tableheader).replace('</list>', '</table>').replace(
				'<list/>', '<table/>').replace(/<row>/g,
				'<tr bgcolor="#ffffff">').replace(/<\/row>/g, '</tr>').replace(
				/<row\/>/g, '<tr/>').replace('<summary>',
				'<tr bgcolor="#eeeeee">').replace('</summary>', '</tr>')
				.replace('<summary/>', '<tr/>').replace(/<col>/g, '<td>')
				.replace(/<\/col>/g, '</td>').replace(/<col\/>/g, '<td/>');
		var html = WorkitemForm.applyHtmlTemplate(body);
		var webView = Ti.UI.createWebView({
			html : html,
			height : 'auto'
		});
		var that = this;
		webView.addEventListener('load', function() {
			if(that.onRender) {
				that.onRender();
			}
		});
		if (!this.isWritable()) {
			webView.backgroundColor = WorkitemForm.ROW_BACKGROUND_COLOR_RO;
		}
		row.add(webView);
	}
	return row;
};

WorkitemForm.Table.prototype.getEditorView = WorkitemForm.NotImplemented.prototype.getEditorView;
