sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: ansaldonuclear.dashboard",
		defaults: {
			page: "ui5://test-resources/ansaldonuclear/dashboardTest.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_fiori_3"
			},
			coverage: {
				only: "ansaldonuclear/dashboard",
				never: "test-resources/ansaldonuclear/dashboard"
			},
			loader: {
				paths: {
					"ansaldonuclear/dashboard": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for ansaldonuclear.dashboard"
			},
			"integration/opaTests": {
				title: "Integration tests for ansaldonuclear.dashboard"
			}
		}
	};
});
