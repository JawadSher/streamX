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
import React from "react";
import { Button } from "../ui/button";

const AccountForm = () => {
  const countryNames = React.useMemo(
    () =>
      Object.values(popularCountries)
        .map((country) => country)
        .sort((a, b) => a.localeCompare(b)),
    []
  );

  const handleSubmit = async (e: FormData) => {
    console.log(e);
  };

  return (
    <Form
      action={handleSubmit}
      className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 max-w-[1100px] w-full h-full gap-4"
    >
      <InputField label="First Name" inputValue="Hello world" />
      <InputField label="Last Name" inputValue="Hello world" />
      <InputField label="Email" inputValue="johndoe@gmail.com" type="email" />
      <InputField label="Username" inputValue="devjawadsher" type="text" />
      <InputField label="Phone" inputValue="99999999999" type="number" />

      <div className="h-fit flex flex-col justify-center gap-2">
        <label className="text-lg font-medium">Country</label>
        <Select>
          <SelectTrigger className="w-full dark:text-zinc-300">
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

      <div className="md:col-span-2 flex justify-center">
        <Button className="dark:bg-green-400 font-bold text-1xl cursor-pointer hover:shadow-green-100 shadow-sm w-full md:w-md">
          Update Account
        </Button>
      </div>
    </Form>
  );
};

export default AccountForm;
