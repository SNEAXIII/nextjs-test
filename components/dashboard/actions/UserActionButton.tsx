import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface UserActionButtonProps {
  isDeleted: boolean;
}

export function UserActionButton({ isDeleted }: UserActionButtonProps) {
  return (
    <Button
      variant="ghost"
      className="h-8 w-8 p-0"
      disabled={isDeleted}
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );
}
