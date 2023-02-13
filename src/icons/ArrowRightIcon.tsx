import { FC } from 'react';

export const ArrowRightIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="33"
    height="32"
    viewBox="0 0 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 15.6667C4.5 16.403 5.09695 17 5.83333 17H23.9477L20.8905 20.0572C20.3698 20.5779 20.3698 21.4221 20.8905 21.9428C21.4112 22.4635 22.2554 22.4635 22.7761 21.9428L28.1095 16.6095C28.6302 16.0888 28.6302 15.2446 28.1095 14.7239L22.7761 9.39052C22.2554 8.86983 21.4112 8.86983 20.8905 9.39052C20.3698 9.91122 20.3698 10.7554 20.8905 11.2761L23.9477 14.3333H5.83333C5.09695 14.3333 4.5 14.9303 4.5 15.6667Z"
      fill="#E3E2E5"
    />
  </svg>
);
