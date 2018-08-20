;(
		function (window) {
			window.Util = window.Util || window.parent.Util || {};
			Util.data = {
				set : function (key, val) {
					if (key != 'loginUser_phone' && Util.data.container.get('loginUser_phone') != null) {
						key = Util.data.container.get('loginUser_phone') + '_' + key;
					}
					Util.data.container.set(key, val);

				}
				,get : function (key) {
					if (key != 'loginUser_phone' && Util.data.container.get('loginUser_phone') != null) {
						key = Util.data.container.get('loginUser_phone') + '_' + key;
					}
					return Util.data.container.get(key);
				}
				,setWithScope : function (key, val, scope) {
					if (scope == null) {
						this.set(key, val);
					} else {
						this.set(scope + '_' + key, val);
					}
				}
				,getWithScope : function (key, scope) {
					if (scope == null) {
						return this.get(key);
					} else {
						return this.get(scope + '_' + key);
					}
				},
				remove : function(key){
					Util.data.container.remove(key);
				}
			};
			Util.data.container = cst.use('daConstantContainer', 30);
		}
	)(window);