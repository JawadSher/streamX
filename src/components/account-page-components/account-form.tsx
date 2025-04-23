"use client";

import Form from "next/form";
import InputField from "./input-field";
import { popularCountries } from "./countries-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import EditButton from "../edit-button";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { revalidateUserData } from "@/app/actions/getUserData";
import useSWR from "swr";
import AccountPageSkeleton from "../skeletons/account-page-skeleton";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";

interface AccountFormProps {
  initialData: IRedisDBUser;
}

const AccountForm = ({ initialData }: AccountFormProps) => {
  const fetcher = async (): Promise<IRedisDBUser> => {
    const data = await revalidateUserData();
    if (!data) {
      throw new Error("Failed to fetch user data");
    }
    return data;
  };

  const countryNames = React.useMemo(
    () =>
      Object.values(popularCountries)
        .map((country) => country)
        .sort((a, b) => a.localeCompare(b)),
    []
  );

  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IRedisDBUser>("user-data", fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
    refreshInterval: 60000,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(
    initialData?.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(initialData?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    initialData?.phoneNumber || ""
  );
  const [country, setCountry] = useState<string>(initialData?.country || "");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [editableField, setEditableField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    country?: string;
  } | null>(null);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhoneNumber(userData.phoneNumber || "");
      setCountry(userData.country || "");
      setErrors(null);
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

  const validateForm = useCallback(
    debounce(
      (formData: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        country: string;
      }) => {
        const result = userUpdateSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          setErrors({
            firstName: fieldErrors.firstName?.[0],
            lastName: fieldErrors.lastName?.[0],
            phoneNumber: fieldErrors.phoneNumber?.[0],
            country: fieldErrors.country?.[0],
          });
        } else {
          setErrors(null);
        }
      },
      300
    ),
    []
  );

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
    }
  
    type FieldName = keyof typeof userUpdateSchema.shape;
    const fieldValidation = userUpdateSchema.shape[name as FieldName];
    const result = fieldValidation.safeParse(value);
  
    setErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error?.issues?.[0]?.message,
    }));
  };
  

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
  
    const updatedData: Partial<IRedisDBUser> = {};
    const updatedFirstName = formData.get("firstName") as string;
    const updatedLastName = formData.get("lastName") as string;
    const updatedPhoneNumber = formData.get("phoneNumber") as string;
  
    if (updatedFirstName !== initialData.firstName) {
      updatedData.firstName = updatedFirstName;
    }
    if (updatedLastName !== initialData.lastName) {
      updatedData.lastName = updatedLastName;
    }
    if (updatedPhoneNumber !== initialData.phoneNumber) {
      updatedData.phoneNumber = updatedPhoneNumber;
    }
    if (country !== initialData.country) {
      updatedData.country = country;
    }
  
    const result = userUpdateSchema.safeParse({
      firstName: updatedData.firstName ?? initialData.firstName,
      lastName: updatedData.lastName ?? initialData.lastName,
      phoneNumber: updatedData.phoneNumber ?? initialData.phoneNumber,
      country: updatedData.country ?? initialData.country,
    });
  
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        phoneNumber: fieldErrors.phoneNumber?.[0],
        country: fieldErrors.country?.[0],
      });
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await axiosInstance.put(API_ROUTES.USER_UPDATE, updatedData);
      if (response.status === 200) {
        toast.success("Account updated successfully");
        mutate(); // Re-fetch data
      } else {
        toast.error(response.data.message || "Failed to update account.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update account. -----");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) {
    return <AccountPageSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to load user data: {error.message}
      </div>
    );
  }

  return (
    <Form
      action={handleSubmit}
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
        <EditButton fieldName="firstName" setEditableField={setEditableField} />
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
        <EditButton fieldName="lastName" setEditableField={setEditableField} />
      </InputField>

      <InputField
        htmlFor="email"
        name="email"
        label="Email"
        inputValue={initialData.email || ""}
        type="email"
      />

      <InputField
        htmlFor="userName"
        name="userName"
        label="Username"
        inputValue={initialData.userName || ""}
        type="text"
      />

      <InputField
        htmlFor="phoneNumber"
        name="phoneNumber"
        label="Phone"
        inputValue={phoneNumber}
        type="string"
        editable={editableField === "phoneNumber"}
        onChange={handleInputChange}
        validationError={errors?.phoneNumber}
        aria-invalid={!!errors?.phoneNumber}
        aria-describedby={errors?.phoneNumber ? "phoneNumber-error" : undefined}
      >
        <EditButton
          fieldName="phoneNumber"
          setEditableField={setEditableField}
        />
      </InputField>

      <div className="flex flex-col gap-2 w-full px-2 h-fit">
        <div className="flex gap-3 items-center">
          <Label htmlFor="country" className="text-lg font-medium">
            Country
          </Label>
          {errors?.country && <p className="text-red-600">{errors.country}</p>}
        </div>
        <Select
          value={country}
          onValueChange={(value) => {
            setCountry(value);
            const result = userUpdateSchema.shape.country.safeParse(value);
            setErrors((prev) => ({
              ...prev,
              country: result.success ? undefined : result.error?.issues?.[0]?.message,
            }));
          }}
          
        >
          <SelectTrigger className="w-full dark:text-zinc-300 h-10 font-semibold">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {countryNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 flex justify-center px-2 pt-4 md:pt-0">
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={34} />
        ) : (
          <Button
            disabled={isDisabled || isSubmitting}
            aria-disabled={isDisabled || isSubmitting}
            className={`
              w-full md:w-[300px]
              py-3
              rounded-xl
              font-semibold text-lg
              tracking-wide
              ${
                isDisabled || isSubmitting
                  ? "bg-gray-400 hover:cursor-none"
                  : "bg-green-500 hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300"
              }
              text-white dark:text-black
              transition-colors duration-200
              shadow-md hover:shadow-lg
              hover:cursor-pointer
            `}
          >
            Update Account
          </Button>
        )}
      </div>
      <Toaster position="bottom-right" expand={false} />
    </Form>
  );
};

export default AccountForm;