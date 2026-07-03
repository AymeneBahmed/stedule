import {
  sendNewEmailVerificationLink,
  sendNewProfileInformationCode,
  updateProfileInformation,
} from "@/actions/settings-actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function useProfileInformationActions() {
  const [
    updateProfileInformationState,
    updateProfileInformationAction,
    isUpdateProfileInformationPending,
  ] = useActionState(updateProfileInformation, null);
  const [
    sendNewEmailVerificationLinkState,
    sendNewEmailVerificationLinkAction,
    isSendNewEmailVerificationLinkPending,
  ] = useActionState(sendNewEmailVerificationLink, null);
  const [
    sendNewProfileInformationCodeState,
    sendNewProfileInformationCodeAction,
    isSendNewProfileInformationCodePending,
  ] = useActionState(sendNewProfileInformationCode, null);

  useEffect(() => {
    if (sendNewProfileInformationCodeState?.success) {
      toast.success(sendNewProfileInformationCodeState.success);

      return;
    }

    if (sendNewProfileInformationCodeState?.error) {
      toast.error(sendNewProfileInformationCodeState.error);
    }
  }, [sendNewProfileInformationCodeState]);

  useEffect(() => {
    if (updateProfileInformationState?.success) {
      toast.success(updateProfileInformationState.success);

      return;
    }

    if (updateProfileInformationState?.error) {
      toast.error(updateProfileInformationState.error);
    }
  }, [updateProfileInformationState]);

  useEffect(() => {
    if (sendNewEmailVerificationLinkState?.success) {
      toast.success(sendNewEmailVerificationLinkState.success);

      return;
    }

    if (sendNewEmailVerificationLinkState?.error) {
      toast.error(sendNewEmailVerificationLinkState.error);
    }
  }, [sendNewEmailVerificationLinkState]);

  return {
    updateProfileInformationAction,
    isUpdateProfileInformationPending,
    sendNewEmailVerificationLinkAction,
    isSendNewEmailVerificationLinkPending,
    sendNewProfileInformationCodeAction,
    isSendNewProfileInformationCodePending,
  };
}
