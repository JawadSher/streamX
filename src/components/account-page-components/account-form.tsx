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
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import EditButton from "../edit-button";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { revalidateUserData } from "@/app/actions/getUserData";
import useSWR from "swr";
import AccountPageSkeleton from "../skeletons/account-page-skeleton";

interface AccountFormProps {
  initialData: IRedisDBUser
}


const fetcher = async (): Promise<IRedisDBUser> => {
  const data = await revalidateUserData();
  if (!data) {
    throw new Error("Failed to fetch user data");
  }
  return data;
};

const AccountForm = ({ initialData }: AccountFormProps) => {
  const countryNames = React.useMemo(
    () =>
      Object.values(popularCountries)
        .map((country) => country)
        .sort((a, b) => a.localeCompare(b)),
    []
  );

  const { data: userData, error, isValidating, mutate } = useSWR<IRedisDBUser>(
    "user-data",
    fetcher,
    {
        fallbackData: initialData,
        revalidateOnFocus: false,
        refreshInterval: 60000,
    }
  )

  const [firstName, setFirstName] = useState<string>(initialData?.firstName || "");
  const [lastName, setLastName] = useState<string>(initialData?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(initialData?.phoneNumber || "");
  const [country, setCountry] = useState<string>(initialData?.country || "");

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhoneNumber(userData.phoneNumber || "Add phone number");
      setCountry(userData.country || "");
    }
  }, [userData]);

  const handleSubmit = async (formData: FormData) => {
    const updatedFirstName = formData.get("firstName") as string;
    const updatedLastName = formData.get("lastName") as string;
    const updatedPhoneNumber = formData.get("phoneNumber") as string;

    mutate(
      {
        ...userData!,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        phoneNumber: updatedPhoneNumber,
        country
      },
      false
    )

    
  };

  if (!userData) {
    return <AccountPageSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 text-center">Failed to load user data: {error.message}</div>;
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
        editable={true}
        onChange={(e) => setFirstName(e.target.value)} 
      >
        <EditButton />
      </InputField>

      <InputField
        htmlFor="lastName"
        name="lastName"
        label="Last Name"
        inputValue={lastName}
        editable={true}
        onChange={(e) => setLastName(e.target.value)}
      >
        <EditButton />
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
        editable={true}
        onChange={(e) => setPhoneNumber(e.target.value)}
      >
        <EditButton />
      </InputField>

      <div className="flex flex-col gap-2 w-full px-2 h-fit">
        <Label htmlFor="country" className="text-lg font-medium">
          Country
        </Label>
        <Select value={country} onValueChange={setCountry}>
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
        <Button
          disabled={false} 
          className="
            w-full md:w-[300px]
            py-3
            rounded-xl
            font-semibold text-lg
            tracking-wide
            bg-green-500
            text-white
            dark:bg-green-400 dark:text-black
            hover:bg-green-600 dark:hover:bg-green-300
            transition-colors duration-200
            shadow-md hover:shadow-lg
            cursor-pointer
          "
        >
          Update Account
        </Button>
      </div>
    </Form>
  );
};

export default AccountForm;