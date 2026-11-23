/**
 * HELIOX — Firebase AI Logic & Hybrid Inference Engine
 * Built for #BuildHybridAI 2026 (Google Firebase)
 * Author: JESÚS BARRIOS
 *
 * Implements seamless on-device inference (Gemini Nano via Chrome Prompt API)
 * with automatic fallback to Cloud Gemini via Firebase AI Logic SDK.
 *
 * Key Design:
 *  - On-Device: Chrome Prompt API (window.ai.languageModel) → Gemini Nano local NPU
 *  - Cloud Fallback: Firebase AI Logic SDK (getAI + getGenerativeModel) → Gemini 2.0 Flash
 *  - Offline Last Resort: Deterministic rule-based heuristic assessment
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// ── Firebase Configuration ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || "AIzaSyDnp7lYFnyFxx8f-NgzdztBxknviweaeFs",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || "heliox-solar-monitor.firebaseapp.com",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || "heliox-solar-monitor",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || "heliox-solar-monitor.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "874577585107",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || "1:874577585107:web:865100237a013ee1840526",
};

// Singleton Firebase App
export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ── Type Definitions ────────────────────────────────────────────────────────
export interface HybridAnalysisResult {
  analysis: string;
  mode: "ON-DEVICE (Gemini Nano)" | "CLOUD (Gemini 2.0 Flash)" | "OFFLINE (Heuristic)";
  latencyMs: number;
  timestamp: string;
  source: string;
  sdkUsed: string;
}

// ── On-Device Availability Check ───────────────────────────────────────────
/**
 * Checks if Chrome Prompt API (Gemini Nano) is available.
 * Requires Chrome with #prompt-api-for-gemini-nano flag enabled.
 */
export async function checkOnDeviceAIAvailability(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    // @ts-ignore — Chrome Prompt API is not in TS types yet
    if (window.ai?.languageModel) {
      // @ts-ignore
      const capabilities = await window.ai.languageModel.capabilities();
      return (
        capabilities?.available === "readily" ||
        capabilities?.available === "after-download"
      );
    }
    return false;
  } catch (err) {
    console.warn("[HybridAI] On-device availability check failed:", err);
    return false;
  }
}

// ── On-Device Inference (Chrome Prompt API → Gemini Nano) ──────────────────
async function runOnDeviceInference(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  // @ts-ignore
  if (typeof window === "undefined" || !window.ai?.languageModel) {
    throw new Error("Chrome Prompt API (Gemini Nano) not available.");
  }
  // @ts-ignore
  const session = await window.ai.languageModel.create({ systemPrompt });
  const response = await session.prompt(userPrompt);
  session.destroy();
  return response;
}

// ── Cloud Inference (Firebase AI Logic SDK → Gemini 2.0 Flash) ────────────
/**
 * Uses the official Firebase AI Logic SDK (getAI + getGenerativeModel)
 * to call Gemini 2.0 Flash in the cloud.
 */
async function runFirebaseCloudInference(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    // Initialize Firebase AI Logic with GoogleAIBackend (Gemini Developer API)
    const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

    const model = getGenerativeModel(ai, {
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    return response.text();
  } catch (sdkError) {
    console.warn("[HybridAI] Firebase SDK cloud call failed, using API fallback:", sdkError);
    // Secondary fallback: direct API route (handles CORS/key issues gracefully)
    return await runApiRouteInference(systemPrompt, userPrompt);
  }
}

// ── API Route Fallback ────────────────────────────────────────────────────
async function runApiRouteInference(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch("/api/ai/analyze-cloud", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, userPrompt }),
  });
  if (!res.ok) throw new Error(`API route failed: ${res.status}`);
  const data = await res.json();
  return data.analysis || data.text || "Analysis complete.";
}

// ── Main Hybrid Dispatcher ────────────────────────────────────────────────
/**
 * Routes solar event data through the hybrid inference pipeline:
 *
 *  auto / prefer-device:
 *    1. Try Chrome Prompt API (Gemini Nano local) → instant, offline, private
 *    2. Fall back to Firebase AI Logic SDK (Gemini 2.0 Flash cloud)
 *    3. Last resort: deterministic heuristic model
 *
 *  prefer-cloud:
 *    1. Firebase AI Logic SDK (Gemini 2.0 Flash)
 *    2. Last resort: deterministic heuristic model
 */
