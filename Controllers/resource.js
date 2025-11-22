import { Resource } from "../Models/Resource.js";

export const uploadResource = async (req, res) => {
  try {
    const { title, course, year, subject, type } = req.body;
    if (!req.file || !req.file.path) return res.json({ message: "file required" });

    const resource = new Resource({
      title,
      course,
      year,
      subject,
      type,
      fileUrl: req.file.path,
      uploadedBy: req.user._id
    });

    await resource.save();
    res.json({ message: "resource uploaded successfully", resource });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getResources = async (req, res) => {
  try {
    const { course, year, subject, type } = req.query;
    const filter = {};

    if (course) 
      filter.course = course;
    if (year) filter.year = year;
    if (type) filter.type = type;
    if (subject) 
      filter.subject = { $regex: subject, $options: "i" }; // partial match

    const resources = await Resource.find(filter)
      .sort({ uploadedAt: -1 })
      .populate("uploadedBy", "name email");

    res.json(resources);
  } catch (err) {
    res.json({ error: err.message });
  }
};


export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.json({ message: "resource not found" });

    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.json({ message: "not authorized to delete" });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "resource deleted successfully" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
