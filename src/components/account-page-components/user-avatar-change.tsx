"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import Form from "next/form";
import { uploadUserAssets } from "@/app/actions/user-assets-actions/uploadUserAssets.action";
import { ActionErrorType, ActionResponseType } from "@/lib/Types";
import { toast } from "sonner";
import AnimatedTick from "../animated-check";

function UserAvatarChange({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropping, setCropping] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
      setCropping(true);
      setError(null);
    } else {
      setError("Please select a valid image file");
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
    await setSelectedImage(null);
    await setCropping(false);
    await setCrop({ x: 0, y: 0 });
    await setZoom(1);
    await setCroppedAreaPixels(null);
    await setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.files = null;
    }
  };

  const handleApplyCrop = async () => {
    if (!selectedImage || !croppedAreaPixels) {
      setError("Cropping failed. Please try again.");
      return;
    }

    try {
      const croppedBlob: Blob = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );

      if (croppedBlob.size > MAX_FILE_SIZE) {
        setError("Cropped image is too large. Please crop a smaller area.");
        return;
      }

      const previewURL = URL.createObjectURL(croppedBlob);
      setSelectedImage(previewURL);
      setCropping(false);

      if (inputRef.current) {
        const croppedFile = new File(
          [croppedBlob],
          `cropped-avatar-${Date.now()}.jpg`,
          {
            type: croppedBlob.type || "image/jpeg",
          }
        );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedFile);
        inputRef.current.files = dataTransfer.files;
      }
    } catch (err: any) {
      if(err instanceof Error){
        setError("Failed to crop image");
      }
      setError("Failed to crop image");
      return;
    }
  };

  const handleDialogOpenChange = async (isOpen: boolean) => {
    if (!isOpen) {
      await handleClearImage();
    } else {
      await setSelectedImage(null);
    }
    await setOpen(isOpen);
  };

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleSubmit = async (
    state: ActionResponseType | ActionErrorType | null,
    formData: FormData
  ): Promise<ActionResponseType | ActionErrorType | null> => {
    const file = formData.get("file") as File;

    return await uploadUserAssets({
      userAsset: file,
      assetType: "avatar",
      assetMemeType: "image",
    });
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  useEffect(() => {
    if (state?.statusCode !== 200) {
      toast.error(state?.message);
    } else if (state?.statusCode === 200) {
      toast.success(state.message);
      setTimeout(async () => {
        await handleDialogOpenChange(false);
      }, 2000);
    }
  }, [state]);

  return (
    <div className={cn(className)}>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger
          asChild
          className="bg-gray-600 rounded-full p-[3px] hover:bg-gray-800"
        >
          <Camera
            className="cursor-pointer absolute right-1 bottom-5 transition"
            size={20}
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

          {selectedImage && cropping && (
            <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) =>
                  setCroppedAreaPixels(areaPixels)
                }
              />
            </div>
          )}
          {selectedImage && cropping && (
            <Slider
              min={1}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              className={cn("w-[100%] mt-4", className)}
            />
          )}

          {selectedImage && !cropping && (
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
                    src={selectedImage}
                    alt="avatar"
                    layout="fill"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          )}

          <Form action={formAction} className="w-full">
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
                {error && (
                  <span className="text-sm text-red-400 mt-2">{error}</span>
                )}
              </div>
            )}

            <DialogFooter className="mt-5">
              {selectedImage && cropping ? (
                <Button
                  type="button"
                  onClick={handleApplyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 mt-2 text-white font-medium rounded-full cursor-pointer"
                >
                  Apply Crop
                </Button>
              ) : state?.statusCode === 200 ? (
                <AnimatedTick />
              ) : isPending ? (
                <div className="w-full flex items-center justify-center">
                  <Loader2 className="animate-spin" size={25} />
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full border-none cursor-pointer"
                  disabled={!selectedImage}
                >
                  Update avatar
                </Button>
              )}
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserAvatarChange;
