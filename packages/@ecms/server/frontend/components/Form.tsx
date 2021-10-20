import React from "react";

class Form extends React.Component<React.HTMLProps<HTMLFormElement>> {
	render() {
		return <form className={`form-container ${this.props.className}`} {...this.props}>{this.props.children}</form>;
	}

}

export default Form;
