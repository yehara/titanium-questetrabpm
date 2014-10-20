var Configuration = {};

Configuration.prefNames = ['url', 'email', 'password'];
Configuration.prefLabels = ['サーバ URL', 'メールアドレス', 'APIパスワード'];
Configuration.prefDefaults = ['https://online-demo-ja.questetra.net/', 'SouthPole@questetra.com', 'ItBKJrysUFCILxheTRUbgPsH4NAJ96s8'];
Configuration.keyboards = [Titanium.UI.KEYBOARD_URL, Titanium.UI.KEYBOARD_EMAIL_ADDRESS, Titanium.UI.KEYBOARD_ASCII];
Configuration.passwordMasks = [false, false, true];

/** 設定が入力されているか */
Configuration.filled = function() {
	for(var i=0; i<Configuration.prefNames.length; i++) {
		if(Ti.App.Properties.getString(Configuration.prefNames[i], '') == '') { return false; }
	}
	return true;
};