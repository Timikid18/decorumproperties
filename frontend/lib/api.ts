import { ApiError } from "@/types";
import { getToken } from "./auth";

const CONFIGURED_API_URL =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== ""
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")
    : null;

const IS_PROD = process.env.NODE_ENV === "production";

function resolveApiBase(): string {
  if (CONFIGURED_API_URL) {
    // Allow either a bare origin or one that already includes /api.
    return CONFIGURED_API_URL.endsWith("/api") ? CONFIGURED_API_URL : `${CONFIGURED_API_URL}/api`;
  }

  // In production NEXT_PUBLIC_API_URL is required. Fall back to a clearly
  // identifiable broken URL rather than silently guessing a local backend.
  if (IS_PROD) {
    console.error(
      "NEXT_PUBLIC_API_URL is not set. Add it to your Vercel environment variables " +
        "(e.g. https://api.your-domain.ng).",
    );
    return "https://api.invalid/api";
  }

  // Development only: infer the backend from the browser host on port 8000.
  if (typeof window !== "undefined" && window.location.hostname) {
    const host = window.location.hostname;
    // Windows often resolves `localhost` to IPv6 ::1 first, but the backend
    // binds IPv4 only — use 127.0.0.1 explicitly to avoid a refused connection.
    const apiHost = host === "localhost" ? "127.0.0.1" : host;
    return `http://${apiHost}:8000/api`;
  }

  return "http://localhost:8000/api";
}

const API_BASE = resolveApiBase();

function resolveStorageOrigin(): string {
  if (CONFIGURED_API_URL) {
    return CONFIGURED_API_URL.endsWith("/api")
      ? CONFIGURED_API_URL.slice(0, -4)
      : CONFIGURED_API_URL;
  }
  if (IS_PROD) {
    // Broken marker that mirrors resolveApiBase() when the API URL is unset.
    return "https://api.invalid";
  }
  if (typeof window !== "undefined" && window.location.hostname) {
    const host = window.location.hostname;
    const apiHost = host === "localhost" ? "127.0.0.1" : host;
    return `http://${apiHost}:8000`;
  }
  return "http://localhost:8000";
}

/** Absolute URL for a file inside the backend's public storage disk. */
export function storageUrl(path: string): string {
  return `${resolveStorageOrigin()}/storage/${path}`;
}

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown | FormData;
  auth?: boolean;
  headers?: Record<string, string>;
  timeout?: number;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
    headers = {},
    timeout = 20000,
  } = options;

  const url = `${API_BASE}${path}`;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body && !isFormData) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (auth && token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: isFormData
        ? (body as FormData)
        : body
          ? JSON.stringify(body)
          : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      const message = payload?.message ?? `Request failed with status ${response.status}`;
      throw new ApiClientError(message, response.status, payload?.errors);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError("The request timed out. Please try again.", 408);
    }
    throw new ApiClientError(
      "Unable to reach the server. Please check your connection and try again.",
      0,
    );
  } finally {
    window.clearTimeout(timer);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error instanceof ApiClientError
  );
}

export function apiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}