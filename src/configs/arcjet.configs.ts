import arcjet, {
  tokenBucket,
  shield,
  detectBot,
  validateEmail,
} from "@arcjet/next";
import { arcJetENV } from "./env-exports";

export const arcJetConf = arcjet({
  key: arcJetENV.ARCJET_KEY,
  characteristics: ["ip.src", "header.user-agent", "header.referer"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 15,
    }),
  ],
});

export const arcJetEmailValidationConf = arcjet({
  key: arcJetENV.ARCJET_KEY,
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});
