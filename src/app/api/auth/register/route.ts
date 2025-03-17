import { connectDB } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, userName, channelName, email, password } =
      await request.json();

    const trimmedData = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      userName: userName?.trim(),
      channelName: channelName?.trim(),
      email: email?.trim(),
      password: password?.trim(),
    };

    const fields = Object.values(trimmedData);
    if (fields.some((field) => !field || field.length === 0)) {
      return NextResponse.json(new ApiError("All fields are required"), {
        status: 400,
      });
    }

    if (trimmedData.firstName.length < 2 || trimmedData.firstName.length > 50) {
      return NextResponse.json(
        new ApiError("First name must be between 2 and 50 characters long"),
        { status: 400 }
      );
    }
    if (trimmedData.lastName.length < 2 || trimmedData.lastName.length > 50) {
      return NextResponse.json(
        new ApiError("Last name must be between 2 and 50 characters long"),
        { status: 400 }
      );
    }
    if (trimmedData.userName.length < 2 || trimmedData.userName.length > 60) {
      return NextResponse.json(
        new ApiError("Username must be between 2 and 60 characters long"),
        { status: 400 }
      );
    }
    if (
      trimmedData.channelName.length < 2 ||
      trimmedData.channelName.length > 60
    ) {
      return NextResponse.json(
        new ApiError("Channel name must be between 2 and 60 characters long"),
        { status: 400 }
      );
    }
    if (trimmedData.email.length < 6 || trimmedData.email.length > 70) {
      return NextResponse.json(
        new ApiError("Email must be between 6 and 70 characters long"),
        { status: 400 }
      );
    }
    const emailRegex =
      /^[a-zA-Z0-9](?:[a-zA-Z0-9.]{0,}[a-zA-Z0-9])?(?:\+[a-zA-Z0-9]+)?@gmail\.com$/;
    if (!emailRegex.test(trimmedData.email)) {
      return NextResponse.json(
        new ApiError("Email must be a valid gmail address"),
        { status: 400 }
      );
    }
    if (trimmedData.password.length < 10 || trimmedData.password.length > 256) {
      return NextResponse.json(
        new ApiError("Password must be between 10 and 256 characters long"),
        { status: 400 }
      );
    }
    const passwdRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,256}$/;
    if (!passwdRegex.test(trimmedData.password)) {
      return NextResponse.json(
        new ApiError(
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        ),
        { status: 400 }
      );
    }

    await connectDB();

    const userExists = await User.findOne({
      $or: [{ email: trimmedData.email }, { userName: trimmedData.userName }],
    });
    if (userExists) {
      return NextResponse.json(new ApiError("User already exists"), {
        status: 400,
      });
    }

    const user = await User.create({
      firstName: trimmedData.firstName,
      lastName: trimmedData.lastName,
      userName: trimmedData.userName.toLowerCase(),
      channelName: trimmedData.channelName,
      email: trimmedData.email,
      password: trimmedData.password,
      phoneNumber: null,
      country: "None",
      isVerified: false,
      verificationCode: null,
      accountStatus: "active",
    });

    return NextResponse.json(
      new ApiResponse(201, "User created successfully", user.select("-password -verificationCode")),
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(new ApiError("Internal Server Error"), {
      status: 500,
    });
  }
}
