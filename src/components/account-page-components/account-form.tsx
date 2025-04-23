"use client";

import Form from "next/form";
import InputField from "./input-field";
import React, { useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import EditButton from "../edit-button";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { revalidateUserData } from "@/app/actions/getUserData";
import useSWR from "swr";
import AccountPageSkeleton from "../skeletons/account-page-skeleton";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { Loader2 } from "lucide-react";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";

interface AccountFormProps {
  initialData: IRedisDBUser;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  general?: string;
}

interface FormState {
  errors: FormErrors;
  success: boolean;
}

const AccountForm = ({ initialData }: AccountFormProps) => {
  const fetcher = async (): Promise<IRedisDBUser> => {
    const data = await revalidateUserData();
    if (!data) {
      throw new Error("Failed to fetch user data");
    }
    return data;
  };

  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IRedisDBUser>("user-data", fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
    refreshInterval: 600000,
  });

  const [firstName, setFirstName] = useState<string>(initialData?.firstName || "");
  const [lastName, setLastName] = useState<string>(initialData?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(initialData?.phoneNumber || "");
  const [country, setCountry] = useState<string>(initialData?.country || "");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [editableField, setEditableField] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (userData) {
      setErrors({});
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhoneNumber(userData.phoneNumber || "");
      setCountry(userData.country || "");
    }
  }, [userData]);

  useEffect(() => {
    const isSameAsInitial =
      (initialData?.firstName?.trim() || "") === firstName.trim() &&
      (initialData?.lastName?.trim() || "") === lastName.trim() &&
      (initialData?.phoneNumber?.trim() || "") === phoneNumber.trim() &&
      (initialData?.country?.trim() || "") === country.trim();

    setIsDisabled(isSameAsInitial);
  }, [firstName, lastName, phoneNumber, country, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "country":
        setCountry(value);
        break;
    }
  };

  async function handleSubmit(state: FormState, formData: FormData): Promise<FormState> {
    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;
    const country = formData.get("country") as string | null;

    const updatedData = {
      firstName,
      lastName,
      phoneNumber,
      country,
    };

    const result = await userUpdateSchema.safeParse(updatedData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return {
        errors: {
          firstName: fieldErrors.firstName?.[0],
          lastName: fieldErrors.lastName?.[0],
          phoneNumber: fieldErrors.phoneNumber?.[0],
          country: fieldErrors.country?.[0],
        },
        success: false,
      };
    }

    try {
      const response = await axiosInstance.put(API_ROUTES.USER_UPDATE, {
        updatedData,
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        return {
          errors: {},
          success: true,
        };
      } else {
        toast.error(response.data?.message || "Failed to update profile");
        return {
          errors: {
            general: response.data?.message || "Failed to update profile",
          },
          success: false,
        };
      }
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred while updating your profile";
      toast.error(errorMessage);

      return {
        errors: {
          ...error.response?.data?.errors,
          general: errorMessage,
        },
        success: false,
      };
    }
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    errors: {},
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      setEditableField(null);
      mutate();
      setErrors({});
    } else {
      setErrors(state.errors);
    }
  }, [state, mutate]);

  if (!userData) {
    return <AccountPageSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 rounded-md bg-red-50 dark:bg-red-900/20">
        <p className="font-semibold">Failed to load user data</p>
        <p className="text-sm">{error.message}</p>
        <Button
          onClick={() => mutate()}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Form
      action={formAction}
      className="grid grid-cols-1 grid-rows-5 md:grid-cols-2 max-w-[1100px] w-full gap-4"
    >
      <InputField
        htmlFor="firstName"
        name="firstName"
        label="First Name"
        inputValue={firstName}
        editable={editableField === "firstName"}
        onChange={handleInputChange}
        validationError={errors?.firstName}
        aria-invalid={!!errors?.firstName}
        aria-describedby={errors?.firstName ? "firstName-error" : undefined}
      >
        <EditButton
          fieldName="firstName"
          setEditableField={setEditableField}
          disabled={isPending}
        />
      </InputField>

      <InputField
        htmlFor="lastName"
        name="lastName"
        label="Last Name"
        inputValue={lastName}
        editable={editableField === "lastName"}
        onChange={handleInputChange}
        validationError={errors?.lastName}
        aria-invalid={!!errors?.lastName}
        aria-describedby={errors?.lastName ? "lastName-error" : undefined}
      >
        <EditButton
          fieldName="lastName"
          setEditableField={setEditableField}
          disabled={isPending}
        />
      </InputField>

      <InputField
        htmlFor="email"
        name="email"
        label="Email"
        inputValue={initialData.email || ""}
        type="email"
        disabled={true}
      />

      <InputField
        htmlFor="userName"
        name="userName"
        label="Username"
        inputValue={initialData.userName || ""}
        type="text"
        disabled={true}
      />

      <InputField
        htmlFor="phoneNumber"
        name="phoneNumber"
        label="Phone"
        inputValue={phoneNumber}
        type="tel"
        editable={editableField === "phoneNumber"}
        onChange={handleInputChange}
        validationError={errors?.phoneNumber}
        aria-invalid={!!errors?.phoneNumber}
        aria-describedby={errors?.phoneNumber ? "phoneNumber-error" : undefined}
      >
        <EditButton
          fieldName="phoneNumber"
          setEditableField={setEditableField}
          disabled={isPending}
        />
      </InputField>

      <InputField
        htmlFor="country"
        name="country"
        label="Country"
        inputValue={country}
        editable={editableField === "country"}
        onChange={handleInputChange}
        validationError={errors?.country}
        aria-invalid={!!errors?.country}
        aria-describedby={errors?.country ? "country-error" : undefined}
      >
        <EditButton
          fieldName="country"
          setEditableField={setEditableField}
          disabled={isPending}
        />
      </InputField>

      <div className="md:col-span-2 flex justify-center px-2 pt-4 md:pt-0">
        {isPending ? (
          <Button
            disabled
            className="w-full md:w-[300px] py-3 rounded-xl bg-gray-400"
          >
            <Loader2 className="mr-2 animate-spin" size={20} />
            Updating Profile...
          </Button>
        ) : (
          <Button
            disabled={isDisabled || Object.values(errors).some(Boolean)}
            aria-disabled={isDisabled || Object.values(errors).some(Boolean)}
            className={`
              w-full md:w-[300px]
              py-3
              rounded-xl
              font-semibold text-lg
              tracking-wide
              ${
                isDisabled || Object.values(errors).some(Boolean)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300"
              }
              text-white dark:text-black
              transition-colors duration-200
              shadow-md hover:shadow-lg
            `}
          >
            Update Profile
          </Button>
        )}
      </div>

      {errors?.general && (
        <div className="md:col-span-2 text-center text-red-600 mt-2">
          {errors.general}
        </div>
      )}

      <Toaster position="bottom-right" expand={false} />
    </Form>
  );
};

export default AccountForm;