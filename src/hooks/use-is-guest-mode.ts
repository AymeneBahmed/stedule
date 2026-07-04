import { authClient } from "@/lib/auth/auth-client";
import { useEffect, useState } from "react";

export function useIsGuestMode() {
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();

      if (!session.data) {
        setIsGuestMode(true);
      }
    })();
  }, []);

  return isGuestMode;
}
