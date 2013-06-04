(function(Ark) {
	'use strict';
	
	Ark._coreExtend('error', function(config){
		var makeErrorHandler = function(instance, name, method){
				return function(){
					try{
						return method.apply(instance, arguments);
					}catch(ex){
						errorExtension.handle(name + '(): ' + ex.message);
					}
				};
			};

		return {
				init: function(){
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
						if(instance.hasOwnProperty(name)){
							method = instance[name];
							if(typeof method === 'function'){
								instance[name] = makeErrorHandler(instance, name, method);
							}
						}
					}
				}
		};
	
	});
	
}(Ark));