(function(Ark) {
	'use strict';
	
	/* 
	 * private variables
	 */
	var allowedLevels = [ 'off', 'error', 'warn', 'info', 'debug', 'trace' ], 
		level = 0, 
		prefix = '';

	var loggerExtension = {
		name: 'logger',

		init: function(config) {
			var newLevel = (config && config.level) ? allowedLevels
					.indexOf(config.level.toLowerCase()) : 0;

			prefix = config.prefix;

			if (newLevel === -1) {
				throw new Error('Logging level does not exist');
			}
			level = newLevel;
		},


		getLevel : function() {
			return allowedLevels[level];
		},

		log : function(logLevel, message) {
			logLevel = allowedLevels.indexOf(logLevel.toLowerCase());
			if (logLevel <= level) {
				
				message = (prefix? prefix : '') + allowedLevels[logLevel] + ': ' + message;
				
				if(logLevel === 1 && window.console && window.console.error){
					window.console.error(message);
				}else if(logLevel ===2 && window.console && window.console.warn){
					window.console.warn(message);
				}
				else if (window.console && window.console.log) {
					window.console.log(message);
				}
			}
		}
	};

	Ark.prototype._coreExtensions.push(loggerExtension);
}(Ark));