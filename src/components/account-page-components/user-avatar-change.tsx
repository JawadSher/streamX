"use client";

import { useEffect, useReducer, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, CloudUpload, Loader2, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import AnimatedTick from "../animated-check";
import { useUserAssetsUpdate } from "@/hooks/useQuery/use-user-assets-mutation";

type State = {
  selectedImage: string | null;
  error: Record<string, string[] | undefined>;
  crop: {
    x: number;
    y: number;
  };
  zoom: number;
  croppedAreaPixels: any;
  cropping: boolean;
  open: boolean;
  croppedFile: File | null;
};

type Action =
  | { type: "SET_STATE"; state: keyof State; value: any }
  | { type: "SET_MULTI_STATE"; payload: Partial<State> }
  | { type: "SET_ERROR"; error: Partial<State["error"]> }
  | { type: "RESET_ERROR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STATE":
      return {
        ...state,
        [action.state]: action.value,
      };
    case "SET_MULTI_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: {
          ...state.error,
          ...action.error,
        },
      };
    case "RESET_ERROR":
      return {
        ...state,
        error: {},
      };
    default:
      return state;
  }
}

const initialState = {
  selectedImage: null,
  error: {},
  crop: {
    x: 0,
    y: 0,
  },
  zoom: 1,
  croppedAreaPixels: null,
  cropping: false,
  open: false,
  croppedFile: null,
};

function UserAvatarChange({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const imageURL = URL.createObjectURL(file);

      dispatch({
        type: "SET_MULTI_STATE",
        payload: {
          selectedImage: imageURL,
          cropping: true,
          error: {},
        },
      });
    } else {
      dispatch({
        type: "SET_ERROR",
        error: {
          error: ["Please select a valid image file"],
        },
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileChange(file || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClearImage = async () => {
    await dispatch({
      type: "SET_MULTI_STATE",
      payload: {
        selectedImage: null,
        cropping: false,
        crop: {
          x: 0,
          y: 0,
        },
        zoom: 1,
        croppedAreaPixels: null,
        error: {},
      },
    });
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.files = null;
    }
  };

  const handleApplyCrop = async () => {
    if (!state.selectedImage || !state.croppedAreaPixels) {
      dispatch({
        type: "SET_ERROR",
        error: {
          error: ["Cropping failed. Please try again."],
        },
      });

      return;
    }

    try {
      const croppedBlob: Blob = await getCroppedImg(
        state.selectedImage,
        state.croppedAreaPixels
      );

      if (croppedBlob.size > MAX_FILE_SIZE) {
        dispatch({
          type: "SET_ERROR",
          error: {
            error: ["Cropped image is too large. Please crop a smaller area."],
          },
        });

        return;
      }

      const previewURL = URL.createObjectURL(croppedBlob);
      dispatch({
        type: "SET_MULTI_STATE",
        payload: {
          selectedImage: previewURL,
          cropping: false,
        },
      });

      const file = new File([croppedBlob], `cropped-avatar-${Date.now()}.jpg`, {
        type: croppedBlob.type || "image/jpeg",
      });

      dispatch({
        type: "SET_STATE",
        state: "croppedFile",
        value: file,
      });
    } catch (_) {
      dispatch({
        type: "SET_ERROR",
        error: {
          error: ["Failed to crop image"],
        },
      });
    }
  };

  const handleDialogOpenChange = async (isOpen: boolean) => {
    if (!isOpen) {
      await handleClearImage();
    } else {
      await dispatch({
        type: "SET_STATE",
        state: "selectedImage",
        value: null,
      });
    }
    await dispatch({
      type: "SET_STATE",
      state: "open",
      value: isOpen,
    });
  };

  const handleCropChange = (crop: { x: number; y: number }) =>
    dispatch({ type: "SET_STATE", state: "crop", value: crop });

  const handleZoomChange = (zoom: number) =>
    dispatch({ type: "SET_STATE", state: "zoom", value: zoom });

  const handleCropComplete = (_: any, areaPixels: any) =>
    dispatch({
      type: "SET_STATE",
      state: "croppedAreaPixels",
      value: areaPixels,
    });

  useEffect(() => {
    return () => {
      if (state.selectedImage) {
        URL.revokeObjectURL(state.selectedImage);
      }
    };
  }, [state.selectedImage]);

  const { mutate, status, isPending } = useUserAssetsUpdate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!state.croppedFile) {
      dispatch({
        type: "SET_ERROR",
        error: {
          error: ["No file selected."],
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append("userAsset", state.croppedFile);
    formData.append("assetType", "avatar");
    formData.append("assetMemeType", "image");

    mutate(formData);
  }

  useEffect(() => {
    if (status === "success") {
      setTimeout(async () => {
        await handleDialogOpenChange(false);
      }, 2000);
    }
  }, [status]);

  return (
    <div className={cn(className)}>
      <Dialog open={state.open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger
          asChild
          className="bg-gray-600 rounded-full p-[3px] hover:bg-gray-800"
        >
          <Camera
            className="cursor-pointer absolute right-1 bottom-5 transition"
            size={20}
            color="white"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px] rounded-2xl dark:bg-[#18181B] border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Change Avatar
            </DialogTitle>
            <DialogDescription>
              Choose and upload a new profile picture to update your avatar.
            </DialogDescription>
          </DialogHeader>

          {state.selectedImage && state.cropping && (
            <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
              <Cropper
                image={state.selectedImage}
                crop={state.crop}
                zoom={state.zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={handleCropChange}
                onZoomChange={handleZoomChange}
                onCropComplete={handleCropComplete}
              />
            </div>
          )}
          {state.selectedImage && state.cropping && (
            <Slider
              min={1}
              step={0.1}
              value={[state.zoom]}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_STATE",
                  state: "zoom",
                  value: value[0],
                })
              }
              className={cn("w-[100%] mt-4", className)}
            />
          )}

          {state.selectedImage && !state.cropping && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <X
                  strokeWidth={1.7}
                  size={18}
                  className="absolute right-4 top-2 cursor-pointer dark:hover:bg-zinc-700 bg-white/80 dark:bg-black p-1 rounded-full z-10"
                  onClick={handleClearImage}
                />
                <div className="w-[150px] h-[150px] relative rounded-full overflow-hidden mb-4 border mx-auto">
                  <Image
                    src={state.selectedImage}
                    alt="avatar"
                    layout="fill"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            {!isPending && (
              <div
                className="flex flex-col items-center justify-center w-full border border-dashed px-1 py-5 rounded-2xl cursor-pointer relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Label
                  htmlFor="avatarImage"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <CloudUpload
                    className="dark:text-zinc-300"
                    strokeWidth={1.7}
                  />
                  <span className="dark:text-zinc-300 text-sm text-center">
                    Drag and drop or click to select an image
                  </span>
                </Label>
                <Input
                  id="avatarImage"
                  type="file"
                  name="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                  ref={inputRef}
                />
                {state.error && (
                  <span className="text-sm text-red-400 mt-2">
                    {state.error.error}
                  </span>
                )}
              </div>
            )}

            <DialogFooter className="mt-5">
              {state.selectedImage && state.cropping ? (
                <Button
                  type="button"
                  onClick={handleApplyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 mt-2 text-white font-medium rounded-full cursor-pointer"
                >
                  Apply Crop
                </Button>
              ) : status === "success" ? (
                <AnimatedTick />
              ) : isPending ? (
                <div className="w-full flex items-center justify-center">
                  <Loader2 className="animate-spin" size={25} />
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full border-none cursor-pointer"
                  disabled={!state.selectedImage}
                >
                  Update avatar
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserAvatarChange;
