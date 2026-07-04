"use client";

import { profilePictureSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CameraIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import {
  useRef,
  useState,
  useCallback,
  useActionState,
  startTransition,
  useEffect,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import Cropper, { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedImg } from "@/lib/utils";
import { Slider } from "../ui/slider";
import { toast } from "sonner";
import { updateProfilePicture } from "@/actions/settings-actions";

export function ProfilePictureForm() {
  const form = useForm<z.infer<typeof profilePictureSchema>>({
    resolver: zodResolver(profilePictureSchema),
  });
  const session = authClient.useSession();
  const userName = session.data?.user.name;
  const userImage = session.data?.user.image;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, updateProfilePictureAction, isPending] = useActionState(
    updateProfilePicture,
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for cropping
  const [oldImageSrc, setOldImageSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Handle file selection
  // Specifically, convert the file to an image src
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]!;

        if (file.size > 2_000_000) {
          form.setError("image", {
            message: "The max file size limit is 2 MB.",
          });

          return;
        } else {
          form.clearErrors("image");
        }

        const reader = new FileReader();

        reader.addEventListener("load", () => {
          if (imageSrc) {
            setOldImageSrc(imageSrc);
          }

          setImageSrc(reader.result as string);
          setIsDialogOpen(true);
        });

        reader.readAsDataURL(file);
      }
    },
    [form, imageSrc],
  );

  // Handle crop completion
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  // Handle saving the cropped image
  const handleSaveCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );

      // Convert base64 to File object
      const file = await fetch(croppedImage)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new File([blob], "profile-picture.png", { type: "image/png" }),
        );

      // Update form value and preview
      form.setValue("image", file);

      const reader = new FileReader();

      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
      });

      reader.readAsDataURL(file);

      // Close dialog and reset states
      setIsDialogOpen(false);
      setImageSrc(null);
      setOldImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch {
      toast.error("Something went wrong! Please try again.");
    }
  }, [imageSrc, croppedAreaPixels, rotation, form]);

  function onSubmit(values: z.infer<typeof profilePictureSchema>) {
    startTransition(() => {
      updateProfilePictureAction(values);
    });
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      form.reset();
      window.location.reload();

      return;
    }

    if (state?.error) {
      toast.error(state.error);
    }
  }, [form, state]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ fieldState }) => (
            <FormItem>
              <div>
                <FormControl className="hidden">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </FormControl>

                {(imageSrc && !isDialogOpen) || oldImageSrc ? (
                  <>
                    <div>
                      <div>The old image:</div>

                      <div className="mt-2 flex gap-4">
                        <Avatar className="size-17">
                          <AvatarImage
                            className="object-cover"
                            src={userImage ?? undefined}
                            alt="Profile Picture"
                          />
                          <AvatarFallback>
                            {userName
                              ?.split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <FormLabel className="flex-col items-start justify-center">
                          <Button
                            type="button"
                            variant="secondary"
                            className={cn(
                              fieldState.error &&
                                "ring-destructive text-destructive ring",
                            )}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <CameraIcon />
                            Change picture
                          </Button>

                          <div className="text-muted-foreground text-xs">
                            JPG, JPEG, PNG, SVG, WEBP or GIF
                          </div>
                        </FormLabel>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div>The new image:</div>

                      <div className="mt-2 flex gap-4">
                        <Avatar className="size-17">
                          <AvatarImage
                            className="object-cover"
                            src={oldImageSrc ?? imageSrc ?? undefined}
                            alt="Profile Picture"
                          />
                          <AvatarFallback>
                            {userName
                              ?.split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Avatar className="size-17">
                      <AvatarImage
                        className="object-cover"
                        src={userImage ?? undefined}
                        alt="Profile Picture"
                      />
                      <AvatarFallback>
                        {userName
                          ?.split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <FormLabel className="flex-col items-start justify-center">
                      <Button
                        type="button"
                        variant="secondary"
                        className={cn(
                          fieldState.error &&
                            "ring-destructive text-destructive ring",
                        )}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <CameraIcon />
                        Change picture
                      </Button>

                      <div className="text-muted-foreground text-xs">
                        JPG, JPEG, PNG, SVG, WEBP or GIF
                      </div>
                    </FormLabel>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            // THIS FUNCTION WON'T EXECUTE WHEN CLICKING ON "SET NEW PROFILE PICTURE"
            if (!isOpen) {
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }

              setImageSrc(oldImageSrc);
              setOldImageSrc(null);
            }

            setIsDialogOpen(isOpen);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crop your new profile picture</DialogTitle>
            </DialogHeader>

            {/* Cropping Interface */}
            <div className="relative h-[400px] w-full rounded-md bg-gray-500 dark:bg-gray-100">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1} // Square aspect ratio
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  cropShape="round" // Circular crop
                  showGrid={false}
                  classes={{
                    containerClassName: "rounded-md absolute inset-0",
                    mediaClassName: "rounded-md",
                  }}
                />
              )}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Zoom</label>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => {
                  if (value?.[0]) {
                    setZoom(value[0]);
                  }
                }}
              />
            </div>

            {/* rotation Controls */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Rotation</label>
              <Slider
                value={[rotation]}
                min={1}
                max={361}
                step={0.1}
                onValueChange={(value) => {
                  if (value?.[0]) {
                    setRotation((value[0] - 1) % 361);
                  }
                }}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveCroppedImage}>
                Set new profile picture
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          disabled={!imageSrc || isDialogOpen || isPending}
          className="mt-2"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
}
