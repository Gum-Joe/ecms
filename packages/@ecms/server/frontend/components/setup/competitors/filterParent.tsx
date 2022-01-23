import React, { useEffect, useState } from "react";
import { ResCompetitorFields } from "@ecms/api/common";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../util/hooks";
import useAsyncEffect from "use-async-effect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "@fluentui/react-northstar";
import AddButton from "../../common/AddButton";

/**
 * Used to filter competitors from the parent. Please wrap in a `fluent-tab` when referencing.
 */
const FilterParentContent: React.FC = (props) => {
	// Setup state
	const parent_id = useAppSelector(state => state.setup.parent_id);

	// Fetch fields
	const [fields, setFields] = useState<ResCompetitorFields | null>();
	useAsyncEffect(async (isActive) => {
		console.debug("Fetching fields...");
		const res = await fetch("/api/setup/fields");
		const resJson = await res.json();
		setFields(resJson);
	}, [parent_id]);
	
	if (fields) {
		return (
			<fluent-tab-panel id="filterParentCompPanel">
				<div className="filter-rows-container">
					<div className="filter-row">
						<Dropdown
							items={["Year Group", "Teams"]}
							//getA11ySelectionMessage={{
							//onAdd: handleMatchSelection(index, 0)
							//}}
							fluid
									
						/>
						<Dropdown
							items={["is exactly"]}
							//getA11ySelectionMessage={{
							//onAdd: handleMatchSelection(index, 0)
							//}}
							fluid
									
						/>
						<Dropdown
							items={["Year 7"]}
							//getA11ySelectionMessage={{
							//onAdd: handleMatchSelection(index, 0)
							//}}
							fluid
									
						/>
					</div>
					<div className="filter-row">
						<Dropdown
							items={["or", "and"]}
							//getA11ySelectionMessage={{
							//onAdd: handleMatchSelection(index, 0)
							//}}
							fluid
									
						/>
						<Dropdown
							items={["Year Group", "Teams"]}
							//getA11ySelectionMessage={{
							//onAdd: handleMatchSelection(index, 0)
							//}}
							fluid
									
						/>
						<Dropdown
							items={["is exactly"]}
							//getA11ySelectionMessage={{
							//onAdd: handleMatchSelection(index, 0)
							//}}
							fluid
									
						/>
						<Dropdown
							items={["Year 7"]}
							//getA11ySelectionMessage={{
							//onAdd: handleMatchSelection(index, 0)
							//}}
							fluid
									
						/>
					</div>
				</div>
				<AddButton>
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