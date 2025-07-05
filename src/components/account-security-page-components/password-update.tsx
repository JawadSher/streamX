"use client";

import { Loader2 } from "lucide-react";
import { debounce } from "lodash";
import confPassSchema from "@/schemas/confirmPasswdSchema";
import { useCallback, useEffect, useReducer } from "react";
import InputField from "../input-field";
import { Button } from "../ui/button";
import { useUserAccountPasswdUpdate } from "@/hooks/apollo";

type State = {
  password: string | undefined;
  confPasswd: string | undefined;
  isBtnDisabled: boolean;
  errors: {
    password?: string[];
    confPasswd?: string[];
  };
};

type Action =
  | { type: "SET_STATE"; state: keyof State; value: any }
  | { type: "SET_MULTI_STATE"; payload: Partial<State> };

const initialState = {
  password: undefined,
  confPasswd: undefined,
  isBtnDisabled: true,
  errors: {
    password: undefined,
    confPasswd: undefined,
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, [action.state]: action.value };
    case "SET_MULTI_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function PasswordUpdate() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const debounceInputChange = useCallback(
    debounce(async () => {
      const result = await confPassSchema.safeParse({
        password: state.password,
        confPasswd: state.confPasswd,
      });

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        dispatch({
          type: "SET_STATE",
          state: "errors",
          value: {
            password: fieldErrors.password ?? undefined,
            confPasswd: fieldErrors.confPasswd ?? undefined,
          },
        });

        dispatch({
          type: "SET_STATE",
          state: "isBtnDisabled",
          value: true,
        });
      } else {
        dispatch({
          type: "SET_STATE",
          state: "errors",
          value: {
            password: undefined,
            confPasswd: undefined,
          },
        });

        dispatch({
          type: "SET_STATE",
          state: "isBtnDisabled",
          value: false,
        });
      }
    }, 500),
    [state.password, state.confPasswd]
  );

  useEffect(() => {
    if (
      (typeof state.password === "string" && state.password.length > 0) ||
      (typeof state.confPasswd === "string" && state.confPasswd.length > 0)
    ) {
      debounceInputChange();
    }

    return () => {
      dispatch({
        type: "SET_STATE",
        state: "errors",
        value: {
          password: undefined,
          confPasswd: undefined,
        },
      });
      debounceInputChange.cancel();
    };
  }, [state.password, state.confPasswd, debounceInputChange]);

  const [userAccountPasswdUpdate, { loading, data }] =
    useUserAccountPasswdUpdate();
  async function handleSubmit(formData: FormData) {
    const password = formData.get("password")?.toString();
    userAccountPasswdUpdate({
      variables: {
        password,
      },
    });
  }

  useEffect(() => {
    if (data && data.userAccountPasswdUpdate.success) {
      dispatch({
        type: "SET_MULTI_STATE",
        payload: {
          password: undefined,
          confPasswd: undefined,
          isBtnDisabled: true,
        },
      });
    }
  }, [data]);

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-3">Update Your Password</h1>
      <div className="border-1 rounded-2xl py-5 mb-4 overflow-clip">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
          className="flex flex-col gap-2 items-center justify-center px-2"
        >
          <InputField
            label="New Password"
            inputValue={state.password}
            onChange={(e) => {
              dispatch({
                type: "SET_STATE",
                state: "password",
                value: e.target.value,
              });
            }}
            editable={true}
            type="password"
            name="password"
          />
          {state.errors.password && (
            <p className="text-red-500 text-sm px-3">
              {state.errors.password?.toString()}
            </p>
          )}
          <InputField
            label="Confirm New Password"
            inputValue={state.confPasswd}
            onChange={(e) => {
              dispatch({
                type: "SET_STATE",
                state: "confPasswd",
                value: e.target.value,
              });
            }}
            editable={true}
            type="password"
            name="confPasswd"
          />
          {state.errors.confPasswd && (
            <p className="text-red-500 text-sm px-3">
              {state.errors.confPasswd?.toString()}
            </p>
          )}

          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <Button
              className="px-20 w-full mx-2 md:max-w-fit justify-self-center mt-4 cursor-pointer rounded-2xl bg-green-400 hover:bg-green-500 text-md"
              disabled={state.isBtnDisabled}
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
