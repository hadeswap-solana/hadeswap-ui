import React from "react";

const icon = (
  <path
    d="M15.9726 0.8573H14.4659C14.3635 0.8573 14.2671 0.907523 14.2068 0.989889L8.49942 8.85685L2.79205 0.989889C2.73178 0.907523 2.63535 0.8573 2.5329 0.8573H1.0262C0.895623 0.8573 0.819283 1.00596 0.895623 1.11243L7.9791 10.8778C8.23625 11.2314 8.76259 11.2314 9.01772 10.8778L16.1012 1.11243C16.1796 1.00596 16.1032 0.8573 15.9726 0.8573V0.8573Z"
    fill="#E3E2E5" />
);

const ChevronIcon = ({ className, width, height }: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className}
    width={width || '17'}
    height={height || '12'}
    viewBox="0 0 17 12"
    fill="none"
  >
    {icon}
  </svg>
);

export default ChevronIcon;