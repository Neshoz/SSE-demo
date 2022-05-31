import crypto from "crypto";

export function uuid() {
  return crypto.randomBytes(36).toString("hex");
}
