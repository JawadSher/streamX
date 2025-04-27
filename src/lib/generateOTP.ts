export function generateOTP(): { OTP: string; expiryTime: string } {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 2);
  const expiryTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    expiryTime,
    OTP,
  };
}
