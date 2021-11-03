// FROM https://www.fast.design/docs/integrations/react
import { provideFASTDesignSystem, fastCard, fastButton } from "@microsoft/fast-components";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";
import React from "react";
const { wrap } = provideReactWrapper(React, provideFASTDesignSystem());

export default wrap;