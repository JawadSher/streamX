import {
  userAccountPasswdUpdate,
  userAssetsUpdate,
} from "@/services/userServices";
import {  updateUser } from "@/store/features/user/userSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


export const useUserAssetsUpdate = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ["userAssetsUpdate"],
    mutationFn: userAssetsUpdate,
    onSuccess: (data) => {
      dispatch(
        updateUser({
          avatarURL: data.data.data.avatar,
        })
      );
      toast.success(data.data.message, {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};

export const useUserAccountPasswdUpdate = () => {
  return useMutation({
    mutationKey: ["userAccountPasswdUpdate"],
    mutationFn: userAccountPasswdUpdate,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message, {
        duration: 3000,
      });
    },
  });
};
