import React from 'react';
import clsx from 'clsx';

export default function Title({title, mobileOrTablet}) {
  return (
    <p
      className={clsx(
        'font-bold',
        mobileOrTablet('text-[22px]', 'text-sm'),
        'tablet:text-[22px]',
      )}
    >
      {title}
    </p>
  );
}
