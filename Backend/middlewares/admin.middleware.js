export const isAdmin = (req, res, next) => {
  try {
    // req.user verifyToken se aa raha hai
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};