(function(Ark) {
	'use strict';
	
	Ark._coreExtend('bus', function(config){
	
		/* 
		 * private variables/functions
		 */
		var handlers = {},
			ensureEventExists = function(event){
				if (!handlers[event]) {
					handlers[event] = [];
				}
			};

		return {
			
			init: function(){
				
			},

			
			notify : function(event, data) {
				ensureEventExists(event);

				var eventHandlers = handlers[event];
				for (var i = 0; i < eventHandlers.length; i++) {
					var handler = eventHandlers[i];
					if(typeof handler.handler === 'function'){
						handler.handler.call(handler.context, data);
					}
				}
			},
			listen : function(event, handler, context) {
				ensureEventExists(event);

				handlers[event].push({
					handler: handler,
					context: context
				});
			}
		};
	});

}(Ark));