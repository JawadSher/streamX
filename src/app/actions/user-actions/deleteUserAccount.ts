"use server";

import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import notifyKakfa from "@/lib/notifyKafka";
import { authSignOut } from "../auth-actions/authSignOut.action";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { ROUTES } from "@/constants/ApiRoutes";
import { redirect } from "next/navigation";

export async function deleteUserAccount() {
  const session = await auth();
  if (!session?.user?._id) {
    return actionError(400, "Unauthorized request", null);
  }

  const userId = session.user._id;
  try {
    await notifyKakfa({ userData: userId, action: "user-account-deletion" });
    
    const response: ActionResponseType | ActionErrorType = await authSignOut();
    if (response.statusCode === 401 || response.statusCode === 400) {
      return actionError(400, "Logout Unsuccessfull", null);
    }

    return actionResponse(
      200,
      "Your account will be deletion in couple of seconds",
      null
    );
  } catch (error: any) {
    if (error instanceof Error) {
      return actionError(
        400,
        error.message || "Something went wrong while deleting account",
        null
      );
    }
  } finally {
    redirect(ROUTES.PAGES_ROUTES.SIGN_IN);
  }
}
