import React from "react";
import { Route, RouteProps } from "react-router-dom";
/**
 * Protected Route.
 * Only renders if user logged in.
 * Else, redirect to login
 */
const ProtectedRoute: React.FC<RouteProps> = ({ component: Component, ...props }) => {
	return (
		<Route
			{...props}
			render={
				(props) => 
			}
			/>
	);
};

export default ProtectedRoute;