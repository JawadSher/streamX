export async function generateOTP(): Promise<{ OTP: string; expiryTime: string }> {
  const now = new Date();
  const future = new Date(now.getTime() + 3 * 60 * 1000);

  const expiryTime = future.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    expiryTime,
    OTP,
  };
}
