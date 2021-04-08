import * as mongoose from "mongoose";
import {CDUserSchema, CheckSchema} from "./Schemas";

export const CDUser = mongoose.model("CDUser", CDUserSchema)
export const Check = mongoose.model("Check", CheckSchema)