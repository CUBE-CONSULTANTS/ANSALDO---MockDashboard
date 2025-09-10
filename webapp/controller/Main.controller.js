/* eslint-disable no-debugger */
/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"../model/models",
		"../model/formatter",
	],
	function (
		BaseController,
		JSONModel,
		models,
		formatter,
	) {
		"use strict";

		return BaseController.extend("ansaldonuclear.dashboard.controller.Main", {
			formatter: formatter,
			onInit: async function () {
				this.setModel(models.createMainModel(), "main");			
			},
			onNavigateToPage1: function () {
        this.getRouter().navTo("");
      },

			onNavigateToHrTS: function(oEvent) {
				this.getRouter().navTo("HrTimesheet");
			},
      onNavigateToPage2: function () {
        this.getRouter().navTo("");
      },
      onNavigateToPage3: function () {
        this.getRouter().navTo("");
      },
      
		});
	}
);
