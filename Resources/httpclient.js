var HttpClient = {};

HttpClient.deleteCookieModule = require('com.yehara.deletecookie');
HttpClient.deleteCookie = HttpClient.deleteCookieModule.createExecutor();

HttpClient.send = function(params) {
	var data = "";
	for ( var i = 0; i < params.parameters.length; i++) {
		if (i > 0) {
			data += '&';
		}
		data += encodeURIComponent(params.parameters[i][0]) + '='
				+ encodeURIComponent(params.parameters[i][1]);
	}
	var client = Ti.Network.createHTTPClient({
		timeout : 30000
	});
	HttpClient.deleteCookie.execute();
	client.open('POST', params.url);
	client.setRequestHeader("content-type",
			"application/x-www-form-urlencoded; charset=UTF-8");
	var authorizationHeader = 'Basic '
			+ Ti.Utils.base64encode(Ti.App.Properties.getString('email') + ':'
					+ Ti.App.Properties.getString('password'));
	client.setRequestHeader('Authorization', authorizationHeader);
	client.onload = function() {
		params.success(this);
	};
	client.onerror = function() {
		if(params.indicator) {
			params.indicator.hide();
		}
		Ti.API.info("error code: " + client.status);
		Ti.API.debug("error body: " + client.responseText);
		if (client.status == 401) {
			Ti.UI.createAlertDialog({
				title : '認証エラー',
				message : '接続設定を確認してください。'
			}).show();
			return;
		}
		Ti.UI.createAlertDialog({
			title : '通信エラー',
			message : '接続設定およびネットワーク接続を確認してください。'
		}).show();
	};
	client.send(data);
	return;
};
