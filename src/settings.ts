import { crypto } from "https://deno.land/std@0.145.0/crypto/mod.ts";

const get_secret = async (): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const buffer = encoder.encode("mySuperSecret");

  const key = await crypto.subtle.importKey(
    "raw",
    buffer,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );

  return key;
};

export const secret: CryptoKey = await get_secret();
