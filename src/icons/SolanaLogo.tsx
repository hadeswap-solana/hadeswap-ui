const Icon = (
  <>
    <g clipPath="url(#clip0_362_16466)">
      <path
        d="M7.02657 15.6848C7.12044 15.577 7.24952 15.5142 7.38641 15.5142H19.8012C20.028 15.5142 20.1414 15.8286 19.9811 16.0127L17.5286 18.8289C17.4348 18.9367 17.3057 18.9996 17.1688 18.9996H4.75405C4.52719 18.9996 4.41376 18.6852 4.57413 18.501L7.02657 15.6848Z"
        fill="url(#paint0_linear_362_16466)"
      />
      <path
        d="M7.02657 5.17019C7.12435 5.06239 7.25343 4.99951 7.38641 4.99951H19.8012C20.028 4.99951 20.1414 5.31392 19.9811 5.49807L17.5286 8.31424C17.4348 8.42203 17.3057 8.48491 17.1688 8.48491H4.75405C4.52719 8.48491 4.41376 8.17051 4.57413 7.98636L7.02657 5.17019Z"
        fill="url(#paint1_linear_362_16466)"
      />
      <path
        d="M17.5286 10.3938C17.4348 10.286 17.3057 10.2231 17.1688 10.2231H4.75405C4.52719 10.2231 4.41376 10.5375 4.57413 10.7217L7.02657 13.5379C7.12044 13.6457 7.24952 13.7085 7.38641 13.7085H19.8012C20.028 13.7085 20.1414 13.3941 19.9811 13.21L17.5286 10.3938Z"
        fill="url(#paint2_linear_362_16466)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_362_16466"
        x1="18.6152"
        y1="3.31726"
        x2="8.00938"
        y2="21.0079"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_362_16466"
        x1="14.8583"
        y1="1.0649"
        x2="4.25249"
        y2="18.7555"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_362_16466"
        x1="16.7248"
        y1="2.1839"
        x2="6.11898"
        y2="19.8745"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <clipPath id="clip0_362_16466">
        <rect
          width="15.5556"
          height="14"
          fill="white"
          transform="translate(4.5 4.99951)"
        />
      </clipPath>
    </defs>
  </>
);

export const SolanaLogo = ({
  className,
}: {
  className?: string;
}): JSX.Element => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {Icon}
  </svg>
);
