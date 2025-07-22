import { Loader2 } from "lucide-react";

function Loading({ isColorRed = false }) {
  return (
    <Loader2
      className="animate-spin"
      size={34}
      color={isColorRed ? "red" : "white"}
    />
  );
}

export default Loading;
