"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import EditButton from "../edit-button";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { Toaster } from "../ui/sonner";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import InputField from "../input-field";
import { updateUser, useUser } from "@/store/features/user/userSlice";
import { useDispatch } from "react-redux";
import { useUserAccountUpdate } from "@/hooks/apollo";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../loading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFormState } from "react-dom";

const formSchema = userUpdateSchema.merge(phoneNumberSchema);
const AccountForm = () => {
  const user = useUser();
  const dispatchRedux = useDispatch();
  const [userAccountUpdate, { loading, data }] = useUserAccountUpdate();

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
    handleSubmit,
    formState: { errors, isDirty },
    clearErrors,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      userName: user?.userName || "",
      email: user?.email || "",
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
    console.log(formValues);
  }, [formValues])

  const toggleEditableField = (field: keyof typeof editableFields) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

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

  async function onSubmit(data: any) {
    clearErrors();

    console.log(data);

    // await userAccountUpdate({
    //   variables: {
    //     ...data,
    //   },
    // });
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
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <InputField
            label="First Name"
            editable={editableFields.firstName}
            className="w-full"
            validationError={errors?.firstName?.message}
            inputValue={formValues.firstName}
            {...register("firstName")}
            rightElement={
              <EditButton
                fieldName="firstName"
                setEditableField={toggleEditableField}
              />
            }
          />

          <InputField
            label="Last Name"
            editable={editableFields.lastName}
            className="w-full"
            validationError={errors?.lastName?.message}
            inputValue={formValues.lastName}
            {...register("lastName")}
            rightElement={
              <EditButton
                fieldName="lastName"
                setEditableField={toggleEditableField}
              />
            }
          />
          <InputField
            label="Username"
            editable={false}
            inputValue={formValues.userName}
            className="w-full rounded-md"
            disabled
          />

          <InputField
            label="Email"
            editable={false}
            className="w-full rounded-md"
            inputValue={formValues.email}
            disabled
            isVerified={Boolean(user?.isVerified)}
            isEmailField={true}
          />

          <InputField
            label="Phone Number"
            editable={editableFields.phoneNumber}
            className="w-full"
            validationError={errors?.phoneNumber?.message}
            inputValue={formValues.phoneNumber}
            type="tel"
            {...register("phoneNumber")}
            rightElement={
              <EditButton
                fieldName="phoneNumber"
                setEditableField={toggleEditableField}
              />
            }
          />
          <InputField
            label="Country"
            editable={editableFields.country}
            className="w-full"
            validationError={errors?.country?.message}
            inputValue={formValues.country}
            {...register("country")}
            rightElement={
              <EditButton
                fieldName="country"
                setEditableField={toggleEditableField}
              />
            }
          />

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
