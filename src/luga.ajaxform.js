/* globals alert */

/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

(function(){
	"use strict";

	luga.namespace("luga.ajaxform");

	/* Success and error handlers */
	luga.namespace("luga.ajaxform.handlers");

	/**
	 * Replace form with message
	 *
	 * @param {String}            msg       Message to display in the GUI
	 * @param {jQuery}            formNode  jQuery object wrapping the form
	 * @param {luga.xhr.response} response  textStatus   HTTP status
	 */
	luga.ajaxform.handlers.replaceForm = function(msg, formNode, response){
		jQuery(formNode).empty();
		jQuery(formNode).html(msg);
	};

	/**
	 * Display error message inside alert
	 *
	 * @param {String}            msg       Message to display in the GUI
	 * @param {jQuery}            formNode  jQuery object wrapping the form
	 * @param {luga.xhr.response} response  textStatus   HTTP status
	 */
	luga.ajaxform.handlers.errorAlert = function(msg, formNode, response){
		alert(msg);
	};

	/**
	 * Display errors inside a box above the form
	 *
	 * @param {String}   msg          Message to display in the GUI
	 * @param {jQuery}   formNode     jQuery object wrapping the form
	 * @param {String}   textStatus   HTTP status
	 * @param {String}   errorThrown  Error message from jQuery
	 * @param {Object}   jqXHR        jQuery wrapper around XMLHttpRequest
	 */
	luga.ajaxform.handlers.errorBox = function(msg, formNode, textStatus, errorThrown, jqXHR){
		// Clean-up any existing box
		luga.utils.removeDisplayBox(formNode);
		luga.utils.displayErrorMessage(formNode, msg);
	};

	/**
	 * Utility function to be used as after handler by Luga Validator
	 *
	 * @param {jQuery}       formNode  jQuery object wrapping the form
	 * @param {jQuery.Event} event     jQuery object wrapping the submit event
	 */
	luga.ajaxform.handlers.afterValidation = function(formNode, event){
		event.preventDefault();
		var sender = new luga.ajaxform.Sender({
			formNode: formNode
		});
		sender.send();
	};

	luga.ajaxform.CONST = {
		FORM_SELECTOR: "form[data-lugajax-form='true']",
		DEFAULT_METHOD: "GET",
		DEFAULT_TIME_OUT: 30000, // ms
		CUSTOM_ATTRIBUTES: {
			AJAX: "data-lugajax-form",
			ACTION: "data-lugajax-action",
			METHOD: "data-lugajax-method",
			TIME_OUT: "data-lugajax-timeout",
			SUCCESS: "data-lugajax-success",
			SUCCESS_MSG: "data-lugajax-successmsg",
			ERROR: "data-lugajax-error",
			ERROR_MSG: "data-lugajax-errormsg",
			BEFORE: "data-lugajax-before",
			AFTER: "data-lugajax-after",
			HEADERS: "data-lugajax-headers"
		},
		MESSAGES: {
			SUCCESS: "Thanks for submitting the form",
			ERROR: "Failed to submit the form",
			MISSING_FORM: "luga.ajaxform was unable to load form",
			MISSING_FUNCTION: "luga.ajaxform was unable to find a function named: {0}"
		},
		HANDLERS: {
			SUCCESS: "luga.ajaxform.handlers.replaceForm",
			ERROR: "luga.ajaxform.handlers.errorAlert"
		}
	};

	/**
	 * @typedef {Object} luga.ajaxform.Sender.options
	 *
	 * @property {jQuery} formNode                   Either a jQuery object wrapping the form or the naked DOM object. Required
	 * @property {String} action                     URL to where the form will be send. Default to the current URL
	 * @property {String} method                     HTTP method to be used. Default to GET
	 * @property {Number} timeout                    Timeout to be used during the HTTP call (milliseconds). Default to 30000
	 * @property {String} success                    Name of the function to be invoked if the form is successfully submitted. Default to luga.ajaxform.handlers.replaceForm
	 * @property {String} error                      Name of the function to be invoked if the HTTP call failed. Default to luga.ajaxform.handlers.errorAlert
	 * @property {String} successmsg                 Message that will be displayed to the user if the form is successfully submitted. Default to "Thanks for submitting the form"
	 * @property {String} errormsg                   Message that will be displayed to the user if the HTTP call failed. Default to "Failed to submit the form"
	 * @property {String} before                     Name of the function to be invoked before the form is send. Default to null
	 * @property {String} after                      Name of the function to be invoked after the form is send. Default to null
	 * @property {Array.<luga.xhr.header>} headers   A set of header/value pairs to be used as custom HTTP headers. Available only with JavaScript API
	 */

	/**
	 * Form handler. Invoke its sender() method to serialize the form and send its contents using XHR
	 * @param {luga.ajaxform.Sender.options} options
	 * @constructor
	 * @throw {Exception}
	 */
	luga.ajaxform.Sender = function(options){
		// Ensure it's a jQuery object
		options.formNode = jQuery(options.formNode);
		this.config = {
			formNode: null, // Required
			// Either: form attribute, custom attribute, incoming option or current URL
			action: options.formNode.attr("action") || options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.ACTION) || document.location.href,
			// Either: form attribute, custom attribute, incoming option or default
			method: options.formNode.attr("method") || options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.METHOD) || luga.ajaxform.CONST.DEFAULT_METHOD,
			// Either: custom attribute, incoming option or default
			timeout: options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.TIME_OUT) || luga.ajaxform.CONST.DEFAULT_TIME_OUT,
			success: options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.SUCCESS) || luga.ajaxform.CONST.HANDLERS.SUCCESS,
			error: options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.ERROR) || luga.ajaxform.CONST.HANDLERS.ERROR,
			successmsg: options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.SUCCESS_MSG) || luga.ajaxform.CONST.MESSAGES.SUCCESS,
			errormsg: options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.ERROR_MSG) || luga.ajaxform.CONST.MESSAGES.ERROR,
			// Either: custom attribute, incoming option or null
			before: options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.BEFORE) || null,
			after: options.formNode.attr(luga.ajaxform.CONST.CUSTOM_ATTRIBUTES.AFTER) || null,
			headers: []
		};
		luga.merge(this.config, options);
		this.config.timeout = parseInt(this.config.timeout, 10);
		var self = this;

		if(self.config.formNode.length === 0){
			throw(luga.ajaxform.CONST.MESSAGES.MISSING_FORM);
		}

		/**
		 * @throw {Exception}
		 */
		var handleAfter = function(){
			/* istanbul ignore else */
			if(self.config.after !== null){
				var callBack = luga.lookupFunction(self.config.after);
				if(callBack === undefined){
					throw(luga.string.format(luga.ajaxform.CONST.MESSAGES.MISSING_FUNCTION, [self.config.after]));
				}
				callBack.apply(null, [self.config.formNode]);
			}
		};

		/**
		 * @throw {Exception}
		 */
		var handleBefore = function(){
			/* istanbul ignore else */
			if(self.config.before !== null){
				var callBack = luga.lookupFunction(self.config.before);
				if(callBack === undefined){
					throw(luga.string.format(luga.ajaxform.CONST.MESSAGES.MISSING_FUNCTION, [self.config.before]));
				}
				callBack.apply(null, [self.config.formNode]);
			}
		};

		/**
		 * @param {luga.xhr.response} response
		 * @throw {Exception}
		 */
		var handleError = function(response){
			var callBack = luga.lookupFunction(self.config.error);
			if(callBack === undefined){
				throw(luga.string.format(luga.ajaxform.CONST.MESSAGES.MISSING_FUNCTION, [self.config.error]));
			}
			callBack.apply(null, [self.config.errormsg, self.config.formNode, response]);
		};

		/**
		 * @param {luga.xhr.response} response
		 * @throw {Exception}
		 */
		var handleSuccess = function(response){
			var callBack = luga.lookupFunction(self.config.success);
			if(callBack === undefined){
				throw(luga.string.format(luga.ajaxform.CONST.MESSAGES.MISSING_FUNCTION, [self.config.success]));
			}
			callBack.apply(null, [self.config.successmsg, self.config.formNode, response]);
		};

		/**
		 * Perform the following actions:
		 * 1) Invoke the before handler, if any
		 * 2) Make the HTTP call, sending along the serialized form's content
		 * 3) Invoke either the success or error handler
		 * 4) Invoke the after handler, if any
		 */
		this.send = function(){

			var formData = luga.form.toQueryString(self.config.formNode, true);

			if(self.config.before !== null){
				handleBefore();
			}

			var xhrOptions = {
				url: self.config.action,
				success: function(response){
					handleSuccess(response);
				},
				timeout: self.config.timeout,
				headers: self.config.headers,
				error: function(response){
					handleError(response);
				}
			};
			var xhrRequest = new luga.xhr.Request(xhrOptions);
			xhrRequest.send(self.config.action, formData);

			if(self.config.after !== null){
				handleAfter();
			}

		};

		/*
		 AS above, just send  data as raw JSON
		 */
		this.sendJson = function(){

			var formData = luga.form.toJson(self.config.formNode, true);

			if(self.config.before !== null){
				handleBefore();
			}

			var xhrOptions = {
				contentType: "application/json",
				url: self.config.action,
				success: function(response){
					handleSuccess(response);
				},
				timeout: self.config.timeout,
				headers: self.config.headers,
				error: function(response){
					handleError(response);
				}
			};
			var xhrRequest = new luga.xhr.Request(xhrOptions);
			xhrRequest.send(self.config.action, JSON.stringify(formData));

			if(self.config.after !== null){
				handleAfter();
			}

		};


	};

	/**
	 * Attach form handlers to onSubmit events
	 * @param {jquery|undefined} [rootNode=jQuery("body")] Optional, default to jQuery("body")
	 */
	luga.ajaxform.initForms = function(rootNode){
		if(rootNode === undefined){
			rootNode = jQuery("body");
		}
		rootNode.find(luga.ajaxform.CONST.FORM_SELECTOR).each(function(index, item){
			var formNode = jQuery(item);
			formNode.submit(function(event){
				event.preventDefault();
				var formHandler = new luga.ajaxform.Sender({
					formNode: formNode
				});
				formHandler.send();
			});
		});
	};

	jQuery(document).ready(function(){
		luga.ajaxform.initForms();
	});

}());