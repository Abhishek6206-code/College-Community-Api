import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const makeSafePublicId = (originalName) => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const safe = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "_");
  return safe.replace(/_+/g, "_").substring(0, 240);
};

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const safeId = `${Date.now()}-${makeSafePublicId(file.originalname)}`;
    return {
      folder: "collegeCommunity",
      resource_type: "image",
      public_id: safeId,
    };
  },
});

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const safeId = `${Date.now()}-${makeSafePublicId(file.originalname)}`;
    return {
      folder: "collegeCommunity",
      resource_type: "auto",
      public_id: safeId,
    };
  },
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadFile = multer({ storage: fileStorage });
