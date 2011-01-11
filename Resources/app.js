Ti.include('configuration.js');
Ti.UI.setBackgroundColor('#000');

var tabGroup = Ti.UI.createTabGroup();
var win1 = Ti.UI.createWindow({  
    title:'マイタスク',
    backgroundColor:'#fff',
   	url: 'workitemListWindow.js'
});
var tab1 = Ti.UI.createTab({  
    icon:'icon_user.png',
    title:'マイタスク',
    window:win1
});
var win2 = Titanium.UI.createWindow({  
    title:'オファータスク',
    backgroundColor:'#fff',
   	url: 'offeredListWindow.js'
});
var tab2 = Titanium.UI.createTab({  
    icon:'icon_box_full.png',
    title:'オファータスク',
    window:win2
});
var configWindow = Titanium.UI.createWindow({
	title: '接続設定',
	backgroundColor: '#fff',
	url: 'configWindow.js'
});
var tab3 = Titanium.UI.createTab({
    icon:'icon_settings.png',
	title: '接続設定',
	window: configWindow
});

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);  

// 設定が完了していない場合、起動時に設定画面を開く
if(Configuration.filled()) {
	tabGroup.setActiveTab(0);
} else {
	tabGroup.setActiveTab(2);	
}

// open tab group
tabGroup.open();
