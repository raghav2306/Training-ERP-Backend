import { Schema, model } from "mongoose";

const permissionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Permission = model("Permission", permissionSchema);
