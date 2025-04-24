"use client";

import Form from "next/form";
import InputField from "./input-field";
import { Button } from "../ui/button";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { useActionState, useEffect, useState } from "react";
import EditButton from "../edit-button";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { Loader2 } from "lucide-react";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import { Preahvihear } from "next/font/google";

interface Props {
  initialData: IRedisDBUser;
}

const AccountForm = ({ initialData }: Props) => {
  const [firstName, setFirstName] = useState<string>(
    initialData.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(initialData.lastName || "");
  const [userName, setUserName] = useState<string>(initialData.userName || "");
  const [email, setEmail] = useState<string>(initialData.email || "");
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

  async function handleSubmit(
    state: AxiosResponse<any, any> | null,
    formData: FormData
  ): Promise<AxiosResponse<any, any> | null> {
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phoneNumber: formData.get("phoneNumber"),
      country: formData.get("country"),
    };

    const result = userUpdateSchema.safeParse(userData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        firstName: fieldErrors.firstName,
        lastName: fieldErrors?.lastName,
        country: fieldErrors?.country,
      });
      toast.error("Please put the correct values in to fields.");
      return null;
    }
    
    if (phoneNumber.trim().length > 0) {
      const result = phoneNumberSchema.safeParse(phoneNumber);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors as Partial<Record<keyof typeof userData, string[]>>;
        setErrors((prev) => ({
          ...prev,
          phoneNumber: fieldErrors.phoneNumber,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: undefined,
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: undefined,
      }));
    }

    setErrors({
      firstName: undefined,
      lastName: undefined,
      phoneNumber: undefined,
      country: undefined,
    });

    const response = await axiosInstance.put(API_ROUTES.USER_UPDATE, {
      firstName,
      lastName,
      phoneNumber,
      country,
    });
    return response;
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  useEffect(() => {
    if(state?.status === 200 || state?.data.statusCode === 200){
      setEditableFields({
        firstName: false,
        lastName: false,
        phoneNumber: false,
        country: false
      })
      setIsBtnDisabled(false);
      toast.success("Account information updated");
    }

    if(state?.status === 400 || state?.data.statusCode === 400){
      toast.error(state.data.message || "Something went wrong while updating user data. Try again")
    }

    if(state?.status === 401 || state?.data.statusCode === 401){
      toast.error(state.data.message || "Unauthorized Request")
    }
  }, [state])

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-22 text-center ">
        Account Information
      </h1>

      <Form
        action={formAction}
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
          onChange={(e) => (
            setErrors({
              firstName: undefined,
            }),
            setFirstName(e.target.value.toString())
          )}
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
          inputValue={lastName}
          validationError={errors.lastName?.[0]}
          onChange={(e) => (
            setErrors({
              lastName: undefined,
            }),
            setLastName(e.target.value.toString())
          )}
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
          disabled={true}
          inputValue={userName}
        />
        <InputField
          label="Email"
          htmlFor="email"
          name="email"
          editable={false}
          className="w-full"
          disabled={true}
          inputValue={email}
        />
        <InputField
          label="Phone Number"
          htmlFor="phoneNumber"
          name="phoneNumber"
          editable={editableFields.phoneNumber}
          validationError={errors.phoneNumber?.[0]}
          className="w-full"
          type="tel"
          inputValue={phoneNumber}
          onChange={(e) => (
            setErrors({
              phoneNumber: undefined,
            }),
            setPhoneNumber(e.target.value.toString())
          )}
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
          inputValue={country}
          validationError={errors.country?.[0]}
          onChange={(e) => (
            setErrors({
              country: undefined,
            }),
            setCountry(e.target.value.toString())
          )}
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
              aria-disabled={!isBtnDisabled}
              className="w-full max-w-xs cursor-pointer dark:bg-blue-300 dark:hover:bg-blue-400 text-md font-semibold"
            >
              Update Account
            </Button>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Only editable fields can be updated
          </p>
        </div>
      </Form>
      <Toaster position="bottom-right" expand={false} />
    </div>
  );
};

export default AccountForm;
