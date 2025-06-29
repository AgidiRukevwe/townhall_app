import React from "react";
import { useNavigate } from "react-router-dom";

import NoContent from "../../public/assets/empty-state-illustrations/no-content-2.svg";
import NoInternetData from "../../public/assets/empty-state-illustrations/no-internet-data-2.svg";
import NoSearchResult from "../../public/assets/empty-state-illustrations/no-result-2.svg";
import PoorConnection from "../../public/assets/empty-state-illustrations/poor-connection-2.svg";
import NoNotifications from "../../public/assets/empty-state-illustrations/no-notifications.svg";
import { Button } from "../ui/button";

type EmptyStateType =
  | "no-content"
  | "not-found"
  | "no-internet"
  | "poor-connection";

type CustomAction = {
  label: string;
  onClick: () => void;
};

type EmptyStateProps = {
  type:
    | "no-content"
    | "not-found"
    | "no-internet"
    | "poor-connection"
    | "no-search-result";
  title?: string;
  description?: string;
  showRetry?: boolean;
  showButton?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  customAction?: {
    label: string;
    onClick: () => void;
  };
};

function EmptyState({
  type,
  title,
  description,
  showRetry = false,
  retryLabel,
  onRetry,
  customAction,
  showButton = true,
}: EmptyStateProps) {
  const navigate = useNavigate();

  let imageSrc = "";

  switch (type) {
    case "no-content":
      imageSrc = NoContent;
      break;
    case "no-internet":
      imageSrc = NoInternetData;
      break;
    case "not-found":
      imageSrc = NoSearchResult;
      break;
    case "poor-connection":
      imageSrc = PoorConnection;
      break;
    case "no-search-result":
      imageSrc = NoSearchResult;
      break;
    default:
      imageSrc = NoNotifications;
  }

  const renderCTA = () => {
    if (customAction) {
      return (
        <Button size="sm" onClick={customAction.onClick}>
          {customAction.label}
        </Button>
      );
    }

    if (showRetry && showButton && onRetry) {
      return (
        <Button size="sm" onClick={() => window.location.reload()}>
          {retryLabel}
        </Button>
      );
    }

    if (showButton) {
      return (
        <Button size="sm" onClick={() => navigate("/")}>
          Go home
        </Button>
      );
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-4 space-y-4">
      <div className="">
        <img src={imageSrc} alt={title} className="w-40 h-40" />
      </div>
      <div className="space-y-2 mb-4 flex flex-col items-center justify-center">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-text-secondary w-64">{description}</p>
      </div>
      <div className="mt-4">{renderCTA()}</div>
    </div>
  );
}

export default EmptyState;
