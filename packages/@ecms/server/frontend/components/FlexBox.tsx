import React from "react";

/**
 * Used to easily create a div that centres everything within it,
 * using flex.
 */
class FlexBox extends React.Component<React.HTMLProps<HTMLDivElement> & {
	direction?: "row" | "row-reverse" | "column" | "column-reverse"
}> {

	render() {
		return <div className={`flexbox ${this.props.className}`} style={{
			flexDirection: this.props.direction
		}}>{this.props.children}</div>;
	}

}

export default FlexBox;
