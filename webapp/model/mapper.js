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
		//se senza chiavi di riconoscimento integration:
		identifyIntegration: function (jsonContent) {
			const fieldMapping = {
					"activityTypes": ["LSTAR", "KTEXT", "DATBI", "DATAB", "OPERA"],
					"employeesS4": [
							"USRID", "HIRE_DATE", "BUKRS", "WERKS", "KOSTL", "PERSG", "PERSK", 
							"BTRTL", "ANRED", "VORNA", "NACHN", "GBDAT", "GBORT", "NATIO", "GESCH",
							"SPRSL", "USRID", "USRID", "USRID", "LSTAR", "ICNUM"
					],
					"employeesTS": [
							"person-id-external", "first-name", "last-name", "title", "date-of-birth", 
							"gender", "status", "email-address", "companyEntryDate", "manager-ID", 
							"hireDate", "terminationDate", "employment-type", "is-fulltime-employee", 
							"employee-class", "overtime-payed", "fte", "department", "legal-entity", 
							"Phone Number", "location", "cost-center", "standard-hours", "job-code", "OPERA"
					],
					"costCentersADP": ["code", "name", "DATBI", "DATAB", "inactiveIndicator"],
					"orderHeaders": ["AUFNR", "KTEXT", "PSPNR", "GSTRP", "GLTRP", "OPERA"],
					"network": ["AUFNR", "VORNR", "LTXA1", "NTANF", "NTEND", "VSTTXT", "OPERA"],
					"wbeElements": [
							"PSPNR", "POSID", "POST1", "PSTRT", "PENDE", "STTXT_EXT", "OPERA"
					],
					"costCenters": ["KOSTL", "BUKRS", "LTEXT", "DATBI", "DATAB", "OPERA"],
					"businessPartners": ["BP_ID", "NAME", "ADDRESS", "PHONE", "EMAIL"],
					"dms": ["DOCUMENT_ID", "FILE_NAME", "CREATED_DATE", "MODIFIED_DATE"],
					"expenseIn": ["EXPENSE_ID", "AMOUNT", "CATEGORY", "DATE"],
					"primaveraEppm": ["PROJECT_ID", "PHASE", "TASK", "START_DATE", "END_DATE"],
					"bpcInterface": ["INTERFACE_ID", "STATUS", "DATA", "TYPE"],
					"contractData": ["CONTRACT_ID", "PARTNER_ID", "START_DATE", "END_DATE"],
					"vaultBoms": ["BOM_ID", "ITEM", "QUANTITY", "DESCRIPTION"],
					"vaultMaterials": ["MATERIAL_ID", "NAME", "QUANTITY", "UNIT"],
					"costCenterMaster": ["KOSTL", "NAME", "DATBI", "DATAB", "OPERA"],
					"wbeMaster": ["PSPNR", "NAME", "DESCRIPTION", "STATUS"],
					"networkMaster": ["AUFNR", "NAME", "STATUS", "DESCRIPTION"],
					"productionOrders": ["AUFNR", "KTEXT", "AUART", "STTXT", "WERKS", "PLNBEZ", "GAMNG", "GWEMG", "GSTRP", "GLTRP", "OPERA"],
					"salaryAccounting": [
							"PAYRUN", "COMPANY", "PAYGROUP", "COSTCENTREDESC", "SECTION", "DESCRIPTION", 
							"AMOUNT", "PAYPERIODEND", "PAYCHECKDATE", "TAXPERIOD", "TAXYEAR"
					],
					"trackingActivitiesImport": [
							"ID-TRACK", "PERSON-ID", "ACDTE", "PSPNR", "HH-WBE", "AUFNR", "VORNR", 
							"HH-NETWORK", "AUFNR", "VORNR", "HH-LABOUR", "HH-SET-UP", "HH-MACHINE", "PERC", "OPERA"
					],
					"trackingActivitiesExport": ["STATUS", "NR-DOCUMENT", "MSG_TEXT"],
					"trackingCancellationImport": ["NR-DOCUMENT"],
					"trackingCancellationExport": ["STATUS", "MSG_TEXT"],
					"massiveReversalImport": [
							"ID-TRACK", "PERSON-ID", "ACDTE", "AUFNR_SEND", "VORNR_SEND", "HH-NETWORK",
							"AUFNR_TARG", "VORNR_TARG", "AUFNR_SEND", "VORNR_SEND", "HH-LABOUR", "HH-SET-UP",
							"HH-MACHINE", "PERC", "AUFNR_TARG", "VORNR_TARG", "TEXT"
					],
					"massiveReversalExport": ["STATUS", "NR-DOCUMENT", "MSG_TEXT"]
			};
			for (const [integrationType, fields] of Object.entries(fieldMapping)) {
				const isMatching = fields.every((field) => field in jsonContent);
					if (isMatching) {
						return integrationType; 
					}
			}
			return "Unknown";
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
