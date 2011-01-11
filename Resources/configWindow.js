Ti.include('configuration.js');

var win = Ti.UI.currentWindow;
var view = Ti.UI.createScrollView({
	contentWidth:'auto',
    contentHeight:'auto',
    top:0,
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true,
    layout: 'vertical'
});

var LABEL_HEIGHT = 30;
var INPUT_HEIGHT = 30;

var labels = [];
var inputs = [];

for(var i=0; i<Configuration.prefNames.length; i++) {
	labels[i] = Ti.UI.createLabel({
		left: 10,
		right: 10,
		height: LABEL_HEIGHT,
		text: Configuration.prefLabels[i]
	});
	if(Ti.App.Properties.getString(Configuration.prefNames[i], '') == '') {
		Ti.App.Properties.setString(Configuration.prefNames[i], Configuration.prefDefaults[i]);
	}
	inputs[i] = Titanium.UI.createTextField({
		color: '#336699',
		height: INPUT_HEIGHT,
		left: 10,
		right: 10,
		keyboardType: Configuration.keyboards[i],
		value: Ti.App.Properties.getString(Configuration.prefNames[i]),
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask: Configuration.passwordMasks[i]
	});	
	view.add(labels[i]);
	view.add(inputs[i]);
	var input = inputs[i];
}

function reload() {
	for(var i=0; i<inputs.length; i++) {
		inputs[i].value = Ti.App.Properties.getString(Configuration.prefNames[i]);
	}	
}
win.addEventListener('focus', reload);

function save() {
	for(var i=0; i<labels.length; i++) {
		inputs[i].blur();
		Ti.App.Properties.setString(Configuration.prefNames[i], inputs[i].value);		
	}
	Ti.App.fireEvent('clearAuth');
}

var saveButton = Titanium.UI.createButton({title:'保存'});
saveButton.addEventListener('click', save);
Ti.UI.currentWindow.rightNavButton = saveButton;

win.add(view);
