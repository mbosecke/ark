(function(Ark) {
	'use strict';

	var errorExtension = {
			name: 'error',
			init: function(config){
				//TODO: allow the user to provide their own "handle" function through the config
				if(config.handle && typeof config.handle === 'function'){
					this.handle = config.handle;
				}
			},
			handle: function(message, exception){
				
				if(window.console && window.console.error){
					window.console.error(message, exception);
					
				}else if (window.console && window.console.log){
					window.console.log(message, exception);
				}
			},
			sanitize: function(instance){
				var self = this, name, method;
				
				for(name in instance){
					method = instance[name];
					if(typeof method === 'function'){
						instance[name] = function(name, method){
							return function(){
								try{
									return method.apply(instance, arguments);
								}catch(ex){
									self.handle(name + '(): ' + ex.message);
								}
							};
						}(name, method);
					}
				}
			}
	};

	Ark.prototype.coreExtensions.push(errorExtension);
}(Ark));