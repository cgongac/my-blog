"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton(): JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onLogout = async (): Promise<void> => {
    try {
      setPending(true);
      await fetch("/api/logout", { method: "POST" });
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button type="button" className="action-button" onClick={onLogout} disabled={pending}>
      {pending ? "退出中..." : "退出私密区"}
    </button>
  );
}
