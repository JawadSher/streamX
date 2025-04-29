"use client";

import Form from "next/form";
import { Toaster } from "../ui/sonner";
import InputField from "../input-field";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { API_ROUTES } from "@/lib/api/ApiRoutes";

const AccountSecurityForm = () => {
  const [password, setPassword] = useState<string>("");
  const [confPasswd, setConfPasswd] = useState<string>("");
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true);
  const [isAccDelBtnDisabled, setIsAccBtnDisabled] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const session = useSession();

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
      } else if (result.success) {
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
  }, [password, confPasswd]);

  const debouncedCheck = useCallback(
    debounce((checked: boolean) => {
      setIsAccBtnDisabled(!checked);
    }, 100),
    []
  );

  useEffect(() => {
    debouncedCheck(isChecked);

    return () => {
      debouncedCheck.cancel();
    };
  }, [isChecked, debouncedCheck]);

  function handleSubmit() {
    console.log("Hello world");
  }

  if(!session.data?.user?._id) return redirect(API_ROUTES.HOME);
  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:border-1 md:rounded-2xl overflow-auto">
      <h1 className="text-4xl font-semibold mb-22 text-center ">
        Account Security Information
      </h1>

      <div className="flex flex-col gap-3 w-full ">
        <h1 className="font-semibold text-2xl">Update Your Password</h1>
        <div className="border-1 rounded-2xl py-5 mb-4 overflow-clip">
          <Form
            action={handleSubmit}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <InputField
              label="New Password"
              inputValue={password}
              onChange={(e) => setPassword(e.target.value)}
              editable={true}
              type="password"
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
            />
            {errors.confPasswd && (
              <p className="text-red-500 text-sm px-3">
                {errors.confPasswd?.toString()}
              </p>
            )}

            <Button
              className="px-20 sm:w-full md:max-w-fit justify-self-center mt-4 cursor-pointer rounded-2xl bg-green-400 hover:bg-green-500 text-md"
              disabled={isBtnDisabled}
            >
              Change Password
            </Button>
          </Form>
        </div>
        <h1 className="font-semibold text-2xl">Permanently Delete Account</h1>
        <div className="flex flex-col items-center border-1 border-red-400 rounded-2xl py-3 px-2 gap-10 overflow-clip">
          <p className="bg-amber-600 rounded-xl p-2 text-center w-fit">
            Are you sure you want to permanently delete your account? This
            action cannot be undone.
          </p>
          <Form action={handleSubmit} className="">
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

            <Button
              className="px-10 sm:w-full md:max-w-fit justify-self-center rounded-2xl bg-red-500 hover:bg-red-600 cursor-pointer text-white"
              disabled={isAccDelBtnDisabled}
            >
              Delete Account Permanently
            </Button>
          </Form>
        </div>
        <Separator className="mt-5" />
        <p className="text-sm text-gray-500 text-center">
          Keeping your account secure is our top priority. Make sure to use a
          strong password and manage your account settings carefully.
        </p>
      </div>

      <Toaster position="bottom-right" expand={false} />
    </div>
  );
};

export default AccountSecurityForm;
