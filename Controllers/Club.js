import { Club } from "../Models/Club.js";
import { User } from "../Models/User.js";
import { Group } from "../Models/Group.js";

export const createClub = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    let coverImage = "";
    if (req.file) coverImage = req.file.path;

    const club = new Club({
      name,
      description,
      category,
      coverImage,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: "admin" }]
    });

    await club.save();

    // Create a private group for this club
    const group = await Group.create({
      name: `${name} Club Group`,
      description: `Private group for ${name} club`,
      type: "private",
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: "admin" }]
    });

    club.groupId = group._id;
    await club.save();

    await User.findByIdAndUpdate(req.user._id, { $push: { clubsJoined: club._id } });

    res.json({ message: "Club and private group created successfully", club });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("createdBy", "name email")
      .populate("members.user", "name email")   
      .populate("pendingRequests", "name email");
    res.json(clubs);
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .populate("pendingRequests", "name email")
      .populate("groupId", "name");
    if (!club) return res.json({ message: "club not found" });
    res.json(club);
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const requestToJoinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.json({ message: "club not found" });

    const isAlreadyMember = club.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (isAlreadyMember) return res.json({ message: "already a member" });

    if (club.pendingRequests.includes(req.user._id))
      return res.json({ message: "already requested" });

    club.pendingRequests.push(req.user._id);
    await club.save();
    res.json({ message: "join request sent" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const acceptMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.json({ message: "club not found" });

    const adminMember = club.members.find(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );
    if (!adminMember) return res.json({ message: "only admin can accept members" });

    const userId = req.params.userId;
    if (!club.pendingRequests.includes(userId))
      return res.json({ message: "no such request" });

    club.pendingRequests = club.pendingRequests.filter(
      (id) => id.toString() !== userId
    );
    club.members.push({ user: userId, role: "member" });
    await club.save();

    await User.findByIdAndUpdate(userId, { $push: { clubsJoined: club._id } });

    if (club.groupId) {
      const group = await Group.findById(club.groupId);
      if (group) {
        const alreadyMember = group.members.some(
          (m) => m.user.toString() === userId.toString()
        );
        if (!alreadyMember) {
          group.members.push({ user: userId, role: "member" });
          await group.save();
        }
      }
    }

    res.json({ message: "member accepted and added to group", club });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.json({ message: "club not found" });

    
    club.members = club.members.filter(
      (m) => m.user.toString() !== req.user._id.toString()
    );
    await club.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { clubsJoined: club._id },
    });

    if (club.groupId) {
      const group = await Group.findById(club.groupId);
      if (group) {
        group.members = group.members.filter(
          (m) => m.user.toString() !== req.user._id.toString()
        );
        await group.save();
      }
    }

    res.json({ message: "left club successfully" });
  } catch (err) {
    res.json({ error: err.message });
  }
};


export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.json({ message: "club not found" });

    const isAdmin = club.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );
    if (!isAdmin) return res.json({ message: "only admin can update club" });

    const { name, description, category } = req.body;
    if (name) club.name = name;
    if (description) club.description = description;
    if (category) club.category = category;
    if (req.file) club.coverImage = req.file.path;

    await club.save();
    res.json({ message: "club updated successfully", club });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.json({ message: "club not found" });

    const isAdmin = club.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "admin"
    );
    if (!isAdmin) return res.json({ message: "only admin can delete club" });

    await Club.findByIdAndDelete(req.params.id);
    await User.updateMany(
      { clubsJoined: club._id },
      { $pull: { clubsJoined: club._id } }
    );

    res.json({ message: "club deleted successfully" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
