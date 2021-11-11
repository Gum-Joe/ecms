
import React, { ComponentPropsWithoutRef } from "react";

/** Container for setup forms, etc - the actual setup screen inputs section itself */
const SetupContainer: React.FC<{
	as?: React.ReactNode,
} & ComponentPropsWithoutRef<"div">> = ({ children, as: As = "div", ...props }) => {
	return (
		/* @ts-expect-error: Can't type properly */
		<As  {...props} className={`setup-form-container ${props.className || ""}`}>
			{ children }
		</As>
	);
};

export default SetupContainer;