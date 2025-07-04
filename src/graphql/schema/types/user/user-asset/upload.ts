import { scalarType } from "nexus";

export const UploadScalar = scalarType({
  name: "Upload",
  asNexusMethod: "upload", 
  description: "A file upload scalar",
  serialize: () => {
    throw new Error("Upload scalar cannot be serialized");
  },
  parseValue: () => {
    throw new Error("Upload scalar cannot be parsed");
  },
  parseLiteral: () => {
    throw new Error("Upload scalar cannot be parsed from a literal");
  },
});