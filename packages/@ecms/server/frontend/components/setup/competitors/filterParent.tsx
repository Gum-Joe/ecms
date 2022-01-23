import React, { useEffect, useState } from "react";
import { ResCompetitorFields } from "@ecms/api/common";
import { faCircleNotch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../util/hooks";
import useAsyncEffect from "use-async-effect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "@fluentui/react-northstar";
import AddButton from "../../common/AddButton";
import { competitor_filters, competitor_filtersInitializer, filter_types } from "@ecms/models";

/**
 * We transform API provided fields into this format for easier transformating in the UI
 */
interface UIField {
	/** Whether this is from {@link ResCompetitorFields.defaults} or {@link ResCompetitorFields.fields} */
	for: "defaults" | "fields",
	/** Index in {@link ResCompetitorFields.defaults} or {@link ResCompetitorFields.fields} */
	index: number;
	/** Field Name */
	name: string;
	/** Valid values */
	values: string[];
}

/** How we describe a filter */
interface UIFilter extends Partial<competitor_filtersInitializer> {
	/** Index in the fieldsParsed state of this filter */
	fieldIndex?: number;
}

/** Options for filters */
const FILTER_TYPES: filter_types[] = ["or", "and"];


/**
 * Used to filter competitors from the parent. Please wrap in a `fluent-tab` when referencing.
 */
// TODO: UI value updates!
const FilterParentContent: React.FC = (props) => {
	// Setup state
	const parent_id = useAppSelector(state => state.setup.parent_id);

	// Fetch fields
	const [fields, setFields] = useState<ResCompetitorFields | null>();
	const [fieldsParsed, setfieldsParsed] = useState<UIField[]>([]);
	const [filters, setfilters] = useState<UIFilter[]>([{
		type: "base",
	}]);
	useAsyncEffect(async (isActive) => {
		console.debug("Fetching fields...");
		const res = await fetch(`/api/common/${parent_id}/competitors/fields`);
		const resJson: ResCompetitorFields = await res.json();
		setFields(resJson);
		const parsedDefaults: UIField[] = resJson.defaults.map((field, index) => ({ for: "defaults", index, name: field.name, values: field.values }));
		const parsedFields: UIField[] = resJson.fields.map((field, index) => ({ for: "fields", index, name: field.name, values: field.values }));
		setfieldsParsed([...parsedFields, ...parsedDefaults]);
	}, []);
	
	if (fields) {
		return (
			<fluent-tab-panel id="filterParentCompPanel">
				<div className="filter-rows-container">
					{
						filters.map((filter, index) => (
							<div key={index} className="filter-row">
								{
									index > 0 && <Dropdown
										items={FILTER_TYPES}
										getA11ySelectionMessage={{
											onAdd: (item: filter_types) => {
												const thisFilter = filter;
												thisFilter.type = item;
												const newFilters = [...filters];
												newFilters[index] = thisFilter;
												setfilters(newFilters);
											}
										}}
										fluid			
									/>
								}
								<Dropdown
									items={fieldsParsed.map(field => field.name)}
									getA11ySelectionMessage={{
										onAdd: (item: string) => {
											const thisFilter = filter;
											thisFilter.fieldIndex = fieldsParsed.findIndex((field) => field.name === item);
											thisFilter.field = item; 
											const newFilters = [...filters];
											newFilters[index] = thisFilter;
											setfilters(newFilters);
										}
									}}
									fluid
									
								/>
								<Dropdown
									items={["is exactly"]}
									getA11ySelectionMessage={{
										onAdd: (item) => {
											const thisFilter = filter;

											if (item === "is exactly") {
												thisFilter.matcher = "exactly";
											} else {
												return;
											}
											
											const newFilters = [...filters];
											newFilters[index] = thisFilter;
										}
									}}
									fluid
									
								/>
								<Dropdown
									items={typeof filters[index]?.fieldIndex === "number" ? fieldsParsed[filters[index].fieldIndex || 0].values : []}
									getA11ySelectionMessage={{
										onAdd: (item) => {
											const thisFilter = filter;
											thisFilter.value = item;
											const newFilters = [...filters];
											newFilters[index] = thisFilter;
											setfilters(newFilters);
										}
									}}
									fluid
									
								/>
								<FontAwesomeIcon icon={faTrash} onClick={() => {
									const newFilters = filters;
									delete newFilters[index];
									// From https://www.encodedna.com/javascript/how-to-remove-empty-slots-in-javascript-arrays.htm
									setfilters(newFilters.flat());
								}} />
							</div>
						))
					}
				
				</div>
				<AddButton onClick={() => setfilters([...filters, {}])}>
					Add Filter
				</AddButton>
				<div className="filter-trial">
					<p>
						<strong>120 competitors found.</strong><br />
						Filters can not be changed after event setup.
					</p>
				</div>
			</fluent-tab-panel>
		);
	} else {
		return (
			<div className="central-progress-box">
				<h1>Loading information...</h1>
				<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"8x"} />
			</div>
		);
	}
};

export default FilterParentContent;