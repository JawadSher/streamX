"use client";

import { useEffect, useReducer } from "react";
import { Button } from "../ui/button";
import EditButton from "../edit-button";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { Loader2 } from "lucide-react";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import InputField from "../input-field";
import { updateUser, useUser } from "@/store/features/user/userSlice";
import { useUserAccountUpdate } from "@/hooks/useUser";
import { useDispatch } from "react-redux";

type State = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  editableFields: Record<string, boolean>;
  isBtnDisabled: boolean;
  errors: Record<string, string[] | undefined>;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "TOGGLE_EDITABLE"; field: string }
  | { type: "SET_ERRORS"; errors: Partial<State["errors"]> }
  | { type: "RESET_ERRORS" }
  | { type: "SET_BTN_DISABLED"; value: boolean }
  | { type: "RESET_EDITABLE_FIELDS" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_EDITABLE":
      return {
        ...state,
        editableFields: {
          ...state.editableFields,
          [action.field]: !state.editableFields[action.field],
        },
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: { ...state.errors, ...action.errors },
      };
    case "RESET_ERRORS":
      return {
        ...state,
        errors: {
          firstName: undefined,
          lastName: undefined,
          phoneNumber: undefined,
          country: undefined,
        },
      };
    case "SET_BTN_DISABLED":
      return { ...state, isBtnDisabled: action.value };
    case "RESET_EDITABLE_FIELDS":
      return {
        ...state,
        editableFields: {
          firstName: false,
          lastName: false,
          phoneNumber: false,
          country: false,
        },
      };
    default:
      return state;
  }
}

