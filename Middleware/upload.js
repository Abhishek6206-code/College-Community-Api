import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const makeSafePublicId = (originalName) => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  return nameWithoutExt
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 240);
};

const adaptiveStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isImage = (file.mimetype || "").startsWith("image/");
    const safeId = `${Date.now()}-${makeSafePublicId(file.originalname)}`;
    return {
      folder: "collegeCommunity",
      resource_type: isImage ? "image" : "raw",
      public_id: safeId,
    };
  },
});

export const upload = multer({ storage: adaptiveStorage });
