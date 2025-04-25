import { actionError } from "./actions-templates/ActionError";
import { actionResponse } from "./actions-templates/ActionResponse";

export type ActionResponseType = ReturnType<typeof actionResponse>;
export type ActionErrorType = ReturnType<typeof actionError>;