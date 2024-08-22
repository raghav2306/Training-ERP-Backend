import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isRoleDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Role = model("Role", roleSchema);
