import React from "react";
import { Lock, Copy as CopyIcon, AlertTriangle } from "lucide-react";

interface EmailTemplateProps {
  firstName: string;
  OTP: string;
  expiryTime: string | Date | number;
}

export const EmailTemplate = ({
  firstName,
  OTP,
  expiryTime,
}: EmailTemplateProps) => {
  const formatTime = (time: string | Date | number): string => {
    if (time instanceof Date || typeof time === "number") {
      return new Date(time).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    }
    return time as string;
  };
  const formattedExpiryTime = formatTime(expiryTime);

  return (
    <div
      className="font-roboto bg-gray-100 py-10 px-5 text-gray-800 leading-6 antialiased"
    >
      <div
        className="max-w-[600px] mx-auto bg-white rounded-lg shadow"
      >
        <div
          className="bg-blue-900 py-5 px-4 text-center rounded-t-lg"
        >
          <h1
            className="text-white text-2xl font-normal m-0 flex items-center justify-center"
          >
            <Lock size={24} className="mr-2" />
            StreamX
          </h1>
        </div>
        <div className="p-7">
          <p
            className="text-lg mb-5"
          >
            Dear{" "}
            <span className="text-blue-900 font-bold">
              {firstName}
            </span>,
          </p>
          <p
            className="text-base text-gray-800 mb-6"
          >
            Thank you for choosing StreamX. Please use the One-Time Password (OTP)
            below to complete your action.
          </p>
          <div
            className="text-center my-6"
          >
            <p
              className="text-sm text-blue-500 mb-3"
            >
              Your One-Time Password:
            </p>
            <div
              className="inline-flex items-center py-4 px-6 bg-gray-50 border border-gray-200 rounded"
            >
              <span
                className="text-3xl font-bold text-blue-900 tracking-[4px]"
              >
                {OTP}
              </span>
              <CopyIcon
                size={18}
                className="ml-3 text-blue-900 opacity-70"
              />
            </div>
          </div>
          <p
            className="text-base text-center my-6 py-3 bg-red-50 rounded"
          >
            This OTP expires on{" "}
            <span
              className="text-red-700 font-bold"
            >
              {formattedExpiryTime}
            </span>.
          </p>
          <div
            className="border-t border-gray-200 pt-6 mt-6"
          >
            <h3
              className="text-base font-normal text-gray-800 mb-3 flex items-center"
            >
              <AlertTriangle
                size={18}
                className="mr-2 text-red-700"
              />
              Security Notice
            </h3>
            <p
              className="text-sm text-blue-500 mb-3"
            >
              For your security, do not share this OTP with anyone. StreamX will
              never request your OTP or personal information via email or phone.
            </p>
            <p
              className="text-sm text-blue-500 m-0"
            >
              If you did not initiate this request, please contact our support
              team at{" "}
              <a
                href="mailto:support@streamx.com"
                className="text-blue-900 no-underline"
              >
                support@streamx.com
              </a>{" "}
              or update your account password immediately.
            </p>
          </div>
        </div>
        <div
          className="bg-gray-200 py-4 px-4 text-center rounded-b-lg text-xs text-blue-500"
        >
          <p className="mb-2">
            © {new Date().getFullYear()} StreamX. All rights reserved.
          </p>
          <p className="m-0">
            <a
              href="https://www.streamx.com"
              className="text-blue-900 no-underline"
            >
              streamx.com
            </a>{" "}
            |{" "}
            <a
              href="https://www.streamx.com/privacy"
              className="text-blue-900 no-underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};