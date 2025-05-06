"use client";

import { useRef, useState } from "react";
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
import Form from "next/form";
import { CloudUpload, X } from "lucide-react";
import { Input } from "../ui/input";
import Image from "next/legacy/image";
import { Label } from "../ui/label";

const SelectBannerImage = ({ className }: { className?: string }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
      if (inputRef.current) inputRef.current.value = "";
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
    handleFileChange(file || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      handleClearImage();
    }
  };

  function handleSubmit() {
    console.log("hello world");
  }

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild className="cursor-pointer border-none">
          <Button variant="outline">Upload Banner Image</Button>
        </DialogTrigger>
        <DialogContent className="sm:w-full md:ml-35 dark:bg-[#18181B] border-none">
          <DialogHeader>
            <DialogTitle>Upload Banner Image</DialogTitle>
            <DialogDescription>
              Choose a banner image to personalize your channel.
            </DialogDescription>
          </DialogHeader>

          {selectedImage && (
            <div className="w-full h-[150px] relative rounded-2xl overflow-hidden mb-4">
              <X
                strokeWidth={1.7}
                size={16}
                className="absolute right-[5px] top-[5px] cursor-pointer dark:hover:bg-zinc-700 rounded-full z-10"
                onClick={handleClearImage}
              />
              <Image
                src={selectedImage}
                alt="bannerImage"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          <div
            className="flex flex-col items-center justify-center w-full border-1 border-dashed px-1 py-5 rounded-2xl cursor-pointer relative"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Label
              htmlFor="bannerImage"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            >
              <CloudUpload className="dark:text-zinc-300" strokeWidth={1.7} />
              <span className="dark:text-zinc-300">
                Drag and drop or click to select an image
              </span>
            </Label>
            <Input
              id="bannerImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
              ref={inputRef}
            />
            <span className="text-sm text-red-400">{error}</span>
          </div>

          <DialogFooter className="w-full">
            <Form
              action={handleSubmit}
              className="w-full flex items-center justify-center"
            >
              <Button
                type="submit"
                className="w-[70%] mx-auto border-none bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700"
                disabled={!selectedImage}
              >
                Update banner
              </Button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectBannerImage;
