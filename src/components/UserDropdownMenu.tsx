import { LogOutIcon, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User } from "better-auth";

export default function UserDropdownMenu({ name, email, image }: User) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="absolute top-8 right-14 flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-white/20">
          <div>
            <Avatar className="size-11">
              {image && <AvatarImage src={image} />}
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-0.5">
            <div className="text-sm">{name}</div>
            <div className="text-muted-foreground text-xs">{email}</div>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-50" align="center">
        <DropdownMenuItem>
          <SettingsIcon /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="!text-destructive">
          <LogOutIcon className="text-destructive" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
