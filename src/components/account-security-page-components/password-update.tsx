"use client";

import { updateUserPasswd } from "@/app/actions/user-actions/updateUserPasswd";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import { useActionState, useCallback, useEffect, useState } from "react";
import InputField from "../input-field";
import { Button } from "../ui/button";
import Form from "next/form";
import { useUserAccountPasswdUpdate } from "@/hooks/apollo/useUser";

function PasswordUpdate() {
  const [password, setPassword] = useState<string>("");
  const [confPasswd, setConfPasswd] = useState<string>("");
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true);
  const [errors, setError] = useState<{
    password: string[] | null;
    confPasswd: string[] | null;
  }>({
    password: null,
    confPasswd: null,
  });

  const debounceInputChange = useCallback(
    debounce(async () => {
      const result = await confPassSchema.safeParse({ password, confPasswd });
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setError({
          password: fieldErrors.password ?? null,
          confPasswd: fieldErrors.confPasswd ?? null,
        });
      } else {
        setError({
          password: null,
          confPasswd: null,
        });
        setIsBtnDisabled(false);
      }
    }, 500),
    [debounce, password, confPasswd]
  );

  useEffect(() => {
    if (password.length > 0 || confPasswd.length > 0) {
      debounceInputChange();
    }

    return () => {
      setError({
        password: null,
        confPasswd: null,
      });
      debounceInputChange.cancel();
    };
  }, [password, confPasswd, debounceInputChange]);

  const { mutate, isPending, status } = useUserAccountPasswdUpdate();
  async function handlePasswdSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")?.toString();
    mutate({ password });
  }

  useEffect(() => {
    if (status === "success") {
      setPassword("");
      setConfPasswd("");
      setIsBtnDisabled(true);
    }
  }, [status]);

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-3">Update Your Password</h1>
      <div className="border-1 rounded-2xl py-5 mb-4 overflow-clip">
        <form
          onSubmit={handlePasswdSubmit}
          className="flex flex-col gap-2 items-center justify-center px-2"
        >
          <InputField
            label="New Password"
            inputValue={password}
            onChange={(e) => setPassword(e.target.value)}
            editable={true}
            type="password"
            name="password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm px-3">
              {errors.password?.toString()}
            </p>
          )}
          <InputField
            label="Confirm New Password"
            inputValue={confPasswd}
            onChange={(e) => setConfPasswd(e.target.value)}
            editable={true}
            type="password"
            name="confPasswd"
          />
          {errors.confPasswd && (
            <p className="text-red-500 text-sm px-3">
              {errors.confPasswd?.toString()}
            </p>
          )}

          {isPending ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <Button
              className="px-20 w-full mx-2 md:max-w-fit justify-self-center mt-4 cursor-pointer rounded-2xl bg-green-400 hover:bg-green-500 text-md"
              disabled={isBtnDisabled}
              type="submit"
            >
              Change Password
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default PasswordUpdate;
