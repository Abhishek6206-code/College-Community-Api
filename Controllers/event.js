import { Event } from "../Models/Event.js";
import { Club } from "../Models/Club.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, clubId, place, contactInfo } = req.body;
    const club = await Club.findById(clubId);
    if (!club) return res.json({ message: "club not found" });

    const isAdmin = club.members.some(
      m => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );
    if (!isAdmin) return res.json({ message: "only club admins can create event" });

    let imageUrl = "";
    if (req.file) imageUrl = req.file.path;

    const event = new Event({
      title,
      description,
      date,
      clubId,
      place,
      contactInfo,
      imageUrl,
      createdBy: req.user._id
    });

    await event.save();
    res.json({ message: "event created successfully", event });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const filter = req.query.filter;
    let events;
    if (filter === "upcoming") {
      events = await Event.find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .populate("clubId", "name");
    } else if (filter === "past") {
      events = await Event.find({ date: { $lt: new Date() } })
        .sort({ date: -1 })
        .populate("clubId", "name");
    } else {
      events = await Event.find().sort({ date: 1 }).populate("clubId", "name");
    }
    res.json(events);
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("clubId", "name");
    if (!event) return res.json({ message: "event not found" });
    res.json(event);
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.json({ message: "event not found" });

    const club = await Club.findById(event.clubId);
    if (!club) return res.json({ message: "club not found" });

    const isAdmin = club.members.some(
      m => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );
    if (!isAdmin) return res.json({ message: "only club admins can update event" });

    const { title, description, date, place, contactInfo } = req.body;
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (place) event.place = place;
    if (contactInfo) event.contactInfo = contactInfo;
    if (req.file) event.imageUrl = req.file.path;

    await event.save();
    res.json({ message: "event updated", event });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.json({ message: "event not found" });

    const club = await Club.findById(event.clubId);
    if (!club) return res.json({ message: "club not found" });

    const isAdmin = club.members.some(
      m => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );
    if (!isAdmin) return res.json({ message: "only club admins can delete event" });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "event deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
