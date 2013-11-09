"use strict";

function mocktruthyfunction(fieldNode) {
	return true;
}

function mockfalsyfunction(fieldNode) {
	return false;
}

var mock = {};
mock.mocktruthyfunction = mocktruthyfunction;
mock.mockfalsyfunction = mockfalsyfunction;

describe("luga.validator.textValidator", function() {

	it("If not specified, date pattern is set to default value", function() {
		var textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: jQuery("<input type='text'>")
		});
		expect(textValidator.options.datepattern).toEqual(luga.validator.CONST.DEFAULT_DATE_PATTERN);
	});

	it("Options can be set programmatically", function() {
		var textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: jQuery("<input type='text'>"),
			required: "true",
			pattern: "lettersonly",
			minlength: "4",
			maxlength: "10",
			minnumber: "5",
			maxnumber: "20",
			datepattern: "YYYY-MM-DD",
			mindate: "2000-01-01",
			maxdate: "2009-12-31",
			equalto: "seconField",
			message: "Invalid field!",
			errorclass: "invalid"
		});
		expect(textValidator.options.required).toBeTruthy();
		expect(textValidator.options.pattern).toEqual("lettersonly");
		expect(textValidator.options.minlength).toEqual("4");
		expect(textValidator.options.maxlength).toEqual("10");
		expect(textValidator.options.minnumber).toEqual("5");
		expect(textValidator.options.maxnumber).toEqual("20");
		expect(textValidator.options.datepattern).toEqual("YYYY-MM-DD");
		expect(textValidator.options.mindate).toEqual("2000-01-01");
		expect(textValidator.options.maxdate).toEqual("2009-12-31");
		expect(textValidator.options.equalto).toEqual("seconField");
		expect(textValidator.options.message).toEqual("Invalid field!");
		expect(textValidator.options.errorclass).toEqual("invalid");
	});

	it("Options can be set with custom HTML attributes", function() {
		var textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: jQuery('' +
				'<input type="text" ' +
				'data-luga-required="true"' +
				'data-luga-pattern="lettersonly"' +
				'data-luga-minlength="4"' +
				'data-luga-maxlength="10"' +
				'data-luga-minnumber="5"' +
				'data-luga-maxnumber="20"' +
				'data-luga-datepattern="YYYY-MM-DD"' +
				'data-luga-mindate="2000-01-01"' +
				'data-luga-maxdate="2009-12-31"' +
				'data-luga-equalto="seconField"' +
				'data-luga-message="Invalid field!"' +
				'data-luga-errorclass="invalid"' +
				'>')
		});
		expect(textValidator.options.required).toBeTruthy();
		expect(textValidator.options.pattern).toEqual("lettersonly");
		expect(textValidator.options.minlength).toEqual("4");
		expect(textValidator.options.maxlength).toEqual("10");
		expect(textValidator.options.minnumber).toEqual("5");
		expect(textValidator.options.maxnumber).toEqual("20");
		expect(textValidator.options.datepattern).toEqual("YYYY-MM-DD");
		expect(textValidator.options.mindate).toEqual("2000-01-01");
		expect(textValidator.options.maxdate).toEqual("2009-12-31");
		expect(textValidator.options.equalto).toEqual("seconField");
		expect(textValidator.options.message).toEqual("Invalid field!");
		expect(textValidator.options.errorclass).toEqual("invalid");
	});

	it("Name property maps to either name or id. If none is passed, it's empty by default", function() {
		var textValidator;

		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: jQuery("<input type='text'>")
		});
		expect(textValidator.name).toEqual("");

		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: jQuery("<input type='text' name='myName'>")
		});
		expect(textValidator.name).toEqual("myName");

		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: jQuery("<input type='text' id='myId'>")
		});
		expect(textValidator.name).toEqual("myId");
	});

	it("Detects empty field", function() {
		var textNode, textValidator;

		textNode = jQuery('<input type="text" data-luga-required="true">');
		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: textNode
		});
		expect(textValidator.isEmpty()).toBeTruthy();
	});

	it("Detects if field is required on simple validation", function() {
		var textNode, textValidator;

		textNode = jQuery('<input type="text" data-luga-required="true">');
		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: textNode
		});
		expect(textValidator.isRequired()).toBeTruthy();

		textNode = jQuery('<input type="text" data-luga-required="false">');
		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: textNode
		});
		expect(textValidator.isRequired()).toBeFalsy();

	});

	it("Detects if field is required on conditional validation. Even if conditional validation functions are inside namespace", function() {
		var textNode, textValidator;

		textNode = jQuery('<input type="text" data-luga-required="mocktruthyfunction">');
		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: textNode
		});
		expect(textValidator.isRequired()).toBeTruthy();

		textNode = jQuery('<input type="text" data-luga-required="mockfalsyfunction">');
		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: textNode
		});
		expect(textValidator.isRequired()).toBeFalsy();

		textNode = jQuery('<input type="text" data-luga-required="mock.mocktruthyfunction">');
		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: textNode
		});
		expect(textValidator.isRequired()).toBeTruthy();

		textNode = jQuery('<input type="text" data-luga-required="mock.mockfalsyfunction">');
		textValidator = new luga.validator.getFieldValidatorInstance({
			fieldNode: textNode
		});
		expect(textValidator.isRequired()).toBeFalsy();

	});

	describe("data-luga-pattern enforce input matches the following patterns:", function() {
		var textNode, textValidator;

		it("lettersonly", function() {
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-pattern="lettersonly">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="test123" data-luga-required="true" data-luga-pattern="lettersonly">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("alphanumeric", function() {
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-pattern="alphanumeric">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="test123" data-luga-required="true" data-luga-pattern="alphanumeric">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="test-123" data-luga-required="true" data-luga-pattern="alphanumeric">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("integer", function() {
			textNode = jQuery('<input type="text" value="1" data-luga-required="true" data-luga-pattern="integer">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="-1" data-luga-required="true" data-luga-pattern="integer">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="test123" data-luga-required="true" data-luga-pattern="integer">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="1.5" data-luga-required="true" data-luga-pattern="integer">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("positiveinteger", function() {
			textNode = jQuery('<input type="text" value="1" data-luga-required="true" data-luga-pattern="positiveinteger">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="-1" data-luga-required="true" data-luga-pattern="positiveinteger">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="test123" data-luga-required="true" data-luga-pattern="positiveinteger">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="1.5" data-luga-required="true" data-luga-pattern="positiveinteger">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("number", function() {
			textNode = jQuery('<input type="text" value="1" data-luga-required="true" data-luga-pattern="number">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="-1" data-luga-required="true" data-luga-pattern="number">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="test123" data-luga-required="true" data-luga-pattern="number">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="1.5" data-luga-required="true" data-luga-pattern="number">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("filepath_pdf", function() {
			textNode = jQuery('<input type="text" value="/file.pdf" data-luga-required="true" data-luga-pattern="filepath_pdf">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="/file.jpg" data-luga-required="true" data-luga-pattern="filepath_pdf">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="/file.zip" data-luga-required="true" data-luga-pattern="filepath_pdf">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="/file.doc" data-luga-required="true" data-luga-pattern="filepath_pdf">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("filepath_jpg", function() {
			textNode = jQuery('<input type="text" value="/file.pdf" data-luga-required="true" data-luga-pattern="filepath_jpg">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="/file.jpg" data-luga-required="true" data-luga-pattern="filepath_jpg">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="/file.zip" data-luga-required="true" data-luga-pattern="filepath_jpg">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="/file.doc" data-luga-required="true" data-luga-pattern="filepath_jpg">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("filepath_zip", function() {
			textNode = jQuery('<input type="text" value="/file.pdf" data-luga-required="true" data-luga-pattern="filepath_zip">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="/file.jpg" data-luga-required="true" data-luga-pattern="filepath_zip">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
			textNode = jQuery('<input type="text" value="/file.zip" data-luga-required="true" data-luga-pattern="filepath_zip">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="/file.doc" data-luga-required="true" data-luga-pattern="filepath_zip">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("filepath", function() {
			textNode = jQuery('<input type="text" value="/file.pdf" data-luga-required="true" data-luga-pattern="filepath">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="/file.jpg" data-luga-required="true" data-luga-pattern="filepath">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="/file.zip" data-luga-required="true" data-luga-pattern="filepath">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="/file.doc" data-luga-required="true" data-luga-pattern="filepath">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-pattern="filepath">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

	});

	describe("data-luga-minnumber:", function() {
		var textNode, textValidator;

		it("Enforce a minimum numeric value", function() {
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-minnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="5" data-luga-required="true" data-luga-minnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="20" data-luga-required="true" data-luga-minnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="-25" data-luga-required="true" data-luga-minnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

	});

	describe("data-luga-maxnumber:", function() {
		var textNode, textValidator;

		it("Enforce a maximum numeric value", function() {
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-maxnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="5" data-luga-required="true" data-luga-maxnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="20" data-luga-required="true" data-luga-maxnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="-25" data-luga-required="true" data-luga-maxnumber="18">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

	});

	describe("data-luga-minlength:", function() {
		var textNode, textValidator;

		it("Enforce a minimum string length", function() {
			textNode = jQuery('<input type="text" value="4" data-luga-required="true" data-luga-minlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="long string" data-luga-required="true" data-luga-minlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="st" data-luga-required="true" data-luga-minlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="str" data-luga-required="true" data-luga-minlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

	});

	describe("data-luga-maxlength:", function() {
		var textNode, textValidator;

		it("Enforce a maximum string length", function() {
			textNode = jQuery('<input type="text" value="4" data-luga-required="true" data-luga-maxlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="long string" data-luga-required="true" data-luga-maxlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="st" data-luga-required="true" data-luga-maxlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="str" data-luga-required="true" data-luga-maxlength="3">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

	});

	describe("data-luga-datepattern can, out of the box, validate dates in the following formats:", function() {
		var textNode, textValidator;

		it("YYYY-MM-DD", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="YYYY-MM-DD">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="2005-02-31" data-luga-required="true" data-luga-datepattern="YYYY-MM-DD">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="2005-12-31" data-luga-required="true" data-luga-datepattern="YYYY-MM-DD">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="2005-05-09" data-luga-required="true" data-luga-datepattern="YYYY-MM-DD">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="2005-5-9" data-luga-required="true" data-luga-datepattern="YYYY-MM-DD">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("YYYY-M-D", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="YYYY-M-D">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="2005-02-31" data-luga-required="true" data-luga-datepattern="YYYY-M-D">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="2005-12-31" data-luga-required="true" data-luga-datepattern="YYYY-M-D">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="2005-05-09" data-luga-required="true" data-luga-datepattern="YYYY-M-D">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="2005-5-9" data-luga-required="true" data-luga-datepattern="YYYY-M-D">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("MM/DD/YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="MM/DD/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="02/31/2005" data-luga-required="true" data-luga-datepattern="MM/DD/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="12/31/2005" data-luga-required="true" data-luga-datepattern="MM/DD/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="09/05/2005" data-luga-required="true" data-luga-datepattern="MM/DD/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="9/5/2005" data-luga-required="true" data-luga-datepattern="MM/DD/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("M/D/YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="M/D/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="02/31/2005" data-luga-required="true" data-luga-datepattern="M/D/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="12/31/2005" data-luga-required="true" data-luga-datepattern="M/D/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="09/05/2005" data-luga-required="true" data-luga-datepattern="M/D/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="9/5/2005" data-luga-required="true" data-luga-datepattern="M/D/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("MM.DD.YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="MM.DD.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="02.31.2005" data-luga-required="true" data-luga-datepattern="MM.DD.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="12.31.2005" data-luga-required="true" data-luga-datepattern="MM.DD.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="09.05.2005" data-luga-required="true" data-luga-datepattern="MM.DD.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="9.5.2005" data-luga-required="true" data-luga-datepattern="MM.DD.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("M.D.YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="M.D.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="02.31.2005" data-luga-required="true" data-luga-datepattern="M.D.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="12.31.2005" data-luga-required="true" data-luga-datepattern="M.D.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="09.05.2005" data-luga-required="true" data-luga-datepattern="M.D.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="9.5.2005" data-luga-required="true" data-luga-datepattern="M.D.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("MM-DD-YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="MM-DD-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="02-31-2005" data-luga-required="true" data-luga-datepattern="MM-DD-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="12-31-2005" data-luga-required="true" data-luga-datepattern="MM-DD-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="09-05-2005" data-luga-required="true" data-luga-datepattern="MM-DD-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="9-5-2005" data-luga-required="true" data-luga-datepattern="MM-DD-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("M-D-YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="M-D-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="02-31-2005" data-luga-required="true" data-luga-datepattern="M-D-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="12-31-2005" data-luga-required="true" data-luga-datepattern="M-D-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="09-05-2005" data-luga-required="true" data-luga-datepattern="M-D-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="9-5-2005" data-luga-required="true" data-luga-datepattern="M-D-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("DD.MM.YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="DD.MM.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31.02.2005" data-luga-required="true" data-luga-datepattern="DD.MM.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="31.12.2005" data-luga-required="true" data-luga-datepattern="DD.MM.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="05.09.2005" data-luga-required="true" data-luga-datepattern="DD.MM.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="5.9.2005" data-luga-required="true" data-luga-datepattern="DD.MM.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("D.M.YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="D.M.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31.02.2005" data-luga-required="true" data-luga-datepattern="D.M.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="31.12.2005" data-luga-required="true" data-luga-datepattern="D.M.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="05.09.2005" data-luga-required="true" data-luga-datepattern="D.M.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="5.9.2005" data-luga-required="true" data-luga-datepattern="D.M.YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("DD/MM/YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31/02/2005" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="31/12/2005" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="05/09/2005" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="5/9/2005" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("D/M/YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="D/M/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31/02/2005" data-luga-required="true" data-luga-datepattern="D/M/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="31/12/2005" data-luga-required="true" data-luga-datepattern="D/M/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="05/09/2005" data-luga-required="true" data-luga-datepattern="D/M/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="5/9/2005" data-luga-required="true" data-luga-datepattern="D/M/YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("DD-MM-YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="DD-MM-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31-02-2005" data-luga-required="true" data-luga-datepattern="DD-MM-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="31-12-2005" data-luga-required="true" data-luga-datepattern="DD-MM-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="05-09-2005" data-luga-required="true" data-luga-datepattern="DD-MM-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="5-9-2005" data-luga-required="true" data-luga-datepattern="DD-MM-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("D-M-YYYY", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="D-M-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31-02-2005" data-luga-required="true" data-luga-datepattern="D-M-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="31-12-2005" data-luga-required="true" data-luga-datepattern="D-M-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="05-09-2005" data-luga-required="true" data-luga-datepattern="D-M-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="5-9-2005" data-luga-required="true" data-luga-datepattern="D-M-YYYY">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

	});

	describe("data-luga-mindate enforce a minimum date", function() {
		var textNode, textValidator;

		it("If no data-luga-datepattern is specified, default pattern (YYYY-MM-DD) will be used to parse and compare dates", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-mindate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="2011-02-31" data-luga-required="true" data-luga-mindate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="2010-01-02" data-luga-required="true" data-luga-mindate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			// valid, but date pattern doesn't match
			textNode = jQuery('<input type="text" value="2011-1-1" data-luga-required="true" data-luga-mindate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="2005-01-01" data-luga-required="true" data-luga-mindate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

		it("Using data-luga-datepattern overrides default", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-mindate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31/02/2011" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-mindate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="02/02/2010" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-mindate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			// valid, but date pattern doesn't match
			textNode = jQuery('<input type="text" value="2011-01-01" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-mindate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="02/02/2005" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-mindate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();
		});

	});

	describe("data-luga-maxdate enforce a maximum date", function() {
		var textNode, textValidator;

		it("If no data-luga-datepattern is specified, default pattern (YYYY-MM-DD) will be used to parse and compare dates", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-maxdate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="2011-02-31" data-luga-required="true" data-luga-maxdate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="2010-01-02" data-luga-required="true" data-luga-maxdate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// valid, but date pattern doesn't match
			textNode = jQuery('<input type="text" value="2011-1-1" data-luga-required="true" data-luga-maxdate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="2005-01-01" data-luga-required="true" data-luga-maxdate="2010-01-01">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

		it("Using data-luga-datepattern overrides default", function() {
			// Not a date
			textNode = jQuery('<input type="text" value="test" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-maxdate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// Matches pattern, but it's not a date
			textNode = jQuery('<input type="text" value="31/02/2011" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-maxdate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="02/02/2010" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-maxdate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			// valid, but date pattern doesn't match
			textNode = jQuery('<input type="text" value="2011-01-01" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-maxdate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeFalsy();

			textNode = jQuery('<input type="text" value="02/02/2005" data-luga-required="true" data-luga-datepattern="DD/MM/YYYY" data-luga-maxdate="01/01/2010">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();
		});

	});

	describe("Custom rules can be added", function() {
		var textNode, textValidator;

		it("By adding them to luga.validator.rules", function() {

			luga.validator.rules.lowercase = function(fieldNode, validator) {
				var lowerStr = fieldNode.val().toLowerCase();
				return (lowerStr === fieldNode.val());
			};

			textNode = jQuery('<input type="text" value="all lower" data-luga-required="true" data-luga-lowercase="true">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="Mixed Case" data-luga-required="true" data-luga-lowercase="true">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});

		});

	});

	describe("Custom pattern can be added", function() {
		var textNode, textValidator;

		it("By adding them to luga.validator.patterns", function() {

			luga.validator.patterns.httpstart = new RegExp("^http://");

			textNode = jQuery('<input type="text" value="http://www.lugajs.org" data-luga-required="true" data-luga-pattern="httpstart">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});
			expect(textValidator.isValid()).toBeTruthy();

			textNode = jQuery('<input type="text" value="www.lugajs.org" data-luga-required="true" data-luga-pattern="httpstart">');
			textValidator = new luga.validator.getFieldValidatorInstance({
				fieldNode: textNode
			});

		});

	});

});