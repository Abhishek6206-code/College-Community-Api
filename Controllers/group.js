import { Group } from "../Models/Group.js";
import { Message } from "../Models/Message.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const group = new Group({
      name,
      description,
      type,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: "admin" }]
    });
    await group.save();
    res.json({ success: true, message: "Group created successfully", group });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .populate("joinRequests.user", "name email");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    const alreadyMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: "Already a member" });
    }

    const alreadyRequested = group.joinRequests.some(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyRequested) {
      return res.status(400).json({ success: false, message: "Already requested to join" });
    }

    group.joinRequests.push({ user: req.user._id });
    await group.save();
    res.json({ success: true, message: "Join request sent" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    const admin = group.members.find(m => m.user.toString() === req.user._id.toString() && m.role === "admin");
    if (!admin) return res.status(403).json({ success: false, message: "Only admins can accept requests" });

    const requestIndex = group.joinRequests.findIndex(r => r.user.toString() === userId);
    if (requestIndex === -1) return res.status(400).json({ success: false, message: "No such request" });

    group.members.push({ user: userId, role: "member" });
    group.joinRequests.splice(requestIndex, 1);
    await group.save();

    const populated = await Group.findById(id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .populate("joinRequests.user", "name email");

    res.json({ success: true, message: "Request accepted", group: populated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ "members.user": req.user._id })
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .populate("joinRequests.user", "name email");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    group.members = group.members.filter(m => m.user.toString() !== req.user._id.toString());
    await group.save();
    res.json({ success: true, message: "Left group successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.id })
      .populate("sender", "name email")
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    const requester = group.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    if (!requester || requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can remove members" });
    }

    group.members = group.members.filter(m => m.user.toString() !== userId);
    await group.save();

    const populated = await Group.findById(group._id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .populate("joinRequests.user", "name email");

    res.json({ success: true, message: "Member removed successfully", group: populated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
