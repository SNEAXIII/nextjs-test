import { TooltipContent } from '@/components/ui/tooltip';

interface UserActionTooltipProps {
  isDeleted: boolean;
}

export function UserActionTooltip({ isDeleted }: UserActionTooltipProps) {
  if (!isDeleted) return null;

  return (
    <TooltipContent>
      <p>Cet utilisateur est supprimé</p>
    </TooltipContent>
  );
}
