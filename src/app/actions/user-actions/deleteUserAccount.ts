"use server";

import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import notifyKakfa from "@/lib/notifyKafka";
import { authSignOut } from "../auth-actions/authSignOut.action";

export async function deleteUserAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    return actionError(400, "Unauthorized request", null);
  }

  const userId = session.user._id;
  try {
    await notifyKakfa({ userData: userId, action: "user-account-deletion" });
    const redirection = await authSignOut();

    return actionResponse(
      200,
      "Your account will be deletion in couple of seconds",
      redirection
    );
  } catch (error: any) {
    if (error instanceof Error) {
      return actionError(
        400,
        error.message || "Something went wrong while deleting account",
        null
      );
    }
  }
}