export async function analyzeSolarEventHybrid(
  solarEventData: any,
  modePreference: "auto" | "prefer-device" | "prefer-cloud" = "auto"
): Promise<HybridAnalysisResult> {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();

  const systemPrompt = `You are HELIOX AI, an elite space weather intelligence system built for the #BuildHybridAI 2026 Google Firebase hackathon by Jesús Barrios.

Analyze real-time solar telemetry (CMEs, Flares, Geomagnetic Storms, Kp Index, Solar Wind) and produce a concise executive impact assessment for:
- Power grid operators (GIC risks)
- Satellite operators (LEO drag, charging)
- Aviation (HF radio blackouts, polar routing)
- GPS/GNSS positioning errors
- Aurora visibility forecast

Be direct, data-driven, and professional. Use Markdown formatting.`;

  const userPrompt = `Real-time Solar Telemetry Data:
${JSON.stringify(solarEventData, null, 2)}

Provide:
1. **Threat Level**: GREEN / YELLOW / RED
2. **Immediate Impact**: GPS, HF Radio, Power Grids, Satellites
3. **Aurora Forecast**: Visibility zones and probability
4. **Tactical Directive**: Priority actions for operators
5. **Confidence**: Data quality and certainty assessment`;

  // ── Path 1: On-Device (Gemini Nano via Chrome Prompt API) ────────────────
  if (modePreference !== "prefer-cloud") {
    const isOnDeviceAvailable = await checkOnDeviceAIAvailability();
    if (isOnDeviceAvailable) {
      try {
        const response = await runOnDeviceInference(systemPrompt, userPrompt);
        return {
          analysis: response,
          mode: "ON-DEVICE (Gemini Nano)",
          latencyMs: Math.round(performance.now() - startTime),
          timestamp,
          source: "Chrome Prompt API · Local NPU",
          sdkUsed: "Chrome Built-in AI (Gemini Nano 4)",
        };
      } catch (deviceError) {
        console.warn("[HybridAI] On-device failed, routing to Firebase cloud:", deviceError);
      }
    }
  }

  // ── Path 2: Firebase AI Logic SDK → Gemini 2.0 Flash Cloud ──────────────
  try {
    const response = await runFirebaseCloudInference(systemPrompt, userPrompt);
    return {
      analysis: response,
      mode: "CLOUD (Gemini 2.0 Flash)",
      latencyMs: Math.round(performance.now() - startTime),
      timestamp,
      source: "Firebase AI Logic SDK · GoogleAIBackend",
      sdkUsed: "firebase/ai · getGenerativeModel(gemini-2.0-flash)",
    };
  } catch (cloudError) {
    console.warn("[HybridAI] Cloud inference failed, using offline heuristics:", cloudError);
  }

  // ── Path 3: Offline Deterministic Heuristic (zero-dependency) ────────────
  return {
    analysis: generateOfflineAssessment(solarEventData),
    mode: "OFFLINE (Heuristic)",
    latencyMs: Math.round(performance.now() - startTime),
    timestamp,
    source: "On-Device Emergency Rules Engine",
    sdkUsed: "Local Heuristic (No network required)",
  };
}

// ── Offline Heuristic Fallback ────────────────────────────────────────────
function generateOfflineAssessment(data: any): string {
  const kp = data?.kpIndex ?? data?.kp ?? 3;
  const speed = data?.solarWindSpeedKmS ?? data?.speed_km_s ?? 450;
  const xray = data?.xRayClass ?? "C2.0";

  const threat =
    kp >= 8 ? "[CRITICO] RED — SEVERE (G4–G5)" :
    kp >= 6 ? "[ALERTA] ORANGE — STRONG (G2–G3)" :
    kp >= 5 ? "[MODERADO] YELLOW — MODERATE (G1–G2)" :
    "[NORMAL] GREEN — QUIET (Nominal)";

  const aurora =
    kp >= 7 ? "High probability at mid-latitudes (45°N+). Visible in Northern US, Central Europe." :
    kp >= 5 ? "Enhanced probability at high latitudes (55°N+). Alaska, Canada, Northern Europe." :
    "Restricted to auroral zones. Alaska, Northern Canada, Scandinavia, Iceland.";

  return `### HELIOX OFFLINE INTELLIGENCE REPORT
*Processed locally on-device — no cloud connectivity required*

**1. Threat Level:** ${threat}

**2. Immediate Impact Assessment:**
- **GPS/GNSS:** ${kp >= 6 ? "⚠️ Degraded precision expected. Differential GPS errors 2–8m." : "✅ Nominal positioning accuracy."}
- **HF Radio:** ${xray.startsWith("X") || xray.startsWith("M") ? "⚠️ Radio blackout possible on sunlit hemisphere." : "✅ Clear HF propagation conditions."}
- **Power Grids:** ${kp >= 7 ? "⚠️ GIC risk elevated. Monitor harmonic distortions on transmission lines." : "✅ Grid stability within normal parameters."}
- **Satellites:** ${speed > 600 ? "⚠️ Elevated LEO atmospheric drag. Orbit adjustments may be needed." : "✅ Orbital environment nominal."}

**3. Aurora Forecast:** ${aurora}

**4. Tactical Directive:** ${kp >= 6 ? "Alert relevant grid operators and satellite teams. Consider polar aviation route adjustments." : "Continue standard monitoring. No immediate action required."}

**5. Confidence:** ⚡ Medium — Offline heuristic model based on Kp=${kp.toFixed(1)}, V_sw=${speed} km/s, X-ray Class=${xray}`;
}
