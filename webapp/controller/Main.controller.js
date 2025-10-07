/* eslint-disable no-debugger */
/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"sap/ui/model/json/JSONModel",
		"../model/models",
		"../model/formatter",
		"../model/mapper",
		"../model/API",
		"sap/m/MessageBox",
	],
	function (BaseController, JSONModel, models, formatter, mapper,API, MessageBox) {
		"use strict";

		return BaseController.extend("ansaldonucleardashboard.controller.Main", {
			formatter: formatter,
			onInit: async function () {
				this.setModel(models.createMainModel(), "main");
				// const oBundle = this.getResourceBundle();
				// const oModel = models.createIntegrationMock(oBundle);
				// this.setModel(oModel, "mockIntegration");
				this.setModel(new JSONModel(),"integrationsModel")
				// const aResults = oModel.getProperty("/integrationsColl/results") || [];			
				const oFilterModel = models.createFilterModel();
				this.setModel(oFilterModel, "filterModel");
			},
			createGroupHeader: function (oGroup) {
				debugger
				const sCode = oGroup.key;
				const sKey = mapper.getRootKeyByCode(sCode);
				const oBundle = this.getResourceBundle();
				const sTitle = oBundle.getText(sKey);

				return new sap.m.GroupHeaderListItem({
					title: sTitle,
					upperCase: false,
				}).addStyleClass("group-code-" + sCode);
			},

			onTabSelect: function (oEvent) {
				const oTable = oEvent.getSource().getAggregation("content")[0];
				const oBinding = oTable.getBinding("rows");
				const sKey = oEvent.getParameter("key");
				let aFilters = [];
				if (sKey === "Ok") {
					aFilters.push(
						new sap.ui.model.Filter(
							"Status",
							sap.ui.model.FilterOperator.EQ,
							"Success"
						)
					);
				} else if (sKey === "Ko") {
					aFilters.push(
						new sap.ui.model.Filter(
							"Status",
							sap.ui.model.FilterOperator.EQ,
							"Error"
						)
					);
				} else if (sKey === "All") {
					aFilters = [];
				}
				oBinding.filter(aFilters);
			},
			_buildFilters: function () {
				const oFilterModel = this.getModel("filterModel");
				const aFilters = [];

				const fromDate = oFilterModel.getProperty("/fromDate");
				const toDate = oFilterModel.getProperty("/toDate");
				const integrationIds = oFilterModel.getProperty("/integrationId") || [];
				const description = oFilterModel.getProperty("/description") || [];
				const system = oFilterModel.getProperty("/system") || [];
				const status = oFilterModel.getProperty("/status");

				if (!this._checkDateRange(fromDate, toDate)) {
					oFilterModel.setProperty("/fromDate", null);
					oFilterModel.setProperty("/toDate", null);
					return null;
				}
				if (fromDate) {
					const dFrom = new Date(fromDate);
					aFilters.push(
						new sap.ui.model.Filter({
							path: "IntegrationDateTime",
							test: function (sValue) {
								const dValue = new Date(sValue);
								return dValue >= dFrom;
							},
						})
					);
				}

				if (toDate) {
					const dTo = new Date(toDate);
					aFilters.push(
						new sap.ui.model.Filter({
							path: "IntegrationDateTime",
							test: function (sValue) {
								const dValue = new Date(sValue);
								return dValue <= dTo;
							},
						})
					);
				}
				if (integrationIds && integrationIds.length > 0) {
					const idFilters = integrationIds.map(
						(id) =>
							new sap.ui.model.Filter(
								"IntegrationId",
								sap.ui.model.FilterOperator.EQ,
								id
							)
					);
					aFilters.push(new sap.ui.model.Filter(idFilters, false));
				}
				if (description.length > 0) {
					const descFilters = description.map(
						(desc) =>
							new sap.ui.model.Filter(
								"Code",
								sap.ui.model.FilterOperator.EQ,
								desc.split(" - ")[0].trim()
							)
					);
					aFilters.push(new sap.ui.model.Filter(descFilters, false));
				}
				if (system.length > 0) {
					const systemFilters = system.map(
						(s) =>
							new sap.ui.model.Filter({
								filters: [
									new sap.ui.model.Filter(
										"SysA",
										sap.ui.model.FilterOperator.EQ,
										s
									),
									new sap.ui.model.Filter(
										"SysB",
										sap.ui.model.FilterOperator.EQ,
										s
									),
								],
								and: false,
							})
					);
					aFilters.push(new sap.ui.model.Filter(systemFilters, false));
				}

				if (status) {
					aFilters.push(
						new sap.ui.model.Filter(
							"Status",
							sap.ui.model.FilterOperator.EQ,
							status
						)
					);
				}
				return aFilters;
			},
			onSearch: async function () {
				// const oTable = this.byId("integrationTable");
				const aFilters = this._buildFilters();
				// if (!aFilters) {
				// 	return;
				// }
				// this.showBusy(0);
				// const oBinding = oTable.getBinding("items");
				// if (oBinding) {
				// 	const oCombinedFilter = aFilters.length
				// 		? new sap.ui.model.Filter(aFilters, true)
				// 		: [];

				// 	oBinding.filter(oCombinedFilter);
				// }
				try {
					let data = await API.getEntitySet(this.getOwnerComponent().getModel("ZLOG_PID999_INTEGRATION_SRV"), "/GetLogsSet", {expands: ['Results']})
					this.getModel("integrationsModel").setProperty("/",data.results[0].Results.results)
				} catch (error) {
					MessageBox.error(this.getResourceBundle().getBundleText())
				}
				this.getModel("main").setProperty("/visibility", true);
				this.hideBusy(0);
			},
			_checkDateRange: function (fromDate, toDate) {
				if (!fromDate && !toDate) {
					MessageBox.error(this.getResourceBundle().getText("selectDateRange"));
					return false;
				}
				if (
					isNaN(new Date(fromDate).getTime()) ||
					isNaN(new Date(toDate).getTime())
				) {
					MessageBox.error(this.getResourceBundle().getText("invalidDate"));
					return false;
				}
				if (new Date(fromDate) > new Date(toDate)) {
					MessageBox.error(
						this.getResourceBundle().getText("dataError")
					);
					return false;
				}
				return true;
			},
			onFilterBarClear: function () {
				const oFilterModel = this.getModel("filterModel");
				oFilterModel.setProperty("/fromDate", null);
				oFilterModel.setProperty("/toDate", null);
				oFilterModel.setProperty("/integrationId", []);
				oFilterModel.setProperty("/description", "");
				oFilterModel.setProperty("/system", "");
				oFilterModel.setProperty("/status", "");

				const oTable = this.byId("integrationTable");
				if (oTable && oTable.getBinding("items")) {
					oTable.getBinding("items").filter([]);
				}
				this.getModel("main").setProperty("/visibility", false);
			},
			onTableRowSelectionChange: function (oEvent) {
				const sIntegrationId = oEvent
					.getParameters()
					.listItem.getBindingContext("mockIntegration")
					.getObject().IntegrationId;
				this.getRouter().navTo("Detail", {
					integrationId: sIntegrationId,
				});
				oEvent.getSource().removeSelections(true);
			},
		});
	}
);
