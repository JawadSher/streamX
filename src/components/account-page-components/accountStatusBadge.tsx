import { Badge } from "@/components/ui/badge";

export default function AccountStatusBadge({
  accountStatus,
}: {
  accountStatus: string | null | undefined;
}) {
  const bgColor =
    accountStatus === "suspended"
      ? "bg-amber-500"
      : accountStatus === "deleted"
        ? "bg-red-500"
        : "bg-emerald-500";

  const textColor =
    accountStatus === "suspended"
      ? "text-amber-500"
      : accountStatus === "deleted"
        ? "text-red-500"
        : "text-emerald-500";

  const value =
    accountStatus === "suspended"
      ? "Suspended"
      : accountStatus === "deleted"
        ? "Deleted"
        : "Active";
  return (
    <Badge variant="outline" className={`gap-1.5 ${textColor}`}>
      <span
        className={`size-1.5 rounded-full ${bgColor}`}
        aria-hidden="true"
      ></span>
      {value}
    </Badge>
  );
}
