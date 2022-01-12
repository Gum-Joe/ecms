/**
 * Used to wrap a component from FAST
 * FROM https://www.fast.design/docs/integrations/react
 */
import React from "react";
import { fluentTab, fluentTabs, fluentTabPanel, provideFluentDesignSystem, fluentTreeView, fluentTreeItem } from "@fluentui/web-components";
import { provideFASTDesignSystem, fastCheckbox, fastTreeView } from "@microsoft/fast-components";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";
const { wrap } = provideReactWrapper(React, provideFASTDesignSystem());
const { wrap: wrapFluent } = provideReactWrapper(React, provideFluentDesignSystem());

export default wrap;

export const FluentCheckbox = wrap(fastCheckbox());
export const FluentTreeView = wrapFluent(fluentTreeView());
export const FluentTreeItem = wrapFluent(fluentTreeItem());

// also register tabs:
// From https://docs.microsoft.com/en-us/fluent-ui/web-components/components/tabs
// DO NOT REMOVE - some parts of the code use web components directly!
provideFluentDesignSystem()
	.register(
		fluentTab(),
		fluentTabPanel(),
		fluentTabs(),
		fluentTreeView(),
		fluentTreeItem(),
	);
