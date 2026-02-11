"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type UnlockFormProps = {
  nextPath: string;
};

export function UnlockForm({ nextPath }: UnlockFormProps): JSX.Element {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!password.trim()) {
      setError("请输入密码");
      return;
    }

    try {
      setPending(true);
      setError("");

      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message ?? "密码验证失败，请重试");
        return;
      }

      router.push(nextPath || "/diary");
      router.refresh();
    } catch {
      setError("网络异常，请稍后再试");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="unlock-form">
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter Password"
      />
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="primary-button" disabled={pending}>
        {pending ? "验证中..." : "解锁"}
      </button>
    </form>
  );
}
