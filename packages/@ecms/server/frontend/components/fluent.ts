/**
 * Used to wrap a component from FAST
 * FROM https://www.fast.design/docs/integrations/react
 */
// 
import { provideFASTDesignSystem, fastCheckbox } from "@microsoft/fast-components";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";
import React from "react";
const { wrap } = provideReactWrapper(React, provideFASTDesignSystem());


export default wrap;

export const FluentCheckbox = wrap(fastCheckbox());