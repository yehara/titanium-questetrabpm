/**
 * ファイル型フォーム
 * 現状はファイル名が一覧できるだけ。ファイルの内容表示や追加更新はできない。
 */
WorkitemForm.File = function(o){
	WorkitemForm.call(this, o);
	this.value = o.value || { qfile: [] };
};
WorkitemForm.File.prototype = new WorkitemForm();
WorkitemForm.File.prototype.appendParameter = function(/* Array */ params) {};
WorkitemForm.File.prototype.getRow = function() {
	var row = this.getRowTemplate();
	var text = '';
	for(var i=0; i<this.value.qfile.length; i++) {
		if(i>0) {
			text += '\n';
		}
		text += this.value.qfile[i].name;
	}
	var content = Ti.UI.createLabel({
		text: text,
		left: WorkitemForm.ROW_BODY_LEFT,
		height: 'auto',
		font:{fontSize:10}
	});
	row.add(content);
	return row;
};

WorkitemForm.File.prototype.getEditorView = WorkitemForm.NotImplemented.prototype.getEditorView;
