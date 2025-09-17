sap.ui.define(["../model/formatter"], function (formatter) {
	"use strict";
	return {
		getRootKeyByCode: function (sCode) {
			const typeByCode = {
				C001: "activityTypes",
				C002: "employeesS4",
				C003: "employeesTS",
				C004: "costCentersADP",
				C005: "orderHeaders",
				C006: "network",
				C007: "wbeElements",
				C008: "costCenters",
				C009: "businessPartners",
				C010: "dms",
				C011: "expenseIn",
				C012: "primaveraEppm",
				C013: "bpcInterface",
				C014: "contractData",
				C015: "vaultBoms",
				C016: "vaultMaterials",
				C017: "costCenterMaster",
				C018: "wbeMaster",
				C019: "networkMaster",
				C020: "productionOrders",
				C021: "salaryAccounting",
			};

			return typeByCode[sCode] || null;
		},
		getColumnConfig: function (oHeader, oBundle) {
			if (!oHeader) return [];

			const aKeys = Object.keys(oHeader).filter((k) => k !== "positions");
			return aKeys.map(function (sKey) {
				const sTitle = oBundle.hasText(sKey) ? oBundle.getText(sKey) : sKey;

				return new sap.ui.table.Column({
					label: new sap.m.Label({ text: sTitle }),
					template: new sap.m.Text({ text: `{detailModel>${sKey}}` }),
					sortProperty: sKey,
					filterProperty: sKey,
					width: "12rem",
				});
			});
		},
	};
});
