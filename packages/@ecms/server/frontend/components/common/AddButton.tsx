/** Simples regular button with a Plus sign as its icon */

import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonWithIcons, ButtonIconContainer, ButtonProps } from "./Button";


const AddButton: React.FC<ButtonProps> = (props) => {
	return (
		<ButtonWithIcons {...props}>
			<ButtonIconContainer>
				<FontAwesomeIcon icon={faPlus} />
			</ButtonIconContainer>

			{props.children}
		</ButtonWithIcons>
	);
};

export default AddButton;