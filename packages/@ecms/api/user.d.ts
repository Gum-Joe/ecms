/**
 * Used to check roles for a logged in user
 *
 * @return true if the user has any of the roles specified to check for
 */
export interface ReqCheckRoles {
    /** Array of roles to check if the user has. Will r */
    rolesToCheck: string[];
}
/**
 * Returned response body for {@link ReqCheckRoles}
 */
export interface ResCheckRoles {
    hasPermission: boolean;
}
//# sourceMappingURL=user.d.ts.map