(function(Ark) {
	'use strict';

	var animationSpeed, animationEase;

	var domExtension = {
		name : 'dom',
		init : function(config) {
			animationSpeed = config.animationSpeed || 'fast';
			animationEase = config.animationEase || 'swing';
		},

		addClass : function(element, className) {
			$(element).addClass(className);
		},
		after : function(element, content) {
			$(element).after(content);
		},
		append : function(element, content) {
			$(element).append(content);
		},
		appendTo : function(element, target) {
			$(element).appendTo(target);
		},
		attr : function(element, attributeName, value) {
			if (value) {
				$(element).attr(attributeName, value);
			} else {
				return $(element).attr(attributeName);
			}
		},
		before : function(element, content) {
			$(element).before(content);
		},
		css : function(element, propertyName, value) {
			if (value) {
				$(element).css(propertyName, value);
			} else {
				return $(element).css(propertyName);
			}
		},
		empty : function(element) {
			$(element).empty();
		},
		fadeIn : function(element, completedCallback) {
			$(element).fadeIn(animationSpeed, animationEase, completedCallback);
		},
		fadeOut : function(element, completedCallback) {
			$(element)
					.fadeOut(animationSpeed, animationEase, completedCallback);
		},
		hasClass : function(element, className) {
			return $(element).hasClass(className);
		},
		height : function(element) {
			return $(element).height();
		},
		hide : function(element) {
			$(element).hide();
		},
		prop : function(element, propertyName, value) {
			if (value) {
				$(element).prop(propertyName, value);
			} else {
				return $(element).prop(propertyName);
			}
		},
		remove : function(element) {
			$(element).remove();
		},
		removeClass : function(element, className) {
			$(element).removeClass(className);
		},
		removeProp : function(element, propertyName) {
			$(element).removeProp(propertyName);
		},
		show : function(element) {
			$(element).show();
		},
		text : function(element, text) {
			if (text) {
				$(element).text(text);
			} else {
				return $(element).text();
			}
		},
		toggleClass : function(element, className) {
			$(element).toggleClass(className);
		},
		val : function(element, value) {
			if (value) {
				$(element).val(value);
			} else {
				return $(element).val(value);
			}
		},
		width : function(element) {
			return $(element).width();
		}
	};

	Ark.prototype.coreExtensions.push(domExtension);
}(Ark));