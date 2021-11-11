import React, { ButtonHTMLAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";

export type ButtonTypes = "primary";
export type ButtonProps = {
	buttonType?: ButtonTypes,
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button component used throughout ECMS.
 * This is our custom button we use.
 */
const Button: React.FC<ButtonProps> = ({ buttonType = "primary", className = "", children, ...props }) => {
	return (
		<button className={buttonType + " " + className} {...props}>
			{children}
		</button>
	);
};

/**
 * Button component with FontAwesome Icons used throughout ECMS.
 * 
 * Use {@link ButtonIconContainer} to wrap icons
 */
export class ButtonWithIcons extends React.Component<ButtonProps> {

	render() {
		return <button className={(this.props.buttonType || "primary") + " icon-button " + this.props.className} {...this.props}>{this.props.children}</button>;
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

export type LinkedButtonProps = ButtonProps & LinkProps & {
	linkClassName?: string;
	as?: typeof Button;
};

/**
 * Button that is also a React-Router Link.
 * 
 * Use the `as` props to provide e.g. a ButtonWithIcons
 * 
 * NB Use the linkClassName prop to change the Link component's class.
 * @deprecated Just wrap a Button in a Link.
 */
export const LinkedButton: React.FC<LinkedButtonProps> = (props) => {
	if (!props.as) {
		return (
			<Link {...props} className={`linked-button ${props.linkClassName}`}>
				<Button {...props} >
					{props.children}
				</Button>
			</Link>
		);
	} else {
		return (
			<Link {...props} className={`linked-button ${props.linkClassName}`}>
				<props.as {...props} >
					{props.children}
				</props.as>
			</Link>
		);
	}

};

export default Button;
