(function(){
	"use strict";

	/**
	 * @typedef {object} luga.data.DetailSet.options
	 *
	 * @property {string}              id     Unique identifier. Required
	 * @property {luga.data.DataSet} dataSet  Master dataSet
	 */

	/**
	 * DetailSet class
	 * Register itself as observer of the passed dataSet and act as the details in a master/details scenario
	 *
	 * @param {luga.data.DetailSet.options} options
	 * @constructor
	 * @extends luga.Notifier
	 * @fires dataChanged
	 */
	luga.data.DetailSet = function(options){
		luga.extend(luga.Notifier, this);

		/** @type {luga.data.DetailSet} */
		var self = this;

		var CONST = {

		};

		this.id = options.id;
		this.dataSet = options.dataSet;
		this.dataSet.addObserver(this);

		/** @type {luga.data.DataSet.row} */
		this.record = null;

		luga.data.datasetRegistry[this.id] = this;

	};

}());