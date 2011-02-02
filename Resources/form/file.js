/**
 * ファイル型フォーム
 * 現状はファイル名が一覧できるだけ。ファイルの内容表示や追加更新はできない。
 */
var win = Ti.UI.currentWindow;
WorkitemForm.File = function(o){
	WorkitemForm.call(this, o);
	this.value = o.value || { qfile: [] };
};
WorkitemForm.File.prototype = new WorkitemForm();
WorkitemForm.File.prototype.appendParameter = function(/* Array */ params) {};
WorkitemForm.File.prototype.getRow = function() {
	var row = this.getRowTemplate();
	var dataInstanceId = this.formData['data-instance-id'];
	var contextRoot = Ti.App.Properties.getString('url');
	var that = this;
	for(var i=0; i<this.value.qfile.length; i++) {
		var label = Ti.UI.createButton({
			title: this.value.qfile[i].name,
			left: WorkitemForm.ROW_BODY_LEFT,
			height: '25',
			width: '200',
			font:{fontSize: 14}
		});
		(function(){
			var file = that.value.qfile[i];
			var pageUrl = contextRoot + 'PE/Workitem/File/download?id=' + file.id + '&processDataInstanceId=' + dataInstanceId;
			label.addEventListener('click', function() {
				Ti.UI.currentWindow.stopOpenDetail = true;
				var viewerWin = Titanium.UI.createWindow({
					title: file.name
				});
				var webView = Ti.UI.createWebView({
					url: pageUrl
				});
				webView.setBasicAuthentication(
					Ti.App.Properties.getString('email'),
					Ti.App.Properties.getString('password')
				);
				viewerWin.add(webView);
				Ti.UI.currentTab.open(viewerWin, {animated:true});
			});
		})();
		row.add(label);
	}
	row.add(Ti.UI.createView({height:2}));
	return row;
};

WorkitemForm.File.prototype.getEditorView = WorkitemForm.NotImplemented.prototype.getEditorView;
