/* eslint-disable no-debugger */
/* eslint-disable no-nested-ternary */
/* eslint-disable no- */
/* eslint-disable no- */
sap.ui.define(
	[
		"./BaseController",
		"../model/models",
		"../model/formatter",
		"../model/mapper",
		"../model/API",
		"sap/ui/model/json/JSONModel",
	],
	function (BaseController, models, formatter, mapper,API, JSONModel) {
		"use strict";

		return BaseController.extend("integdashboard.controller.Detail", {
			formatter: formatter,
			onInit: function () {
				this.getRouter()
					.getRoute("Detail")
					.attachPatternMatched(this._onObjectMatched, this);
				this.setModel(models.createIntegrationMock(), "mockIntegration");
				this.setModel(new JSONModel(),"detailModel")
			},
			_onObjectMatched: async function (oEvent) {
				debugger;
				const sIntegrationId = oEvent.getParameter("arguments").integrationId;
				await this.setLogsTable(sIntegrationId);
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
				const aLogs = oIntegration.logs || [];
				const sRootKey = mapper.getRootKeyByCode(oIntegration.Code);
				// const sRootKey1 = mapper.identifyIntegration(oJsonContent);

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
					log: aLogs,
				});

				this.setModel(oDetailModel, "detailModel");
				this._renderHeaderContent();
				this._renderSimpleForm();
				this._prepareDynamicTableData();
			},
			setLogsTable: async function (sIntegrationId) {
				debugger
				try {
					let logs = await API.getEntitySet(this.getOwnerComponent().getModel("ZLOG_PID999_INTEGRATION_SRV"), "/GetLogsSet", {
						filters: [new sap.ui.model.Filter("ID_INT", sap.ui.model.FilterOperator.EQ, sIntegrationId),
						new sap.ui.model.Filter("DATA", sap.ui.model.FilterOperator.EQ, '20251002'),
						new sap.ui.model.Filter("TIME", sap.ui.model.FilterOperator.EQ, '094502')
						],
						expands: ['Results']
					});
					console.log(logs.results)
					this.getModel("detailModel").setProperty("/logs", logs.results)
					this.setModel()
				} catch (error) {
					console.log(error)
				}
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
				const oDetailModel = this.getModel("detailModel");
				if (!oDetailModel) return;

				const oIntegration = oDetailModel.getProperty("/integration");
				if (!oIntegration) return;
				debugger;

				const aKeyFields = mapper.getKeyFieldsByCode(oIntegration.Code);

				const oSimpleForm = this.byId("overviewForm");
				if (!oSimpleForm) return;

				oSimpleForm.destroyContent();

				const oBundle = this.getResourceBundle();
				const nCols = 3;
				for (let i = 0; i < aKeyFields.length; i += nCols) {
					const oHBox = new sap.m.HBox({
						justifyContent: "Start",
						width: "100%",
						wrap: sap.m.FlexWrap.Wrap,
					});

					aKeyFields.slice(i, i + nCols).forEach((sKey) => {
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
							width: "33%",
							renderType: "Bare",
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

				const formatNode = (node) => {
					const newNode = {};
					Object.keys(node).forEach((k) => {
						if (Array.isArray(node[k])) {
							newNode[k] = node[k].map((child) => formatNode(child));
						} else {
							newNode[k] =
								formatter.formatJsonDate(formatter.formatJsonValue(node[k])) ||
								"-";
						}
					});
					return newNode;
				};

				const aTreeData = [formatNode(oContent)];
				const aColumns = mapper.getColumnConfig(oContent, oBundle);

				oTable.destroyColumns();
				aColumns.forEach((col) => oTable.addColumn(col));

				oDetailModel.setProperty("/dynamicTree", aTreeData);
				oTable.setModel(oDetailModel);
				const arrayNames = Object.keys(oContent).filter((k) =>
					Array.isArray(oContent[k])
				);

				oTable.bindRows({
					path: "detailModel>/dynamicTree",
					parameters: {
						arrayNames: arrayNames,
					},
					templateShareable: true,
				});
			},
			onViewSettOpen: function () {
				const oVSD = this.onOpenDialog(
					"settDialog",
					"integdashboard.view.fragments.viewSettingDialogLog",
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
