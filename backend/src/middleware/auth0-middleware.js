import { auth, claimCheck, InsufficientScopeError, } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

const validateAccessToken = auth({
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    audience: process.env.AUTH0_AUDIENCE,
});

const checkRequiredPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        const permissionCheck = claimCheck((payload) => {
            const permissions = payload.permissions || [];

            const hasRequiredPermissions = requiredPermissions.every((requiredPermission) => 
                permissions.includes(requiredPermission));

            if(!hasRequiredPermissions) {
                throw new InsufficientScopeError();
            }

            return hasRequiredPermissions;
        });

        permissionCheck(req, res, next);
    };
};

module.exports = {
    validateAccessToken,
    checkRequiredPermissions,
  };
  