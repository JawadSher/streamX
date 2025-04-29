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
import bcrypt from "bcryptjs";

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
    []
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

  async function handlePasswdSubmit(
    state: ActionErrorType | ActionResponseType | null,
    formData: FormData
  ): Promise<ActionErrorType | ActionResponseType> {
    const password = formData.get("password")?.toString();
    const hashPasswd = await bcrypt.hash(password?.toString()!, 10);
    const response = await updateUserPasswd({ passwd: hashPasswd });
    return response;
  }

  const [state, formAction, isPending] = useActionState(
    handlePasswdSubmit,
    null
  );

  useEffect(() => {
    if (state && state.message) {
      if (state.statusCode === 200) {
        toast.success(state.message);
        setPassword("");
        setConfPasswd("");
        setIsBtnDisabled(true);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-3">Update Your Password</h1>
      <div className="border-1 rounded-2xl py-5 mb-4 overflow-clip">
        <Form
          action={formAction}
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
            name="confPasswd" // Add name attribute for FormData
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
        </Form>
      </div>
    </div>
  );
}

export default PasswordUpdate;
