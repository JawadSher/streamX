"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { SendVerificationCode } from "@/lib/sendOTP";
import { toast } from "sonner";
import { handleUserOTP } from "@/app/actions/user-actions/handleUserOTP";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";

const FormSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "The verification code must be 6 digits." })
    .max(6, { message: "The verification code must be 6 digits." }),
});

export function VerifyAccountForm({
  userEmail,
  userId,
}: {
  userEmail: string;
  userId: string;
}) {
  const [isSended, setIsSended] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    if (isSended) {
      const timer = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSended(false);
            toast.info("OTP expired. Please resend the code.");
            return 120;
          }
          return prev - 1;
        });
      }, 1000);

      async function OTPHandle() {
        await handleUserOTP({ userId, state: "delete" });
      }

      if (countDown <= 1 || !isSended) {
        OTPHandle();
      }

      return () => clearInterval(timer);
    }
  }, [isSended]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const pin = data.pin;
    if (
      pin?.trim()?.length === 6 &&
      typeof pin === "string" &&
      countDown > 1 &&
      isSended
    ) {
      const response: ActionResponseType | ActionErrorType = await handleUserOTP({ userId, state: "get" });
      console.log(response);
      if(response.statusCode === 200){
        if (response?.data?.OTP?.toString() === pin) {
          const res: ActionResponseType | ActionErrorType = await handleUserOTP({
            userId,
            state: "verified",
          });
  
          if (res.statusCode === 200 || res.data.isVerified === true) {
            toast.success("Account Verified Successfully");
            return;
          }
        }
      }
    }

    toast.error("OTP is Invalid or Expired");
    return;
  }

  function OTPCountdown() {
    let time = 120;

    const timer = setInterval(() => {
      if (time > 0) {
        time = time - 1;
        setCountDown(time);
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }

  async function handleSendOTP() {
    try {
      const response = await SendVerificationCode({ userEmail, userId });
      if (response.status && response.statusCode === 200) {
        toast.success("One-time passcode sent to your email");
        OTPCountdown();
        setIsSended(true);
        setCountDown(120);
      } else {
        setIsSended(false);
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      setIsSended(false);
      toast.error("Error sending OTP. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-0 m-0 bg-transparent hover:bg-transparent cursor-pointer text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors duration-200">
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-[600px] h-fit">
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
          {isSended ? (
            <DialogDescription>
              A 6-digit verification code has been sent to your email address.
              Please enter the code below to complete the verification process.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Please click on bellow resend code button to send the 6 digit
              verification code.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="grid pt-6 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center ">
                      <FormLabel className="text-md font-semibold">
                        Verification Code
                      </FormLabel>
                      {isSended ? (
                        <span className="text-sm text-blue-400">
                          {countDown}
                        </span>
                      ) : (
                        <Button
                          className="text-sm text-blue-400 cursor-pointer px-0 bg-transparent hover:bg-transparent hover:text-blue-500"
                          onClick={handleSendOTP}
                          type="button"
                        >
                          resend code
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit code you received via email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-2xl"
              >
                Verify Account
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
