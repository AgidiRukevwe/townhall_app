import { useRatingModalStore } from "@/store/rating-store";
import { useSignInModalStore } from "@/store/signin-modal-store";
import React from "react";
import { useAuth } from "../auth-hooks/use-auth-updated";

const useHandleRatingModal = () => {
  const { user } = useAuth();

  const { openModal: openRatingModal } = useRatingModalStore();
  const { openModal: openSignInModal } = useSignInModalStore();

  return () => {
    if (user) {
      openRatingModal();
      console.log("rating modal open");
    } else {
      openSignInModal();
      console.log("signin modal open");
    }
  };
};

export default useHandleRatingModal;
