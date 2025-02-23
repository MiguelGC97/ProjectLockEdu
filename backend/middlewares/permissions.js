exports.authorize = (allowedRoles) => {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new Error("You must specify at least one role for authorization.");
  }

  return (req, res, next) => {
    try {

      const userRole = req.session?.user?.role;
      console.log("User role is:", userRole)

      if (!userRole) {
        return res.status(403).json({ message: "Role is missing or invalid." });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "You shall not pass." });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Server error during authorization." });
    }
  };
};
