import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "collegeCommunity",
    resource_type: "image",
  },
});

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "collegeCommunity",
    resource_type: "raw",
  },
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadFile = multer({ storage: fileStorage });
