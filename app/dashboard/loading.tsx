import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import TableHeaderUsers from '@/app/ui/dashboard/table-header';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingProps {
  usersPerPage: number;
}

export default function Loading({ usersPerPage }: LoadingProps) {
  return (
    <div className='container mx-auto py-6'>
      <Table>
        <TableHeaderUsers />
        <TableBody>
          {Array.from({ length: usersPerPage }, (_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 6 }, (_, key) => (
                <TableCell key={key}>
                  <div className='h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full animate-pulse'></div>
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant='ghost'
                  className='h-8 w-8 p-0'
                  disabled={true}
                >
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
