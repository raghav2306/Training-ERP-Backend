import { Schema, model } from "mongoose";

const permissionSchema = new Schema({
  permissionId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export const Permission = model("Permission", permissionSchema);
