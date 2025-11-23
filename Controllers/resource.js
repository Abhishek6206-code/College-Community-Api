import { Resource } from "../Models/Resource.js";

export const uploadResource = async (req, res) => {
  try {
    console.log("uploadResource called - req.body:", req.body, "req.file:", req.file && {
      originalname: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const { title, course, year, subject, type } = req.body || {};

    if (!title || !course || !year || !subject || !type) {
      return res.status(400).json({ message: "Missing required fields: title, course, year, subject, type" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "File is required" });
    }

    const resource = new Resource({
      title,
      course,
      year,
      subject,
      type,
      fileUrl: req.file.path,
      uploadedBy: req.user?._id || req.user?.id
    });

    await resource.save();
    return res.status(201).json({ message: "resource uploaded successfully", resource });
  } catch (err) {
    console.error("uploadResource error:", err && (err.stack || err));
    return res.status(500).json({ error: err.message || "Server error during upload" });
  }
};

export const getResources = async (req, res) => {
  try {
    const { course, year, subject, type } = req.query;
    const filter = {};

    if (course) filter.course = course;
    if (year) filter.year = year;
    if (type) filter.type = type;
    if (subject) filter.subject = { $regex: subject, $options: "i" };

    const resources = await Resource.find(filter)
      .sort({ uploadedAt: -1 })
      .populate("uploadedBy", "name email");

    return res.json(resources);
  } catch (err) {
    console.error("getResources error:", err && (err.stack || err));
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "resource not found" });

    const userId = req.user?._id?.toString() || req.user?.id?.toString();
    if (!userId) return res.status(401).json({ message: "Login required" });

    if (resource.uploadedBy.toString() !== userId) {
      return res.status(403).json({ message: "not authorized to delete" });
    }

    await Resource.findByIdAndDelete(req.params.id);
    return res.json({ message: "resource deleted successfully" });
  } catch (err) {
    console.error("deleteResource error:", err && (err.stack || err));
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
