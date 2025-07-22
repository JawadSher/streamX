import { toast } from "sonner";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

export function Toaster({
  Title,
  Description,
  type = "success",
}: {
  Title?: string;
  Description?: string;
  type?: "success" | "error";
}) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex items-start gap-3">
        {type === "success" ? (
          <CheckCircle2Icon className="text-green-500 mt-0.5" size={18} />
        ) : (
          <XCircleIcon className="text-red-500 mt-0.5" size={18} />
        )}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{Title || "Notification"}</p>
          {Description && (
            <p className="text-sm text-muted-foreground">{Description}</p>
          )}
        </div>
      </div>
    </div>
  ), { duration: 4000 });
}

Toaster.success = (title: string, description?: string) => {
  Toaster({ Title: title, Description: description, type: "success" });
};

Toaster.error = (title: string, description?: string) => {
  Toaster({ Title: title, Description: description, type: "error" });
};
