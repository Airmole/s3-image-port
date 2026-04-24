import type { S3Options } from "@/stores/schemas/settings";

type S3SettingsLike = Pick<
  S3Options,
  | "endpoint"
  | "bucket"
  | "region"
  | "accKeyId"
  | "secretAccKey"
  | "forcePathStyle"
  | "pubUrl"
  | "includePath"
>;

function getNonEmptyEnvValue(key: string): string | undefined {
  const value = (import.meta.env as Record<string, unknown>)[key];
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseBooleanFromEnv(key: string): boolean | undefined {
  const value = getNonEmptyEnvValue(key)?.toLowerCase();
  if (!value) {
    return undefined;
  }

  if (["1", "true", "yes", "on"].includes(value)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(value)) {
    return false;
  }

  return undefined;
}

const accessPasswordFromEnv = getNonEmptyEnvValue("VITE_ACCESS_PASSWORD");
const s3Endpoint = getNonEmptyEnvValue("VITE_S3_ENDPOINT");
const s3Bucket = getNonEmptyEnvValue("VITE_S3_BUCKET");
const s3Region = getNonEmptyEnvValue("VITE_S3_REGION");
const s3AccessKeyId = getNonEmptyEnvValue("VITE_S3_ACCESS_KEY_ID");
const s3SecretAccessKey = getNonEmptyEnvValue("VITE_S3_SECRET_ACCESS_KEY");
const s3ForcePathStyle = parseBooleanFromEnv("VITE_S3_FORCE_PATH_STYLE");
const s3PublicUrl = getNonEmptyEnvValue("VITE_S3_PUBLIC_URL");
const s3IncludePath = getNonEmptyEnvValue("VITE_S3_INCLUDE_PATH");

const s3EnvOverrides: Partial<S3SettingsLike> = {
  ...(s3Endpoint && {
    endpoint: s3Endpoint,
  }),
  ...(s3Bucket && {
    bucket: s3Bucket,
  }),
  ...(s3Region && {
    region: s3Region,
  }),
  ...(s3AccessKeyId && {
    accKeyId: s3AccessKeyId,
  }),
  ...(s3SecretAccessKey && {
    secretAccKey: s3SecretAccessKey,
  }),
  ...(s3ForcePathStyle !== undefined && {
    forcePathStyle: s3ForcePathStyle,
  }),
  ...(s3PublicUrl && {
    pubUrl: s3PublicUrl,
  }),
  ...(s3IncludePath && {
    includePath: s3IncludePath,
  }),
};

export function getAccessPasswordFromEnv() {
  return accessPasswordFromEnv;
}

export function applyS3EnvOverrides<T extends S3SettingsLike>(settings: T): T {
  if (Object.keys(s3EnvOverrides).length === 0) {
    return settings;
  }
  return {
    ...settings,
    ...s3EnvOverrides,
  };
}
