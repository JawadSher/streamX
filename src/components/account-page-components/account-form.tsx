"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import EditButton from "../edit-button";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { Toaster } from "../ui/sonner";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import { updateUser, useUser } from "@/store/features/user/userSlice";
import { useDispatch } from "react-redux";
import { useUserAccountUpdate } from "@/hooks/apollo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../loading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import * as RPNInput from "react-phone-number-input";
import FormLabel from "./form-labels";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "../phone-number-input-field";
import { CountryDropdown } from "../country-dropdown-list";

const formSchema = userUpdateSchema.merge(phoneNumberSchema);

const AccountForm = () => {
  const user = useUser();
  const dispatchRedux = useDispatch();
  const [userAccountUpdate, { loading, data }] = useUserAccountUpdate();

  console.log(user);

  const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
    {
      firstName: false,
      lastName: false,
      phoneNumber: false,
      country: false,
    }
  );

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    clearErrors,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      country: user?.country || "",
    },
  });

  const formValues = watch();
  const isFormChanged =
    formValues.firstName !== user?.firstName ||
    formValues.lastName !== user?.lastName ||
    formValues.phoneNumber !== user?.phoneNumber ||
    formValues.country !== user?.country;

  const isDisabled = !isFormChanged || !isDirty || loading;

  useEffect(() => {
    if (!data) return;

    const status = data?.userAccountUpdate?.statusCode;
    const success = data?.userAccountUpdate?.success;
    if (status === 200 || success === true) {
      dispatchRedux(
        updateUser({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          phoneNumber: formValues.phoneNumber,
          country: formValues.country,
        })
      );
      setEditableFields({
        firstName: false,
        lastName: false,
        phoneNumber: false,
        country: false,
      });
    }
  }, [data]);

  const toggleEditableField = (field: keyof typeof editableFields) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  async function onSubmit(data: any) {
    clearErrors();

    console.log(data);

    await userAccountUpdate({
      variables: {
        ...data,
      },
    });
  }

  if (!user) {
    return (
      <div className="text-red-500 text-center">No user data available.</div>
    );
  }

  return (
    <Card className="w-[95%] md:w-[80%] gap-15">
      <CardHeader>
        <CardTitle className="text-2xl md:text-4xl mx-auto">
          Update Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <div className="space-y-2">
            <FormLabel
              label="First Name"
              htmlFor="firstName"
              error={errors.firstName}
            />
            <div className="flex rounded-md shadow-xs relative">
              <Input
                id="firstName"
                type="text"
                disabled={!editableFields.firstName}
                className="rounded-e-none font-semibold dark:text-zinc-300 w-full"
                {...register("firstName")}
              />
              <span className="border-input text-muted-foreground inline-flex items-center rounded-e-md border px-3 text-sm">
                <EditButton
                  fieldName="firstName"
                  setEditableField={toggleEditableField}
                />
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel
              label="Last Name"
              htmlFor="lastName"
              error={errors.lastName}
            />
            <div className="flex rounded-md shadow-xs relative">
              <Input
                id="lastName"
                type="text"
                disabled={!editableFields.lastName}
                className="rounded-e-none font-semibold dark:text-zinc-300 w-full"
                {...register("lastName")}
              />
              <span className="border-input text-muted-foreground inline-flex items-center rounded-e-md border px-3 text-sm">
                <EditButton
                  fieldName="lastName"
                  setEditableField={toggleEditableField}
                />
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel label="Username" htmlFor="userName" />
            <Input
              id="userName"
              type="text"
              value={user.userName?.toString()}
              disabled
              className="w-full font-semibold dark:text-zinc-300"
            />
          </div>

          <div className="space-y-2">
            <FormLabel label="Email" htmlFor="email" />
            <Input
              id="email"
              type="email"
              value={user.email?.toString()}
              disabled
              className="w-full font-semibold dark:text-zinc-300"
            />
          </div>

          <div className="space-y-2">
            <FormLabel
              label="Phone Number"
              error={errors.phoneNumber?.message}
              htmlFor="phoneNumber"
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <div className="flex rounded-md shadow-xs relative">
                  <RPNInput.default
                    international
                    defaultCountry="PK"
                    id="phoneNumber"
                    disabled={!editableFields.phoneNumber}
                    flagComponent={FlagComponent}
                    countrySelectComponent={CountrySelect}
                    inputComponent={PhoneInput}
                    {...field}
                    className="flex w-full border rounded-e-none rounded-l-xl"
                  />
                  <span className="border-input text-muted-foreground inline-flex items-center rounded-e-md border px-3 text-sm">
                    <EditButton
                      fieldName="phoneNumber"
                      setEditableField={toggleEditableField}
                    />
                  </span>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel
              label="Country"
              htmlFor="country"
              error={errors.country?.message}
            />
            <div className="flex rounded-md shadow-xs relative">
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <CountryDropdown
                    defaultValue={field.value ?? "USA"}
                    onChange={(selectedCountry) =>
                      field.onChange(selectedCountry.alpha3)
                    }
                    disabled={!editableFields.country}
                  />
                )}
              />
              <span className="border-input text-muted-foreground inline-flex items-center rounded-e-md border px-3 text-sm">
                <EditButton
                  fieldName="country"
                  setEditableField={toggleEditableField}
                />
              </span>
            </div>
          </div>

          <div className="w-full lg:col-span-2 flex flex-col items-center mt-10">
            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full max-w-xs cursor-pointer text-md font-semibold"
            >
              {loading ? <Loading /> : "Update Account"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Only editable fields can be updated
            </p>
          </div>
        </form>
      </CardContent>
      <Toaster position="bottom-right" expand={false} />
    </Card>
  );
};

export default AccountForm;
