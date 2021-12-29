import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { SetupActions } from ".";
import { CSVResult, ColumnsToGetRecord } from "../../components/setup/competitors/util";
import { SetupState } from "../../constants/interfaces";
import { RootState } from "../../reducers";
import updateSetup from "./updateSetup";

/**
 * Uploads the CSV to the server, inserting the ID of the 
 * @deprecated
 */
const uploadCSV: (csvData: CSVResult, csvMetaData: ColumnsToGetRecord) => ThunkAction<Promise<SetupActions>, RootState, void, SetupActions> = (csvData, csvMetaData) => async (dispatch, getState) => {
	// POST!
	const request = await axios.post("/api/setup/uploadCSV", {
		data: csvData,
		metaData: csvMetaData,
	});

	// TODO: Dispatch
	dispatch(updateSetup({
		competitor_settings: {
			type: "discrete",
			competitor_import_id: "doesn't matter",
			csvMetadata: csvMetaData,
			teamsMap: {},
		}
	}));
};

export default uploadCSV;