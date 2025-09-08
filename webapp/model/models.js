sap.ui.define(
	["sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode", "sap/ui/Device"],
	function (JSONModel, BindingMode, Device) {
		"use strict";

		return {
			createDeviceModel: function () {
				const oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode(BindingMode.OneWay);
				return oModel;
			},
			createMainModel: function () {
				return new JSONModel({
					visibility: false,
					editable: false,
					enabled: false,
					busy: false,
					selected: false,
				});
			},
			createMockNetworkData: function () {
				return new JSONModel({
					mockData: [
						{
							AUFNR: "100000000001",
							KTEXT: "Network Description 1",
							PSPNR: "00000001",
							GSTRP: "20230101",
							GLTRP: "20231231",
							OPERA: "INS",
							STATUS: "INS",
							DATEOP: "20231102",
							operations: [
								{
									VORNR: "0001",
									LTXA1: "Operation 1 Description",
									NTANF: "20230110",
									NTEND: "20230120",
									VSTTXT: "REL",
									OPERA: "INS",
									STATUS: "INS",
									DATEOP: "20231102",
								},
								{
									VORNR: "0002",
									LTXA1: "Operation 2 Description",
									NTANF: "20230115",
									NTEND: "20230125",
									VSTTXT: "CLSD",
									OPERA: "MOD",
									STATUS: "MOD",
									DATEOP: "20231102",
								},
							],
							log: [
								{
									AUFNR: "100000000001",
									VORNR: "",
									AUTHMOD: "john.doe",
									MODDATE: "20230901",
									MODTIME: "083015",
									MODOBJ: "KTEXT",
									OLDVAL: "Old Network Description",
									NEWVAL: "Updated Network Description",
									STATUS: "MOD",
								},
								{
									AUFNR: "100000000001",
									VORNR: "0001",
									AUTHMOD: "jane.smith",
									MODDATE: "20230902",
									MODTIME: "101530",
									MODOBJ: "LTXA1",
									OLDVAL: "Initial Description",
									NEWVAL: "Refined Operation 1 Description",
									STATUS: "MOD",
								},
								{
									AUFNR: "100000000001",
									VORNR: "0002",
									AUTHMOD: "admin",
									MODDATE: "20230903",
									MODTIME: "111200",
									MODOBJ: "STATUS",
									OLDVAL: "REL",
									NEWVAL: "CLSD",
									STATUS: "MOD",
								},
							],
						},
						{
							AUFNR: "100000000002",
							KTEXT: "Network Description 2",
							PSPNR: "00000002",
							GSTRP: "20230201",
							GLTRP: "20231231",
							OPERA: "MOD",
							STATUS: "MOD",
							DATEOP: "20231102",
							operations: [
								{
									VORNR: "0001",
									LTXA1: "Operation 1 Description",
									NTANF: "20230205",
									NTEND: "20230215",
									VSTTXT: "REL",
									OPERA: "MOD",
									STATUS: "MOD",
									DATEOP: "20231102",
								},
							],
						},
						// {
						// 	"AUFNR": "100000000003",
						// 	"KTEXT": "Network Description 3",
						// 	"PSPNR": "00000002",
						// 	"GSTRP": "20230201",
						// 	"GLTRP": "20231231",
						// 	"OPERA": "DEL",
						// 	"STATUS": "OK",
						// 	"DATEOP": "0230112",
						// 	"operations": [
						// 		{
						// 			"VORNR": "0001",
						// 			"LTXA1": "Operation 1 Description",
						// 			"NTANF": "20230205",
						// 			"NTEND": "20230215",
						// 			"VSTTXT": "REL",
						// 			"OPERA": "DEL",
						// 			"STATUS": "OK",
						// 			"DATEOP": "0230112",
						// 		}
						// 	]
						// }
					],
				});
			},
		};
	}
);
