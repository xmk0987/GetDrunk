import React from "react";

import { IconProps } from "../types/types";

const CloseIcon: React.FC<IconProps> = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={`${size}px`}
    viewBox="0 -960 960 960"
    width={`${size}px`}
    fill="#000000"
  >
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export default CloseIcon;
