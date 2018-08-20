;(function(w) {
	w.UI = w.UI || {};
	UI.validateForm = function($form,options) {
		this.opts = $.extend({
			requiredClass:'required',
			requiredTips : '<span class="tip error">必填！</span>',
			successTips :'<span class="tip right"></span>',
			errorTips:'<span class="tip error">{0}</span>',
			infoTips:'<span class="tip info">{0}</span>',
			tipType : 0
		}, options);
		this.$frm = $form;
		this._Init();
	};
	UI.validateForm.prototype = {
		_vRule: [{
			name: "email",
			rule: /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/,
			error: "邮件地址格无效!",
			message: "请输入有效的邮件地址!"
		}, {
			name: "mobil",
			rule: /^[0-9]{11}$/,
			error: "手机号码无效!",
			message: "请输入有效的手机号码!"
		}, {
			name: "phoneNumber",
			rule: function(v) {
				var telNumberRegx = /^(^0\d{2}-?\d{8}$)|(^0\d{3}-?\d{8}$)|(^\(0\d{2}\)-?\d{8}$)|(^\(0\d{3}\)-?\d{8}$)$/,
					mobilRegx = /^(?:13\d|15\d|18\d)\d{5}(\d{3}|\*{3})$/;
				return (telNumberRegx.test(value)) || (mobilRegx.test(value));
			},
			error: "电话或手机号码无效!",
			message: "请输入有效的电话或手机号码!"
		}, {
			name:"money",
			rule:/^-?[0-9]*(\.{1}\d{1,2})?$/,
			error:"金额格式不正确!",
			message:"请输入合适的金额!"
		}, {
			name:'dataPicker',
			rule:/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/,
			error:"日期格式无效!",
			message:"请输入有效的日期!"
		}],
		_Init: function() {
			//绑定日期控件
			this._runCheckboxAndRadiobox();
			this._runNumber();
			this._runInitControl();
		},
		_runInitControl: function() {
			var self = this;
			self.$frm.find('input[type="text"],input[type="password"],select, textarea').on({
				'blur': function(event) {
					self._testBlurControl($(this));
				},
				'focus': function(event) {
					self._testFoucsControl($(this));
				}
			});

			//在线编辑器
			//var editor = self.$frm.find('iframe');
		},
		_testBlurControl: function($obj) {
			var vRule = this._vRule;
			$obj.closest('.controlBox').find('.tip').remove();
			$obj.removeClass('error');
			var value = $obj.val(),
				test = false;
			if ($obj.hasClass(this.opts.requiredClass)) {
				if (value == '' || value == null || value == undefined) {
					if(this.opts.tipType==0){
						$obj.closest('.controlBox').append(this.opts.requiredTips);
					}else{
						$obj.addClass('error');
					}
					return;
				}
				test = true;
			} else if (value != '' && value != null && value != undefined) {
				test = true;
			}
			if (test) {
				var success = true,
					errmsg = '';
				$.each(vRule, function(index, rec) {
					if ($obj.hasClass(rec.name)) {
						if (typeof rec.rule == 'function') {
							success = rec.rule(value);
						} else {
							success = rec.rule.test(value);
						}
						errmsg=rec.error;
						return false; //退出循环
					}
				});
				if(self.tipType==0){
					if (success) {
						$obj.closest('.controlBox').append(this.opts.successTips);
					} else {
						$obj.closest('.controlBox').append(this.opts.errorTips.format(errmsg));
					}
				}else{
					$obj.removeClass('error');
				}

			}
		},
		_testFoucsControl:function($obj){
			var vRule = this._vRule;
			var    self  = this;
			$.each(vRule, function(index, rec) {
				if ($obj.hasClass(rec.name)) {
					if(self.opts.tipType==0){
						$obj.closest('.controlBox').find('.tip').remove();
						$obj.closest('.controlBox').append(self.opts.infoTips.format(rec.message));
					}else{
						$obj.removeClass('error');
					}

					return false; //退出循环
				}
			});
		},
		/**
		 * 自定义的 checkbox及radio 控件
		 */
		_runCheckboxAndRadiobox: function() {
			this.$frm.find('.controlBox.checkboxGroup').delegate('label,i', 'click', function(event) {
				var tag=event.target.tagName;
				var $this;
				if(tag.toLowerCase()=='label'){
					$this = $(this).find('i');
				}else{
					$this=$(this);
				}
				if ($this.hasClass('checkfield')) {
					if ($this.hasClass('checked')) {
						$this.removeClass('checked');
					} else {
						$this.addClass('checked');
					}
					if($this.data('type')=="selectALL"){
						if($this.hasClass('checked')) {
							$this.closest('div').find('.checkfield').addClass('checked');
						}else{
							$this.closest('div').find('.checkfield').removeClass('checked');
						}
					}
				}
			});
			this.$frm.find('.controlBox.radioboxGroup').delegate('label,i', 'click', function(event) {
				var tag=event.target.tagName;
				var $this;
				if(tag.toLowerCase()=='label'){
					$this = $(this).find('i');
				}else{
					$this=$(this);
				}
				if ($this.hasClass('radiofield')) {
					var $parent = $this.closest('div');
					$parent.find('.radiofield').removeClass('checked');
					$this.addClass('checked');
				}
			});
		},
		/**
		 * 数字字段，只能输入数字
		 */
		_runNumber: function() {
			this.$frm.delegate('input[type="text"][class*="number"],input[type="text"][class*="money"],input[type="text"][class*="digits"]', 'keypress',
				function(e) {
					if (e.ctrlKey) {
						return true;
					}
					var key = window.event ? e.keyCode : e.which;
					var value = $(this).val();
					var pos = this.selectionStart;
					//alert("pos:"+pos+" key:"+key);
					if ((key >= 48 && key <= 57) || key == 46 || key == 45 || key == 0) {
						if (key == 46) {
							if (value.indexOf('.') == 0 || (value.split('.')).length - 1 >= 1) {
								e.returnValue = false;
								e.preventDefault();
							}
						}
						if (key == 45) {
							if (value.indexOf('-') > 0 || (value.split('-')).length - 1 >= 1 || pos > 0) {
								e.returnValue = false;
								e.preventDefault();
							}
						}
					} else if (key != 8) {
						e.returnValue = false;
						e.preventDefault();
					};
				}
			);
			this.$frm.delegate('input[type="text"][class*="number"],input[type="text"][class*="money"],input[type="text"][class*="digits"]', 'keyup', function(e) {
				this.value = this.value.replace(/[\u4e00-\u9fa5]/g, '');
			});
		},
		formValidate:function(){
			var self = this;
			var errNum = 0,
				vRule = self._vRule;
			this.$frm.find('input[type="text"],input[type="password"],select').each(function(index,obj){
				var curObj = $(obj),
					test   = false;
				curValue = curObj.val();

				if(curObj.hasClass(self.opts.requiredClass)){
					if(curValue=='' || curValue==null || curValue==undefined){
						errNum++;
						if(self.opts.tipType==0){
							curObj.closest('.controlBox').find('.tip').remove();
							curObj.closest('.controlBox').append(self.opts.requiredTips);
						}
						else{
							curObj.addClass('error');
						}

						return true; //continue
					}
					test = true;
				}else{
					if(curValue=='' || curValue==null || curValue==undefined){
						return true; //continue
					}
					test = true;
				}

				//需要验证有效值
				if(test){
					var success = true,
						errmsg = '';
					for(var i = 0 ; i < vRule.length ; i++){
						var R = vRule[i];
						if(curObj.hasClass(R.name)){
							if (typeof R.rule == 'function') {
								success = R.rule(curValue);
							} else {
								success = R.rule.test(curValue);
							}
							errmsg=R.error;
							break; //退出循环
						}
					}

					if (!success) {
						if(self.opts.tipType==0){
							curObj.closest('.controlBox').find('.tip').remove();
							curObj.closest('.controlBox').append(self.opts.errorTips.format(errmsg));
						}else{
							curObj.addClass('error');
						}
						errNum++;
					}
				}
			});
			return (errNum == 0);
		},
		formSubmit:function(Url,callback, errorCallback){
			var self = this,

				hField = '<input type="hidden" class="hidden" name="{0}" value="{1}" />';
			//处理单选项字段
			self.$frm.find('.hidden').remove();
			self.$frm.find('.controlBox.radioboxGroup').find('i').each(function(index,obj){
				var $curObj = $(obj);
				if($curObj.hasClass('checked')){
					var fieldName = $curObj.data('name');
					if(fieldName!='' && fieldName!=null && fieldName!=undefined){
						$(hField.format(fieldName,$curObj.data('value'))).appendTo(self.$frm);
					}
				}
			});

			self.$frm.find('.controlBox.checkboxGroup').find('i').each(function(index,obj){
				var $curObj = $(obj);
				if($curObj.hasClass('checked')){
					var fieldName = $curObj.data('name');
					if(fieldName!='' && fieldName!=null && fieldName!=undefined){
						$(hField.format(fieldName,$curObj.data('value'))).appendTo(self.$frm);
					}
				}
			});
			var data=self.$frm.serialize();
			$.ajax({
				url: Url,
				type: "post",
				dataType: "json",
				data: data + "&_resultCode=$json&_nocache=" + Math.random(),
				success: callback,
				error: errorCallback
			});
		}
	}
})(window);


