import React from "react";

interface MainHeaderProps {
  text: string;
  size?: boolean | null; // Making `size` optional and can be boolean or null
}

const MainHeader: React.FC<MainHeaderProps> = ({
  text,
  size = null, // Default `size` to `null` if not provided
}) => <h1 className={`main-header main-header-style ${size ? "large" : ""}`}>{text}</h1>; // Conditional class addition based on size

export default MainHeader;
