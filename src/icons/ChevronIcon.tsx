import React from 'react';

const path = (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M0.292893 0.792893C-0.0976311 1.18342 -0.0976311 1.81658 0.292893 2.20711L6.29289 8.20711C6.48043 8.39464 6.73478 8.5 7 8.5C7.26522 8.5 7.51957 8.39464 7.70711 8.20711L13.7071 2.20711C14.0976 1.81658 14.0976 1.18342 13.7071 0.792893C13.3166 0.402369 12.6834 0.402369 12.2929 0.792893L7 6.08579L1.70711 0.792893C1.31658 0.402369 0.683418 0.402369 0.292893 0.792893Z"
    fill="#E3E2E5"
  />
);

const ChevronIcon = ({
  className,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className}
    width="14"
    height="9"
    viewBox="0 0 14 9"
    fill="none"
  >
    {path}
  </svg>
);

export default ChevronIcon;
