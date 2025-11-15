export function verifyRole(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole) {
            return res
                .status(403)
                .json({ message: "Forbidden: No role found" });
        }
        if (!allowedRoles.includes(userRole)) {
            return res
                .status(403)
                .json({ message: "Access denied: Insufficient permissions" });
        }
        next();
    };
}
