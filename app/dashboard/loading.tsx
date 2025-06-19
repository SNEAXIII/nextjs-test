import React from 'react';

export default function Loading() {
  return (
    <tr className='animate-pulse'>
      {[...Array(6)].map((_, index) => (
        <td
          key={index}
          className='p-4'
        >
          <div className='h-4 bg-gray-300 rounded'></div>
        </td>
      ))}
      <td className='p-4'>
        <div className='h-8 w-8 bg-gray-300 rounded'></div>
      </td>
    </tr>
  );
}
