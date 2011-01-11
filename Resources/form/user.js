/**
 * ユーザ型フォーム 現状はメールアドレスを直接入力する方式にだけ対応
 */
WorkitemForm.User = function(o) {
	WorkitemForm.call(this, o);
	this.value = o.value || {};
};
WorkitemForm.User.prototype = new WorkitemForm();

WorkitemForm.User.prototype.appendParameter = function(/* Array */params) {
	if (this.value.quser) {
		params.push([ this.paramPrefix + 'email', this.value.quser.email ]);
	}
};

WorkitemForm.User.prototype.getRow = function() {
	var row = this.getRowTemplate();
	var text = '';
	if (this.value.quser) {
		text = this.value.quser.name + ' ' + this.value.quser.email;
	}
	var content = Ti.UI.createLabel({
		text : text,
		left : WorkitemForm.ROW_BODY_LEFT,
		height : 'auto',
		font : {
			fontSize : 10
		}
	});
	row.add(content);
	return row;
};

WorkitemForm.User.prototype.getEditorView = function(editWin, /* funciton */
		updateHandler, index) {
	var view = Ti.UI.createScrollView({
		layout : 'vertical'
	});
	this.appendDesciptionView(view);
	var email = '';
	if (this.value.quser) {
		email = this.value.quser.email;
	}
	var textField = Titanium.UI.createTextField({
		height : 25,
		top : 5,
		left : 10,
		right : 10,
		value : email,
		keyboardType : Titanium.UI.KEYBOARD_EMAIL_ADDRESS,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	editWin.addEventListener('close', function() {
		updateHandler(index, {
			quser : {
				name : '',
				email : textField.value
			}
		});
	});
	view.add(textField);
	var meButton = Ti.UI.createButton({
		top : 20,
		height : 40,
		width : 120,
		title : '自分を入力'
	});
	meButton.addEventListener('click', function() {
		textField.value = Ti.App.Properties.getString('email');
	});
	view.add(meButton);
	return view;
};