const AccountForm = () => {
  const initialData = useUser();
  const dispatchRedux = useDispatch();

  const [userAccountUpdate, { loading, data }] = useUserAccountUpdate();

  const [state, dispatch] = useReducer(reducer, {
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    userName: initialData?.userName || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
    country: initialData?.country || "",
    editableFields: {
      firstName: false,
      lastName: false,
      phoneNumber: false,
      country: false,
    },
    isBtnDisabled: false,
    errors: {
      firstName: undefined,
      lastName: undefined,
      phoneNumber: undefined,
      country: undefined,
    },
  });

  if (!initialData) {
    return (
      <div className="text-red-500 text-center">No user data available.</div>
    );
  }

  const toggleEditableField = (fieldName: string) => {
    dispatch({ type: "TOGGLE_EDITABLE", field: fieldName });
  };

  useEffect(() => {
    const isChanged =
      state.firstName !== (initialData.firstName || "") ||
      state.lastName !== (initialData.lastName || "") ||
      state.phoneNumber !== (initialData.phoneNumber || "") ||
      state.country !== (initialData.country || "");

    dispatch({ type: "SET_BTN_DISABLED", value: isChanged });
  }, [
    state.firstName,
    state.lastName,
    state.phoneNumber,
    state.country,
    initialData,
  ]);

  async function handleSubmit() {
    const userData = {
      firstName: state.firstName,
      lastName: state.lastName,
      phoneNumber: state.phoneNumber,
      country: state.country,
    };

    const result = userUpdateSchema.safeParse(userData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      dispatch({
        type: "SET_ERRORS",
        errors: {
          firstName: fieldErrors.firstName,
          lastName: fieldErrors.lastName,
          country: fieldErrors.country,
        },
      });
      toast.error("Please enter valid values in the fields.", {
        duration: 3000,
      });
      return;
    }

    if (state.phoneNumber.trim()) {
      const phoneResult = phoneNumberSchema.safeParse(state.phoneNumber);
      if (!phoneResult.success) {
        const phoneErrors = phoneResult.error.flatten().fieldErrors as {
          phoneNumber?: string[];
        };

        dispatch({
          type: "SET_ERRORS",
          errors: { phoneNumber: phoneErrors.phoneNumber },
        });

        return;
      }
    }

    dispatch({ type: "RESET_ERRORS" });

    userAccountUpdate({
      variables: {
        firstName: state.firstName,
        lastName: state.lastName,
        phoneNumber: state.phoneNumber,
        country: state.country,
      },
    });
  }

  useEffect(() => {
    const status = data?.userAccountUpdate?.statusCode;
    const success = data?.userAccountUpdate?.success;
    if (status === 200 || success === true) {
      dispatchRedux(
        updateUser({
          firstName: state.firstName,
          lastName: state.lastName,
          phoneNumber: state.phoneNumber,
          country: state.country,
        })
      );
      dispatch({ type: "RESET_EDITABLE_FIELDS" });
      dispatch({ type: "SET_BTN_DISABLED", value: false });
    }
  }, [data]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:border-1 md:rounded-2xl">
      <h1 className="text-4xl font-semibold mb-10 text-center">
        Account Information
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <InputField
          label="First Name"
          htmlFor="firstName"
          name="firstName"
          editable={state.editableFields.firstName}
          className="w-full"
          validationError={state.errors?.firstName?.[0]}
          inputValue={state.firstName}
          onChange={(e) => {
            dispatch({
              type: "SET_FIELD",
              field: "firstName",
              value: e.target.value,
            });
            dispatch({ type: "SET_ERRORS", errors: { firstName: undefined } });
          }}
          rightElement={
            <EditButton
              fieldName="firstName"
              setEditableField={toggleEditableField}
            />
          }
        />
        <InputField
          label="Last Name"
          htmlFor="lastName"
          name="lastName"
          editable={state.editableFields.lastName}
          className="w-full"
          validationError={state.errors?.lastName?.[0]}
          inputValue={state.lastName}
          onChange={(e) => {
            dispatch({
              type: "SET_FIELD",
              field: "lastName",
              value: e.target.value,
            });
            dispatch({ type: "SET_ERRORS", errors: { lastName: undefined } });
          }}
          rightElement={
            <EditButton
              fieldName="lastName"
              setEditableField={toggleEditableField}
            />
          }
        />
        <InputField
          label="Username"
          htmlFor="userName"
          name="userName"
          editable={false}
          className="w-full"
          disabled
          inputValue={state.userName}
        />
        <InputField
          label="Email"
          htmlFor="email"
          name="email"
          editable={false}
          className="w-full"
          disabled
          inputValue={state.email}
          isVerified={Boolean(initialData?.isVerified)}
          userId={initialData?._id?.toString()}
        />
        <InputField
          label="Phone Number"
          htmlFor="phoneNumber"
          name="phoneNumber"
          editable={state.editableFields.phoneNumber}
          className="w-full"
          validationError={state.errors?.phoneNumber?.[0]}
          inputValue={state.phoneNumber}
          type="tel"
          onChange={(e) => {
            dispatch({
              type: "SET_FIELD",
              field: "phoneNumber",
              value: e.target.value,
            });
            dispatch({
              type: "SET_ERRORS",
              errors: { phoneNumber: undefined },
            });
          }}
          rightElement={
            <EditButton
              fieldName="phoneNumber"
              setEditableField={toggleEditableField}
            />
          }
        />
        <InputField
          label="Country"
          htmlFor="country"
          name="country"
          editable={state.editableFields.country}
          className="w-full"
          validationError={state.errors?.country?.[0]}
          inputValue={state.country}
          onChange={(e) => {
            dispatch({
              type: "SET_FIELD",
              field: "country",
              value: e.target.value,
            });
            dispatch({ type: "SET_ERRORS", errors: { country: undefined } });
          }}
          rightElement={
            <EditButton
              fieldName="country"
              setEditableField={toggleEditableField}
            />
          }
        />

        <div className="w-full lg:col-span-2 flex flex-col items-center mt-10">
          {loading ? (
            <Loader2 className="animate-spin" size={34} />
          ) : (
            <Button
              type="submit"
              disabled={!state.isBtnDisabled}
              className="w-full max-w-xs cursor-pointer dark:bg-blue-300 dark:hover:bg-blue-400 text-md font-semibold"
            >
              Update Account
            </Button>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Only editable fields can be updated
          </p>
        </div>
      </form>

      <Toaster position="bottom-right" expand={false} />
    </div>
  );
};

export default AccountForm;
