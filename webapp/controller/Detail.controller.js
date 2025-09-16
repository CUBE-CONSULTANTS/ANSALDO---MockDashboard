/* eslint-disable no-nested-ternary */
/* eslint-disable no-debugger */
/* eslint-disable no- */
/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"../model/models",
		"../model/formatter",
		"../model/mapper",
		"sap/ui/model/json/JSONModel",
	],
	function (BaseController, models, formatter, mapper, JSONModel) {
		"use strict";

		return BaseController.extend("ansaldonuclear.dashboard.controller.Detail", {
			formatter: formatter,
			onInit: function () {
				this.getRouter()
					.getRoute("Detail")
					.attachPatternMatched(this._onObjectMatched, this);
				this.setModel(models.createIntegrationMock(), "mockIntegration");
			},
			_onObjectMatched: function (oEvent) {
				const sIntegrationId = oEvent.getParameter("arguments").integrationId;
				const oModel = this.getModel("mockIntegration");
				const aResults = oModel?.getProperty("/integrationsColl/results") || [];

				const oIntegration = aResults.find(
					(item) => item.IntegrationId === sIntegrationId
				);

				const oJsonContent =
					oIntegration.jsonContent || oIntegration.json_content || {};

				let oHeaderObj = {};
				const aKeys = Object.keys(oJsonContent);
				if (aKeys.length === 1) {
					const sKey = aKeys[0];
					oHeaderObj = oJsonContent[sKey];
					if (Array.isArray(oHeaderObj)) oHeaderObj = oHeaderObj[0] || {};
				} else {
					const aKnown = [
						"employeesS4",
						"employeesTS",
						"activityTypes",
						"costCentersADP",
						"orderHeaders",
						"network",
						"wbeElements",
						"costCenters",
						"workCenters",
						"plants",
					];
					const sFound = aKnown.find((k) => oJsonContent[k]);
					if (sFound) {
						oHeaderObj = Array.isArray(oJsonContent[sFound])
							? oJsonContent[sFound][0] || {}
							: oJsonContent[sFound];
					} else {
						oHeaderObj = oJsonContent;
					}
				}
				const sRootKey =
					aKeys.length === 1
						? aKeys[0]
						: (aKnown && aKnown.find((k) => oJsonContent[k])) || null;
				debugger;
				const sTitle = sRootKey
					? this.getResourceBundle().getText(sRootKey) +
					  "  " +
					  oIntegration.IntegrationId
					: oIntegration.IntegrationId;

				const oDetailModel = new JSONModel({
					title: sTitle,
					header: oHeaderObj,
					integration: {
						IntegrationId: oIntegration.IntegrationId,
						Code: oIntegration.Code,
						Description: oIntegration.Description,
						Status: oIntegration.Status,
						Message: oIntegration.Message,
						CreationDateTime: oIntegration.CreationDateTime,
						IntegrationDateTime: oIntegration.IntegrationDateTime,
					},
					rawJsonContent: oJsonContent,
				});

				this.setModel(oDetailModel, "detailModel");
				this._renderHeaderContent(sRootKey);
				this._prepareDynamicTableData();
			},

			_renderHeaderContent: function (sRootKey) {
				const oDetailModel = this.getModel("detailModel");
				if (!oDetailModel) return;

				let oHeader = {};
				if (sRootKey) {
					oHeader =
						oDetailModel.getProperty("/rawJsonContent/" + sRootKey) || {};
					if (Array.isArray(oHeader)) oHeader = oHeader[0] || {};
				}

				const oHBox = this.byId("headerContentBox");
				if (!oHBox) return;
				oHBox.destroyItems();
				const oBundle = this.getResourceBundle();
				const aKeys = Object.keys(oHeader).filter(
					(k) => k !== "operations" && k !== "positions"
				);
				const nGroupSize = 3;
				for (let i = 0; i < aKeys.length; i += nGroupSize) {
					const oVBox = new sap.m.VBox({ items: [] });

					aKeys.slice(i, i + nGroupSize).forEach((sKey) => {
						let v = oHeader[sKey];
						if (Array.isArray(v)) {
							v = v.length
								? typeof v[0] === "object"
									? JSON.stringify(v[0])
									: v.join(", ")
								: "";
						} else if (typeof v === "object" && v !== null) {
							v = JSON.stringify(v);
						}
						if (typeof v === "string" && /^\d{8}$/.test(v)) {
							v = v.slice(6, 8) + "/" + v.slice(4, 6) + "/" + v.slice(0, 4);
						}

						const sTitle = oBundle.hasText(sKey) ? oBundle.getText(sKey) : sKey;
						oVBox.addItem(
							new sap.m.ObjectAttribute({
								title: sTitle,
								text: v || "-",
							})
						);
					});
					oHBox.addItem(oVBox);
				}
			},
			_prepareDynamicTableData: function () {
				const oDetailModel = this.getModel("detailModel");
				if (!oDetailModel) return;

				const oHeader = oDetailModel.getProperty("/header") || {};
				const oTable = this.byId("dynamicTable");
				if (!oTable) return;

				oTable.destroyColumns();

				const aHeaderKeys = Object.keys(oHeader).filter(
					(k) => k !== "positions" 
				);
				const aPositions = Array.isArray(oHeader.positions)
					? oHeader.positions
					: [];

				let aRows = [];
				if (aPositions.length) {
					aRows = aPositions.map((pos) => {
						const row = { ...oHeader };
						delete row.positions;
						return { ...row, ...pos };
					});
				} else {
					const row = { ...oHeader };
					delete row.positions;
					aRows = [row];
				}

				aRows = aRows.map((row) => {
					const newRow = {};
					Object.keys(row).forEach((k) => {
						let v = row[k];
						if (typeof v === "string" && /^\d{8}$/.test(v)) {
							v = v.slice(6, 8) + "/" + v.slice(4, 6) + "/" + v.slice(0, 4);
						} else if (Array.isArray(v)) {
							v = v.length
								? typeof v[0] === "object"
									? JSON.stringify(v[0])
									: v.join(", ")
								: "";
						} else if (typeof v === "object" && v !== null) {
							v = JSON.stringify(v);
						}
						newRow[k] = v || "-";
					});
					return newRow;
				});

				const aAllKeys = Object.keys(aRows[0] || {});

				aAllKeys.forEach((sKey) => {
					const sTitle = this.getResourceBundle().hasText(sKey)
						? this.getResourceBundle().getText(sKey)
						: sKey;
					oTable.addColumn(
						new sap.ui.table.Column({
							label: new sap.m.Label({ text: sTitle }),
							template: new sap.m.Text({ text: `{detailModel>${sKey}}` }),
							sortProperty: sKey,
							filterProperty: sKey,
							width: "12rem"
						})
					);
				});

				oDetailModel.setProperty("/dynamicOperationsRows", aRows);
				oTable.setModel(oDetailModel);
				oTable.bindRows({
					path: "detailModel>/dynamicOperationsRows",
					templateShareable: true,
				});
			},
			onViewSettOpen: function () {
				const oVSD = this.onOpenDialog(
					"settDialog",
					"ansaldonuclear.dashboard.view.fragments.viewSettingDialogLog",
					this
				);

				const aLog = this.getModel("detailModel")?.getProperty("/log") || [];
				const aFields = [
					{
						key: "AUFNR",
						label: this.getResourceBundle().getText("network"),
					},
					{
						key: "VORNR",
						label: this.getResourceBundle().getText("opNumb"),
					},
					{
						key: "AUTHMOD",
						label: this.getResourceBundle().getText("autoreMod"),
					},
					{
						key: "MODDATE",
						label: this.getResourceBundle().getText("dataMod"),
					},
					{
						key: "MODTIME",
						label: this.getResourceBundle().getText("oraMod"),
					},
					{
						key: "MODOBJ",
						label: this.getResourceBundle().getText("oggMod"),
					},
					{
						key: "OLDVAL",
						label: this.getResourceBundle().getText("oldV"),
					},
					{
						key: "NEWVAL",
						label: this.getResourceBundle().getText("newV"),
					},
					{
						key: "STATUS",
						label: this.getResourceBundle().getText("status"),
					},
				];

				aFields.forEach((oField) => {
					const aValues = [
						...new Set(
							aLog
								.map((entry) => entry[oField.key])
								.filter(
									(val) => val !== undefined && val !== null && val !== ""
								)
						),
					];

					if (aValues.length > 0) {
						const oFilterItem = new sap.m.ViewSettingsFilterItem({
							key: oField.key,
							text: oField.label,
						});

						aValues.forEach((sVal) => {
							oFilterItem.addItem(
								new sap.m.ViewSettingsItem({
									key: sVal,
									text: sVal,
								})
							);
						});

						oVSD.addFilterItem(oFilterItem);
					}
				});

				oVSD.open();
			},
			handleConfirm: function (oEvent) {
				const oTable = this.byId("logTable");
				const mParams = oEvent.getParameters();
				const oSorter = mParams.sortItem
					? new sap.ui.model.Sorter(
							mParams.sortItem.getKey(),
							mParams.sortDescending
					  )
					: null;
				let oGroupSorter = null;
				if (mParams.groupItem) {
					oGroupSorter = new sap.ui.model.Sorter(
						mParams.groupItem.getKey(),
						mParams.groupDescending,
						true
					);
				}

				const aFilters = [];

				mParams.filterItems.forEach(function (oItem) {
					const sKey = oItem.getParent().getKey();
					const sValue = oItem.getKey();

					aFilters.push(
						new sap.ui.model.Filter(
							sKey,
							sap.ui.model.FilterOperator.EQ,
							sValue
						)
					);
				});

				const aSorters = [];
				if (oGroupSorter) aSorters.push(oGroupSorter);
				if (oSorter) aSorters.push(oSorter);

				oTable.getBinding("rows").filter(aFilters);
				oTable.getBinding("rows").sort(aSorters);
			},
		});
	}
);
