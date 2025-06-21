import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import React from 'react';

interface PageNumberSelectorProps {
  usersPerPage: number;
  onValueChange: (value: string) => void;
}

export default function PageNumberSelector({
  usersPerPage,
  onValueChange,
}: PageNumberSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>{`${usersPerPage} par page`}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={String(usersPerPage)}
          onValueChange={onValueChange}
        >
          <DropdownMenuRadioItem value='5'>5</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='10'>10 (Défaut)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='20'>20</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='50'>50</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
