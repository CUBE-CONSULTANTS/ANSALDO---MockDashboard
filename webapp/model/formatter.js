/* eslint-disable no-nested-ternary */
/* eslint-disable no- */
sap.ui.define(
	["sap/ui/core/format/DateFormat"],
	function (DateFormat) {
		"use strict";

		return {
			formatValue: function (value) {
				return value && value.toUpperCase();
			},
			formatDate: function (sDate) {
				if (!sDate) return null;
				const oDateFormat = DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
				const sFormattedDate = oDateFormat.format(
					new Date(
						sDate.substr(0, 4),
						sDate.substr(4, 2) - 1,
						sDate.substr(6, 2)
					)
				);
				return sFormattedDate;
			},
			
			formatDateTime: function (sDate) {
				if (!sDate) {
					return "";
				}
				const oDate = new Date(sDate);
				const twoDigits = function (n) {
					return n < 10 ? "0" + n : n;
				};

				const day = twoDigits(oDate.getDate());
				const month = twoDigits(oDate.getMonth() + 1);
				const year = oDate.getFullYear();

				const hours = twoDigits(oDate.getHours());
				const minutes = twoDigits(oDate.getMinutes());

				return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
			},
			formatJsonDate: function (sValue) {
				if (typeof sValue === "string" && /^\d{8}$/.test(sValue)) {
					return (
						sValue.slice(6, 8) +
						"/" +
						sValue.slice(4, 6) +
						"/" +
						sValue.slice(0, 4)
					);
				}
				return sValue;
			},

			formatJsonValue: function (v) {
				if (Array.isArray(v)) {
					return v.length
						? typeof v[0] === "object"
							? JSON.stringify(v[0])
							: v.join(", ")
						: "";
				} else if (typeof v === "object" && v !== null) {
					return JSON.stringify(v);
				}
				return v;
			},
		};
	}
);
