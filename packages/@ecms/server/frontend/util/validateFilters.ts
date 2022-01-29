import { competitor_filtersInitializer } from "@ecms/models";

/**
 * Validate filters, checking the filters have all properties
 * @returns Boolean - if false, invalid filter is somewhere in the list
 */
export default function validateFilters(filters: Omit<competitor_filtersInitializer, "competitor_settings_id">[]): boolean {
	for (const filter of filters) {
		if (!filter.field || !filter.type || !filter.matcher || !filter.value) {
			// Filter incomplete!
			return false;
		}
	}
	return true;
}