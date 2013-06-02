(function(Ark) {
	'use strict';
	
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

	var busExtension = {
		
		name: 'bus',
		
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

	Ark.prototype.coreExtensions.push(busExtension);
}(Ark));