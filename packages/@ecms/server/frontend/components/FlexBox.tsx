import React from "react";

/**
 * Used to easily create a div that centres everything within it,
 * using flex.
 */
class FlexBox extends React.Component<React.HTMLProps<HTMLDivElement>> {

	render() {
		return <div className={`flexbox ${this.props.className}`}>{this.props.children}</div>;
	}

}

export default FlexBox;