/**
 * 信息提示控件
 */
;
(function(w) {
	w.UI = w.UI || {};
	UI.msgBox = function(msg, type, options) {
		options = options || {};
		type = type || 'success';
		options = $.extend({
			hideHandle: null, //隐藏回调处理
			delay: 1500 //延迟时间
		}, options);

		var tipIcon = {
			success: 'fa fa-info-circle',
			fail: 'cus-icon-warning',
			warn: 'fa fa-exclamation-circle'
		};

		$('body').append([
			'<div class="ui-pop ui-msgbox ', type, '">',
			'<div class="ui-pop-body">',
			'<i class="', tipIcon[type], '"></i>',
			'<p>', msg, '</p>',
			'</div>',
			'</div>'
		].join(''));

		$('.ui-msgbox').show().animate({
			top: '30%',
			opacity: 1
		}, 500);

		setTimeout(function() {
			$('.ui-msgbox').animate({
				top: '32%',
				opacity: 0
			}, 500, function() {
				typeof options.hideHandle === 'function' && options.hideHandle();
				$('.ui-msgbox').remove();
			});
		}, options.delay);
	};

	UI.alert = function(msg, handle) {
		$('body').append([
			'<div class="ui-pop ui-alert">',
			'<div class="ui-pop-body">',
			'<i class="cus-icon-warning"></i>',
			'<p>', msg, '</p>',
			'</div>',
			'<div class="ui-pop-footer">',
			'<button class="btn primary" data-action="ok">确定</button>',
			'</div>',
			'</div>',
			'<div class="ui-pop-mark"></div>'
		].join(''));

		//使屏幕完成遮罩，包括滚动条
		$('body').addClass('modal-open');
		$('body').css('padding-right', '0');

		$('.ui-alert').show().animate({
			top: '30%',
			opacity: 1
		}, 500);
		$('.ui-pop-mark').show().animate({
			opacity: 0.3
		}, 500);

		$('.ui-alert').delegate('button', 'click', function(e) {
			var $t = $(this);
			switch ($t.data('action')) {
				case 'ok':
					e.preventDefault();
					$('.ui-alert').animate({
						top: '32%',
						opacity: 0
					}, 500, function() {
						typeof handle === 'function' && handle();
						$('.ui-pop-mark').remove();
						$('.ui-alert').undelegate().remove();
					});
					//移除完全遮罩
					$('body').removeClass('modal-open');
					$('body').removeAttr('style');
					break;
			}
		});
	};

	UI.confirm = function(msg, okHandle, cancelHandle) {
		$('body').append([
			'<div class="ui-pop ui-confirm">',
			'<div class="ui-pop-body">',
			'<i class="fa fa-question-circle"></i>',
			'<p>', msg, '</p>',
			'</div>',
			'<div class="ui-pop-footer">',
			'<button class="btn btn-primary btn-sm"  data-action="ok">确定</button>&nbsp;',
			'<button  data-action="cancel" class="btn btn-sm">取消</button>',
			'</div>',
			'</div>',
			'<div class="ui-pop-mark"></div>'
		].join(''));
		//使屏幕完成遮罩，包括滚动条
		$('body').addClass('modal-open');
		$('body').css('padding-right', '0');
		$('.ui-confirm').show().animate({
			top: '30%',
			opacity: 1
		}, 500);
		$('.ui-pop-mark').show().animate({
			opacity: 0.3
		}, 500);

		$('.ui-confirm').delegate('button', 'click', function(e) {
			e.preventDefault();
			switch ($(this).data('action')) {
				case 'ok':
					typeof okHandle === 'function' && okHandle();
					break;
				case 'cancel':
					typeof cancelHandle === 'function' && cancelHandle();
					break;
			}
			$('.ui-confirm').animate({
				top: '32%',
				opacity: 0
			}, 500, function() {
				$('.ui-pop-mark').remove();
				$('.ui-confirm').undelegate().remove();
			});
			//移除完全遮罩
			$('body').removeClass('modal-open');
			$('body').removeAttr('style');
		});
	};

	UI.load = function(options) {
		var opts = {};
		if (typeof options == 'object' || options == null) {
			opts = $.extend({
				tip: '加载中...'
			}, options);
		} else if (typeof options == 'string') {
			opts.tip = options;
		}
		$('body').append([
			'<div class="ui-pop ui-load">',
			'<div class="ui-pop-body">',
			'<span></span><p>', opts.tip, '</p>',
			'</div>',
			'</div>'
//			,
//			'<div class="ui-pop-mark"></div>'
		].join(''));


		$('.ui-load').show().animate({
			top: '30%',
			opacity: 1
		}, 100);
		$('.ui-pop-mark').show().animate({
			opacity: 0.3
		}, 100);
	};
	UI.load.close = function() {
		$('.ui-load').remove();
		$('.ui-pop-mark').remove();
	};
})(window);
