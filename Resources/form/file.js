/**
 * ファイル型フォーム 現状はファイル名が一覧できるだけ。ファイルの内容表示や追加更新はできない。
 * require: httpclient.js, TiDomParser.js
 */
var fileResultParser = new com.hamasyou.XML.TiDOMParser();

var win = Ti.UI.currentWindow;
WorkitemForm.File = function(o){
	WorkitemForm.call(this, o);
	this.value = o.value || { qfile: [] };
};
WorkitemForm.File.prototype = new WorkitemForm();
WorkitemForm.File.prototype.appendParameter = function(/* Array */ params) {
	for(var i=0; i<this.value.qfile.length; i++) {
		params.push([ this.paramPrefix + 'selects', this.value.qfile[i].id ]);		
	}
};
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

WorkitemForm.File.prototype.getEditorView = function(editWin, updateHandler, index) {
	var win = Titanium.UI.currentWindow;
	var contextRoot = Ti.App.Properties.getString('url');
	var that = this;
	Titanium.Media.showCamera({
		success:function(event) {
			if(win.activityIndicator) {
				win.activityIndicator.show();
			}
			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'photo.png');
		    if(file.exists()) {
		    	file.deleteFile();
		    	file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'photo.png');
		    }
			file.write(event.media);
		    var data = {
				processDataInstanceId: that.formData['data-instance-id'],
				files: file.read()
			};
			HttpClient.send({
				url: contextRoot + 'PE/Workitem/File/upload',
				data: data,
				multipart: true,
				indicator: win.activityIndicator,
				success: function(client) {
					try {
						var obj = fileResultParser.dom2Json(client.responseXML);
						if(obj.result && obj.result.qfile) {
							that.value.qfile.push(obj.result.qfile);
							updateHandler(index, that.value);
						}
					} catch (e) {
						Ti.API.error("file upload error: " + e);
					}
					if(win.activityIndicator) {
						win.activityIndicator.hide();
					}					
				}
			});
		},
		cancel:function() {},
		error:function(error) {
			var a = Titanium.UI.createAlertDialog({title:'エラー'});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('カメラが利用できません');
			} else {
				a.setMessage('Error Code: ' + error.code);
			}
			a.show();
		},
		saveToPhotoGallery:true,
		allowEditing: false,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
	});
	return null;
};

WorkitemForm.File.prototype.applyValue = function(newValue) {
	return true;
};

