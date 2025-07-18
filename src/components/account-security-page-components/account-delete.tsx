"use client";

import { debounce } from "lodash";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useUserAccountDeletion } from "@/hooks/apollo";

function AccountDelete() {
  const [isAccDelBtnDisabled, setIsAccBtnDisabled] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const debouncedCheck = useCallback(
    debounce((checked: boolean) => {
      setIsAccBtnDisabled(!checked);
    }, 100),
    [debounce]
  );

  useEffect(() => {
    debouncedCheck(isChecked);

    return () => {
      debouncedCheck.cancel();
    };
  }, [isChecked, debouncedCheck]);

  const [accountDelete, { loading }] = useUserAccountDeletion();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    accountDelete();
  }

  return (
    <div>
      <div className="flex flex-col gap-3 w-full ">
        <h1 className="font-semibold text-2xl">Permanently Delete Account</h1>
        <div className="flex flex-col justify-center border-1 border-red-400 rounded-2xl py-3 px-3 gap-10 overflow-clip">
          <p className="bg-amber-600 rounded-sm px-2 py-1 text-center w-fit">
            Are you sure you want to permanently delete your account? This
            action cannot be undone.
          </p>
          <form onSubmit={handleSubmit} className="">
            <div className="flex flex-col leading-none gap-2 mb-4">
              <div className="flex items-center justify-start">
                <Checkbox
                  id="delete-confirm"
                  className="mr-2"
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(!!checked)}
                />
                <label
                  htmlFor="delete-confirm"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm permanent account deletion
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                By checking this box, you agree that your account will be
                permanently deleted and cannot be recovered.
              </p>
            </div>

            {loading ? (
              <Loader2 className="animate-spin justify-self-center" size={24} />
            ) : (
              <Button
                className="px-10 w-full md:max-w-fit justify-self-center rounded-2xl bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                disabled={isAccDelBtnDisabled}
                type="submit"
              >
                Delete Account Permanently
              </Button>
            )}
          </form>
        </div>
        <Separator className="mt-5" />
        <p className="text-sm text-gray-500 text-center">
          Keeping your account secure is our top priority. Make sure to use a
          strong password and manage your account settings carefully.
        </p>
      </div>
    </div>
  );
}

export default AccountDelete;
