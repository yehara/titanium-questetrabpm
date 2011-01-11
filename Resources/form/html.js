/**
 * HTML型フォーム
 */
WorkitemForm.Html = function(o) {
	WorkitemForm.call(this, o);
};
WorkitemForm.Html.prototype = new WorkitemForm();

WorkitemForm.Html.prototype.appendParameter = function(/* Array */params) {
};
WorkitemForm.Html.prototype.applyValue = function(newValue) {
	return false;
};

WorkitemForm.Html.prototype.getRow = function() {
	var row = this.getRowTemplate();
	if (this.formData.description) {
		this.deferRendering = true;
		var webView = Ti.UI.createWebView({
			html : WorkitemForm.applyHtmlTemplate(this.formData.description),
			backgroundColor : WorkitemForm.ROW_BACKGROUND_COLOR_RO,
			height : 'auto'
		});
		var that = this;
		webView.addEventListener('load', function() {
			if(that.onRender) {
				that.onRender();
			}
		});
		row.add(webView);
	}
	return row;
};

WorkitemForm.Html.prototype.getEditorView = WorkitemForm.NotImplemented.prototype.getEditorView;
