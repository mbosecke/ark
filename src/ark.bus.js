(function(Ark) {
	'use strict';
	
	Ark._coreExtend('bus', function(config){
	
		/* 
		 * private variables/functions
		 */
		var handlers = {},
			ensureEventExists = function(channel, event){
				if (!handlers[channel]) {
					handlers[channel] = {};
				}
				if (!handlers[channel][event]) {
					handlers[channel][event] = [];
				}
			};

		return {
			
			init: function(){
				
			},

			
			notify : function(channel, event, data) {
				ensureEventExists(channel, event);

				var eventHandlers = handlers[channel][event];
				for (var i = 0; i < eventHandlers.length; i++) {
					var handler = eventHandlers[i];
					if(typeof handler.handler === 'function'){
						handler.handler.call(handler.context, data);
					}
				}
			},
			listen : function(channel, event, handler, context) {
				ensureEventExists(channel, event);

				handlers[channel][event].push({
					handler: handler,
					context: context
				});
			}
		};
	});

}(Ark));