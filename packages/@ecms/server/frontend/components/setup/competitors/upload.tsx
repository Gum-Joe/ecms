/**
 * Uploads the CSV to the server
 */
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ColumnsToGetRecord, CSVResult } from "./util";

interface UploadProps {
	/** Metadata about columns in the CSV and how they correspond to required ECMS values */
	csvMetaData: ColumnsToGetRecord;
	/** Data to upload */
	csvData: CSVResult;
}

const ServerUpload: React.FC<UploadProps> = (props) => {

	// Cann the redux dispatch action


	return (
		<div className="competitor-csv-upload">
			<h1>Uploading...</h1>
			<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"8x"} />
		</div>
	);
};

export default ServerUpload;