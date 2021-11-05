import React from "react";

class Form extends React.Component<React.HTMLProps<HTMLFormElement>> {
	render() {
		return <form {...this.props} className={`form-container standard-form ${this.props.className}`} >{this.props.children}</form>;
	}
}

/**
 * Form made of multiple parts, with different heders from each
 */
export const MultipartForm: React.FC<React.HTMLProps<HTMLFormElement>> = props => {
	return <form {...props} className={`form-container multi-part-form ${props.className}`} >{props.children}</form>;
};

export default Form;
