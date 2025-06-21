import React from 'react';
import { Button } from '@/components/ui/button';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { LuChevronFirst, LuChevronLast } from 'react-icons/lu';

interface PaginationControlsProps {
  currentPage: number;
  totalPage: number;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
}

export default function PaginationControls({
  currentPage,
  totalPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}: PaginationControlsProps) {
  return (
    <div className='flex items-center flex-wrap gap-1 sm:gap-3'>
      <Button
        onClick={onFirstPage}
        disabled={currentPage === 1}
        variant='outline'
      >
        <LuChevronFirst />
      </Button>
      <Button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        variant='outline'
      >
        <IoChevronBackOutline />
      </Button>
      <p className='flex items-center justify-center text-center w-28 text-sm sm:text-base'>
        Page {currentPage}/{totalPage}
      </p>
      <Button
        onClick={onNextPage}
        disabled={currentPage === totalPage}
        variant='outline'
      >
        <IoChevronForwardOutline />
      </Button>
      <Button
        onClick={onLastPage}
        disabled={currentPage === totalPage}
        variant='outline'
      >
        <LuChevronLast />
      </Button>
    </div>
  );
}
