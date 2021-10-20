import React, { ButtonHTMLAttributes } from "react";

export type ButtonTypes = "primary";

/**
 * Button component used throughout ECMS.
 * This is our custom button we use.
 */
class Button extends React.Component<{
	buttonType: ButtonTypes,
} & ButtonHTMLAttributes<HTMLButtonElement>> {

	render() {
		return <button className={this.props.buttonType + " " + this.props.className} {...this.props}>{this.props.children}</button>;
	}

}

export default Button;
