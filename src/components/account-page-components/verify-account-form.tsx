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
import { z } from "zod";
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
import { useEffect, useReducer } from "react";
import { Loader2 } from "lucide-react";
import { userAccountVerification } from "@/services";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/store/features/user/userSlice";
import AnimatedTick from "../animated-check";
import { RootState } from "@/store/store";

type State = {
  isSended: boolean;
  verified: boolean;
  dialogOpen: boolean;
  success: boolean;
  coolDown: boolean;
  coolDownTimeValue: Date | string | number | null;
  expiryTime: string | number | null;
};

type Action = { type: "SET_STATE"; state: keyof State; value: any };

const initialState: State = {
  isSended: false,
  verified: false,
  dialogOpen: false,
  success: false,
  expiryTime: null,
  coolDown: false,
  coolDownTimeValue: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, [action.state]: action.value };
    default:
      return state;
  }
}

const FormSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "The verification code must be 6 digits." })
    .max(6, { message: "The verification code must be 6 digits." }),
});

export function VerifyAccountForm() {
  const coolDownTime = useSelector(
    (state: RootState) => state.user.userData?.coolDownData?.coolDownTime
  );

  console.log("---------->", coolDownTime);
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();
  const [userAccountVerify, { data, loading }] = userAccountVerification();

  useEffect(() => {
    if (coolDownTime) {
      const coolDownAsDate = new Date(Number(coolDownTime));
      const now = new Date();
      if (coolDownAsDate > now) {
        dispatch({
          type: "SET_STATE",
          state: "coolDown",
          value: true,
        });
        dispatch({
          type: "SET_STATE",
          state: "coolDownTimeValue",
          value: coolDownAsDate,
        });

        // Remove cooldown after it's expired
        const timeoutId = setTimeout(() => {
          dispatch({ type: "SET_STATE", state: "coolDown", value: false });
          dispatch({
            type: "SET_STATE",
            state: "coolDownTimeValue",
            value: null,
          });
        }, coolDownAsDate.getTime() - now.getTime());

        return () => clearTimeout(timeoutId);
      }
    }
  }, [coolDownTime]);

  useEffect(() => {
    const response = data?.userAccountVerify;
    if (!response) return;

    if (response?.statusCode === 200 && response?.code === "OTP_SENDED") {
      dispatch({
        type: "SET_STATE",
        state: "isSended",
        value: true,
      });

      dispatch({
        type: "SET_STATE",
        state: "expiryTime",
        value: response.data.OTP_Expires_On,
      });

      const cooldownRaw = response.data.coolDownTime;
      dispatchRedux(
        updateUser({
          coolDownData: {
            coolDownTime: cooldownRaw,
            success: true,
          },
        })
      );
    } else if (response?.statusCode === 200 && response?.code === "OTP_VALID") {
      dispatchRedux(updateUser({ isVerified: true }));
      dispatch({ type: "SET_STATE", state: "verified", value: true });

      dispatchRedux(
        updateUser({ coolDownData: { coolDownTime: null, success: true } })
      );

      setTimeout(() => {
        dispatch({ type: "SET_STATE", state: "dialogOpen", value: false });
      }, 3000);
    }
  }, [data, dispatchRedux]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { pin: "" },
  });

  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    const pin = data.pin;
    if (pin?.trim()?.length === 6 && typeof pin === "string") {
      userAccountVerify({
        variables: {
          state: "verify",
          u_OTP: pin,
        },
      });
    }
  }

  async function handleSendOTP() {
    dispatch({ type: "SET_STATE", state: "coolDown", value: true });
    userAccountVerify({
      variables: {
        state: "store",
      },
    });
  }

  return (
    <Dialog
      open={state.dialogOpen}
      onOpenChange={(open) =>
        dispatch({ type: "SET_STATE", state: "dialogOpen", value: open })
      }
    >
      <DialogTrigger asChild>
        <Button className="p-0 m-0 bg-transparent hover:bg-transparent cursor-pointer text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors duration-200">
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-[600px] h-fit">
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
          {state.isSended ? (
            <DialogDescription>
              A 6-digit verification code has been sent to your email address.
              Please enter the code below to complete the verification process.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Please click on the send code button below to send the 6-digit
              verification code.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="grid pt-6 w-full">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                form.handleSubmit(handleSubmit)(e);
              }}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <div className={`flex gap-2 items-center`}>
                      <FormLabel className="text-md font-semibold">
                        Verification Code
                      </FormLabel>

                      {loading && !state.isSended ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : !state.coolDown ? (
                        <Button
                          onClick={handleSendOTP}
                          type="button"
                          className="text-sm text-blue-400 px-0 bg-transparent hover:text-blue-500 hover:bg-transparent cursor-pointer"
                        >
                          {state.isSended ? "Resend code" : "Send code"}
                        </Button>
                      ) : null}
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
                    {state.coolDown && (
                      <span className="text-sm text-yellow-500">
                        Please wait until{" "}
                        {new Date(
                          state.coolDownTimeValue as number
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        to resend the code.
                      </span>
                    )}

                    <FormDescription>
                      Enter the 6-digit code you received via email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading && state.isSended ? (
                <Loader2 className="animate-spin justify-center" size={28} />
              ) : state.verified ? (
                <AnimatedTick />
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-2xl"
                >
                  Verify Account
                </Button>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
