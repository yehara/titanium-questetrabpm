var Configuration = {};

Configuration.prefNames = ['url', 'email', 'password'];
Configuration.prefLabels = ['サーバ URL', 'メールアドレス', 'パスワード'];
Configuration.prefDefaults = ['https://s.questetra.net/00000000/', 'SouthPole@questetra.com', 'ssssssss'];
Configuration.keyboards = [Titanium.UI.KEYBOARD_URL, Titanium.UI.KEYBOARD_EMAIL_ADDRESS, Titanium.UI.KEYBOARD_ASCII];
Configuration.passwordMasks = [false, false, true];

/** 設定が入力されているか */
Configuration.filled = function() {
	for(var i=0; i<Configuration.prefNames.length; i++) {
		if(Ti.App.Properties.getString(Configuration.prefNames[i], '') == '') return false;
	}
	return true;
}