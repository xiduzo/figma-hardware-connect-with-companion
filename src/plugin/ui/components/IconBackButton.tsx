import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton } from "./";

export function IconBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return <IconButton icon="ArrowLeftIcon" onClick={() => navigate(-1)} />;
}
