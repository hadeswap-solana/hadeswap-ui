import React from 'react';

const icon = (
  <path
    d="M26.7503 12.1352L13.2574 0.424457C13.1538 0.335171 13.0217 0.285172 12.8824 0.285172H9.7217C9.45742 0.285172 9.33599 0.613743 9.53599 0.785172L22.0431 11.6423H1.14313C0.985986 11.6423 0.857414 11.7709 0.857414 11.928V14.0709C0.857414 14.228 0.985986 14.3566 1.14313 14.3566H22.0396L9.53241 25.2137C9.33241 25.3887 9.45384 25.7137 9.71813 25.7137H12.986C13.0538 25.7137 13.1217 25.6887 13.1717 25.6423L26.7503 13.8637C26.8739 13.7562 26.973 13.6234 27.041 13.4743C27.1089 13.3252 27.1441 13.1633 27.1441 12.9995C27.1441 12.8356 27.1089 12.6737 27.041 12.5246C26.973 12.3755 26.8739 12.2427 26.7503 12.1352V12.1352Z"
    fill="black"
  />
);

const ArrowIcon = ({
  className,
  width,
  height,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className}
    width={width || '28'}
    height={height || '26'}
    viewBox="0 0 28 26"
    fill="none"
  >
    {icon}
  </svg>
);

export default ArrowIcon;