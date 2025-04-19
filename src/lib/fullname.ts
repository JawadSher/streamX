import { capitalize } from "./capitalize";

interface Props {
    firstName?: string | null;
    lastName?: string | null;
    userName?: string | null;
}

export const fullname = ({ firstName, lastName, userName }: Props): string => {
    const full = `${capitalize(firstName || "")} ${capitalize(lastName || "")}`.trim();
    return full || userName || "Unknown User";
  };