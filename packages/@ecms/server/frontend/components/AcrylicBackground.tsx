/* eslint-disable react/prop-types */
import React, { Component } from "react";

/**
 * Blurred acrylic background of the school grounds
 * Used as getting acrylic to work with CSS effects is HARD.
 */
export default class CHBBlurredBG extends Component {
	render() {
		return (
			<div className="acrylic">
				{this.props.children}
			</div>
		);
	}
}