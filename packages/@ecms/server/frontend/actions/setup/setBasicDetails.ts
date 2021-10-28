import { SetupState } from "../../constants/interfaces";
import { SETUP_BASIC_DETAILS } from "../../constants/setup";


/**
 * Set the basic details for setup - i.e. screen 1
 * @param details Basic Details about the event/group being created
 * @returns 
 */
export function setBasicDetails(details): SetupState {
	return {
		type: SETUP_BASIC_DETAILS,
		details,
	};
}