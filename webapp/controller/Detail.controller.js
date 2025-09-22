/* eslint-disable no-nested-ternary */
/* eslint-disable no-debugger */
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

				if (!oIntegration) {
					return;
				}

				const oJsonContent =
					oIntegration.jsonContent || oIntegration.json_content || {};
				const sRootKey = mapper.getRootKeyByCode(oIntegration.Code);
				const sRootKey1 = mapper.identifyIntegration(oJsonContent);
				console.log(sRootKey1, sRootKey);

				const oHeaderObj = {
					IntegrationId: oIntegration.IntegrationId,
					Code: oIntegration.Code,
					Description: oIntegration.Description,
					Status: oIntegration.Status,
					Message: oIntegration.Message,
					IntegrationDateTime: oIntegration.IntegrationDateTime,
				};
				const sTitle = sRootKey
					? this.getResourceBundle().getText(sRootKey) +
					  "  " +
					  oIntegration.IntegrationId
					: oIntegration.IntegrationId;

				const oDetailModel = new JSONModel({
					title: sTitle,
					header: oHeaderObj,
					integration: { ...oHeaderObj },
					rawJsonContent: oJsonContent,
				});

				this.setModel(oDetailModel, "detailModel");
				this._renderHeaderContent();
				this._renderSimpleForm();
				this._prepareDynamicTableData();
			},

			_renderHeaderContent: function () {
				const oDetailModel = this.getModel("detailModel");
				if (!oDetailModel) return;

				let oHeader = oDetailModel.getProperty("/header") || {};
				if (Array.isArray(oHeader)) {
					oHeader = oHeader[0] || {};
				}

				const oHBox = this.byId("headerContentBox");
				if (!oHBox) return;
				oHBox.destroyItems();

				const oBundle = this.getResourceBundle();
				const aKeys = Object.keys(oHeader);
				const nGroupSize = 3;
				for (let i = 0; i < aKeys.length; i += nGroupSize) {
					const oVBox = new sap.m.VBox({ items: [] });

					aKeys.slice(i, i + nGroupSize).forEach((sKey) => {
						let v = oHeader[sKey];
						v = formatter.formatJsonDate(formatter.formatJsonValue(v));
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
			_renderSimpleForm: function () {
				debugger;
				const oDetailModel = this.getModel("detailModel");
				if (!oDetailModel) return;

				const oIntegration = oDetailModel.getProperty("/integration");
				if (!oIntegration) return;

				const sIntegrationId = oIntegration.IntegrationId;
				const aKeyFields = mapper.getKeyFieldsByIntegrationId(sIntegrationId);

				const oSimpleForm = this.byId("overviewForm");
				if (!oSimpleForm) return;

				oSimpleForm.destroyContent();

				const oBundle = this.getResourceBundle();
				const nFieldsPerRow = 2; 

				for (let i = 0; i < aKeyFields.length; i += nFieldsPerRow) {
					const oHBox = new sap.m.HBox({
						justifyContent: "SpaceAround",
						width: "100%",
					});

					aKeyFields.slice(i, i + nFieldsPerRow).forEach((sKey) => {
						let v =
							oIntegration[sKey] ||
							oDetailModel.getProperty(`/rawJsonContent/${sKey}`) ||
							"-";
						v =
							typeof v === "string" && /^\d{8}$/.test(v)
								? formatter.formatJsonDate(v)
								: v;

						const oVBox = new sap.m.VBox({
							items: [
								new sap.m.Label({
									text: oBundle.hasText(sKey) ? oBundle.getText(sKey) : sKey,
								}),
								new sap.m.Text({ text: v }),
							],
						});

						oHBox.addItem(oVBox);
					});

					oSimpleForm.addContent(oHBox);
				}
			},
			_prepareDynamicTableData: function () {
				const oBundle = this.getView().getModel("i18n").getResourceBundle();
				const oDetailModel = this.getModel("detailModel");
				if (!oDetailModel) return;

				const oContent = oDetailModel.getProperty("/rawJsonContent") || {};
				const oTable = this.byId("dynamicTable");
				if (!oTable) return;
				const aPositions = Array.isArray(oContent.positions)
					? oContent.positions
					: [];

				let aRows = [];
				if (aPositions.length) {
					aRows = aPositions.map((pos) => ({ ...pos }));
				} else if (Object.keys(oContent).length) {
					aRows = [{ ...oContent }];
				}
				aRows = aRows.map((row) => {
					const newRow = {};
					Object.keys(row).forEach((k) => {
						newRow[k] =
							formatter.formatJsonDate(formatter.formatJsonValue(row[k])) ||
							"-";
					});
					return newRow;
				});
				const aColumns = mapper.getColumnConfig(aRows[0] || {}, oBundle);

				oTable.destroyColumns();
				aColumns.forEach((col) => oTable.addColumn(col));

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
