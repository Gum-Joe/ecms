import React, { useEffect } from "react";
import { FluentTreeView } from "../fluent";
import { StandardLuminance, baseLayerLuminance, fillColor, SwatchRGB } from "@fluentui/web-components";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { SidebarProps } from "./SidebarProps";
import { SidebarItems } from "./SidebarItems";

/**
 * Homepage sidebar component - acts as the inital root of {@link SidebarItems} and sets styling.
 */
export const Sidebar: React.FC<SidebarProps> = (props) => {

	useEffect(() => {
		baseLayerLuminance.setValueFor(document.getElementById("sidebar-tree-view") as HTMLElement, StandardLuminance.DarkMode);
		fillColor.setValueFor(document.getElementById("sidebar-tree-view") as HTMLElement, SwatchRGB.from(parseColorHexRGB("#202020")!));
	}, []);

	return (
		<FluentTreeView id="sidebar-tree-view">
			<SidebarItems setEventGroupId={props.setEventGroupId} />
		</FluentTreeView>
	);
};
