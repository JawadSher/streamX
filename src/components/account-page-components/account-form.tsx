"use client";

import { FormEvent, useEffect, useState } from "react";
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

const AccountForm = () => {
  const initialData = useUser();

  if (!initialData) {
    return (
      <div className="text-red-500 text-center">No user data available.</div>
    );
  }

  const [firstName, setFirstName] = useState<string>(
    initialData.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(initialData.lastName || "");
  const [userName] = useState<string>(initialData.userName || "");
  const [email] = useState<string>(initialData.email || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    initialData.phoneNumber || ""
  );
  const [country, setCountry] = useState<string>(initialData.country || "");
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
    {
      firstName: false,
      lastName: false,
      phoneNumber: false,
      country: false,
    }
  );
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    country: undefined,
  });
  const dispatch = useDispatch();

  const toggleEditableField = (fieldName: string) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  useEffect(() => {
    const isChanged =
      firstName !== (initialData.firstName || "") ||
      lastName !== (initialData.lastName || "") ||
      phoneNumber !== (initialData.phoneNumber || "") ||
      country !== (initialData.country || "");

    setIsBtnDisabled(isChanged);
  }, [firstName, lastName, phoneNumber, country, initialData]);

  const { mutate, isPending, isError, error, isSuccess, data } =
    useUserAccountUpdate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      phoneNumber,
      country,
    };

    const result = userUpdateSchema.safeParse(userData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        firstName: fieldErrors.firstName,
        lastName: fieldErrors.lastName,
        country: fieldErrors.country,
      }));
      toast.error("Please enter valid values in the fields.", {
        duration: 3000,
      });
      return;
    }

    if (phoneNumber.trim()) {
      const phoneResult = phoneNumberSchema.safeParse(phoneNumber);
      if (!phoneResult.success) {
        const phoneErrors = phoneResult.error.flatten().fieldErrors as {
          phoneNumber?: string[];
        };

        setErrors((prev) => ({
          ...prev,
          phoneNumber: phoneErrors.phoneNumber,
        }));

        return;
      }
    }

    setErrors({
      firstName: undefined,
      lastName: undefined,
      phoneNumber: undefined,
      country: undefined,
    });

    mutate({ firstName, lastName, phoneNumber, country });
  }

  useEffect(() => {
      const status = data?.data?.statusCode;
      const message = data?.data?.message || "An error occurred";

      switch (status) {
        case 200:
          console.log("--------- This case executed --------")
          console.log(firstName, lastName, phoneNumber, country);
          dispatch(
            updateUser({
              firstName,
              lastName,
              phoneNumber,
              country,
            })
          );
          setEditableFields({
            firstName: false,
            lastName: false,
            phoneNumber: false,
            country: false,
          });
          setIsBtnDisabled(false);
          break;
        case 400:
          toast.error(message || "Invalid request", { duration: 3000 });
          break;
        case 401:
          toast.error(message || "Unauthorized request", { duration: 3000 });
          break;
        case 503:
          toast.error(message || "Service unavailable", { duration: 3000 });
          break;
        case 500:
          toast.error(message || "Internal server error", { duration: 3000 });
          break;
    }
  }, [data, isError, error, isSuccess]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:border-1 md:rounded-2xl">
      <h1 className="text-4xl font-semibold mb-10 text-center">
        Account Information
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <InputField
          label="First Name"
          htmlFor="firstName"
          name="firstName"
          editable={editableFields.firstName}
          className="w-full"
          validationError={errors?.firstName?.[0]}
          inputValue={firstName}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, firstName: undefined }));
            setFirstName(e.target.value);
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
          editable={editableFields.lastName}
          className="w-full"
          validationError={errors?.lastName?.[0]}
          inputValue={lastName}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, lastName: undefined }));
            setLastName(e.target.value);
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
          inputValue={userName}
        />
        <InputField
          label="Email"
          htmlFor="email"
          name="email"
          editable={false}
          className="w-full"
          disabled
          inputValue={email}
          isVerified={Boolean(initialData?.isVerified)}
          userId={initialData?._id?.toString()}
        />
        <InputField
          label="Phone Number"
          htmlFor="phoneNumber"
          name="phoneNumber"
          editable={editableFields.phoneNumber}
          className="w-full"
          validationError={errors?.phoneNumber?.[0]}
          inputValue={phoneNumber}
          type="tel"
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
            setPhoneNumber(e.target.value);
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
          editable={editableFields.country}
          className="w-full"
          validationError={errors?.country?.[0]}
          inputValue={country}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, country: undefined }));
            setCountry(e.target.value);
          }}
          rightElement={
            <EditButton
              fieldName="country"
              setEditableField={toggleEditableField}
            />
          }
        />

        <div className="w-full lg:col-span-2 flex flex-col items-center mt-10">
          {isPending ? (
            <Loader2 className="animate-spin" size={34} />
          ) : (
            <Button
              type="submit"
              disabled={!isBtnDisabled}
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
