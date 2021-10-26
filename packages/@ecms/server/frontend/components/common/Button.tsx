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

/**
 * Button component with FontAwesome Icons used throughout ECMS.
 * 
 * Use {@link ButtonIconContainer} to wrap icons
 */
export class ButtonWithIcons extends React.Component<{
	buttonType: ButtonTypes,
} & ButtonHTMLAttributes<HTMLButtonElement>> {

	render() {
		return <button className={this.props.buttonType + " icon-button " + this.props.className} {...this.props}>{this.props.children}</button>;
	}

}

/**
 * Use this to wrap icons in a {@link ButtonWithIcons}
 */
export const ButtonIconContainer: React.FC = (props) => (<div className="icon-container">{props.children}</div>);

/**
 * Use this to create a row of button
 */
export const ButtonRow: React.FC = (props) => (<div className="button-row">{props.children}</div>);

export default Button;
