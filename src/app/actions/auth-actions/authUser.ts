'use server'

export const authUser = async () => {
  const res = await fetch('/api/auth/check-session');
  
  if (res.status !== 200) {
    return false;
  }

  const data = await res.json();
  return data.user;
}