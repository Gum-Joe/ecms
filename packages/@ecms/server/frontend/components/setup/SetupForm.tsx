/**
 * Multipart form with invisible submit button, triggered by clicking on the "Next" button
 */
import React from "react";
import { MultipartForm } from "../common/Form";

export const SETUP_SUBMIT_BUTTON_ID = "setup-submit-button";
const SetupForm: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = props => {
	return (
		<MultipartForm {...props} className={`form-container multi-part-form ${props.className}`} >
			{props.children}
		</MultipartForm>
	);
};

export default SetupForm;