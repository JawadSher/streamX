import { Badge } from "@/components/ui/badge";
import { CheckIcon, X } from "lucide-react";

export default function AccountVerificationStatusBadge({
  accountVerificationStatus,
}: {
  accountVerificationStatus: boolean | null | undefined;
}) {
  const textColor = accountVerificationStatus
    ? "text-emerald-500"
    : "text-red-500";
  const value = accountVerificationStatus ? "True" : "False";

  return (
    <Badge variant="outline" className={`gap-1 ${textColor}`}>
      {accountVerificationStatus ? (
        <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
      ) : (
        <X className="text-red-500" size={12} aria-hidden="true" />
      )}
      {value}
    </Badge>
  );
}
