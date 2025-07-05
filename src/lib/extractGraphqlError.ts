export function extractGraphQLError(error: any) {
  const gqlError = error?.graphQLErrors?.[0].extensions

  return {
    message: gqlError?.message || "Unexpected error occurred",
    code: gqlError?.code || "UNKNOWN_ERROR",
    statusCode: gqlError?.statusCode || 500,
    data: gqlError?.data || null,
    success: gqlError.success
  };
}
