import React from "react";
import { useNavigate } from "react-router-dom";

import NoContent from "../../public/assets/empty-state-illustrations/no-content.svg";
import NoInternetData from "../../public/assets/empty-state-illustrations/no-internet-data.svg";
import NoSearchResult from "../../public/assets/empty-state-illustrations/no-result.svg";
import PoorConnection from "../../public/assets/empty-state-illustrations/poor-connection.svg";
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

    if (showRetry && onRetry) {
      return (
        <Button size="sm" onClick={() => window.location.reload()}>
          {retryLabel}
        </Button>
      );
    }

    return (
      <Button size="sm" onClick={() => navigate("/")}>
        Go home
      </Button>
    );
  };

  return (
    <div className="flex flex-col items-center text-center p-4 space-y-4">
      <img src={imageSrc} alt={title} className="w-32 h-32 mb-4" />
      <div className="space-y-2 mb-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-text-secondary w-56">{description}</p>
      </div>
      <div className="mt-4">{renderCTA()}</div>
    </div>
  );
}

export default EmptyState;
