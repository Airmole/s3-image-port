"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAccessPasswordFromEnv } from "@/lib/env/runtime-config";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useTranslations } from "use-intl";

const ACCESS_SESSION_KEY = "s3ip:access:password";

interface AccessGateProps {
  children: ReactNode;
}

export function AccessGate({ children }: AccessGateProps) {
  const t = useTranslations("accessGuard");
  const configuredPassword = getAccessPasswordFromEnv();

  const [isReady, setIsReady] = useState(!configuredPassword);
  const [isUnlocked, setIsUnlocked] = useState(!configuredPassword);
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!configuredPassword) {
      return;
    }
    const storedPassword = window.sessionStorage.getItem(ACCESS_SESSION_KEY);
    if (storedPassword === configuredPassword) {
      setIsUnlocked(true);
    }
    setIsReady(true);
  }, [configuredPassword]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!configuredPassword) {
      return;
    }

    if (password === configuredPassword) {
      window.sessionStorage.setItem(ACCESS_SESSION_KEY, configuredPassword);
      setIsUnlocked(true);
      setHasError(false);
      return;
    }

    setHasError(true);
  };

  if (!configuredPassword) {
    return <>{children}</>;
  }

  if (!isReady) {
    return null;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm flex flex-col gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="access-password" className="text-sm font-medium">
            {t("passwordLabel")}
          </label>
          <Input
            id="access-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (hasError) {
                setHasError(false);
              }
            }}
          />
          {hasError ? (
            <p className="text-sm text-destructive">{t("invalidPassword")}</p>
          ) : null}
        </div>

        <Button type="submit">{t("submit")}</Button>
      </form>
    </div>
  );
}

