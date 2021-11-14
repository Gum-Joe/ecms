/**
 * Used to wrap a component from FAST
 * FROM https://www.fast.design/docs/integrations/react
 */
import React from "react";
import { fluentTab, fluentTabs, fluentTabPanel, provideFluentDesignSystem } from "@fluentui/web-components";
import { provideFASTDesignSystem, fastCheckbox } from "@microsoft/fast-components";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";
const { wrap } = provideReactWrapper(React, provideFASTDesignSystem());

export default wrap;

export const FluentCheckbox = wrap(fastCheckbox());

// also register tabs:
// From https://docs.microsoft.com/en-us/fluent-ui/web-components/components/tabs
provideFluentDesignSystem()
	.register(
		fluentTab(),
		fluentTabPanel(),
		fluentTabs()
	);
