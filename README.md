# ☀️ HELIOX — Hybrid AI Space Weather & Solar Intelligence

> **Official Submission for the Google Firebase [#BuildHybridAI 2026 Hackathon](https://firebasehybridaihackathon.devpost.com/)**  
> **Platform Category:** Web (Chrome) — Gemini Nano 4 + Cloud Gemini 2.0  
> **Author & Lead Engineer:** Jesús Barrios  
> **License:** Apache License 2.0  

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![Firebase AI Logic](https://img.shields.io/badge/Firebase_AI_Logic-Hybrid_Inference-orange)](https://firebase.google.com/docs/ai-logic/hybrid)
[![Gemini Nano](https://img.shields.io/badge/Local_Model-Gemini_Nano_4-emerald)](https://developer.chrome.com/docs/ai/prompt-api)

---

## 🛰️ Executive Summary & Value Proposition

During Solar Cycle 25 maximum, intense solar flares and Coronal Mass Ejections (CMEs) pose severe threats to low-Earth orbit satellites, high-frequency aviation radio communications, GPS precision, and terrestrial electrical transmission grids. 

**HELIOX** is an autonomous space observatory and planetary threat assessment platform that transforms raw telemetry streams from **NASA (DONKI)**, **NOAA (SWPC)**, and **DSCOVR** into actionable, instant intelligence.

Using the **Firebase AI Logic Hybrid Inference SDK**, HELIOX bridges edge and cloud computing:
1. **On-Device (Gemini Nano):** When an operator is offline or in low-connectivity conditions, HELIOX executes immediate risk classification and tactical guidance locally on the device with zero latency and zero data cost.
2. **Cloud Fallback (Gemini 2.0 Flash via Firebase):** When online and demanding deep multi-source synthesis, HELIOX routes heavy analysis to cloud models to correlate magnetospheric compression, polar auroral maps, and power grid induction forecasts.

---

## ⚡ How Firebase AI Logic Hybrid Inference is Implemented

The hybrid logic is centralized in [`lib/firebase-ai.ts`](lib/firebase-ai.ts) and orchestrated by the interactive [`components/HybridAIConsole.tsx`](components/HybridAIConsole.tsx) component:

```typescript
// Seamless Edge-to-Cloud Dispatcher
export async function analyzeSolarEventHybrid(
  solarEventData: any,
  modePreference: 'auto' | 'prefer-device' | 'prefer-cloud' = 'auto'
): Promise<HybridAnalysisResult> {
  // 1. Try On-Device local inference (Gemini Nano via Chrome Prompt API)
  if (modePreference !== 'prefer-cloud') {
    const isDeviceAvailable = await checkOnDeviceAIAvailability();
    if (isDeviceAvailable) {
      const localResponse = await runOnDeviceInference(systemPrompt, userPrompt);
      return { analysis: localResponse, mode: 'ON-DEVICE (Gemini Nano)' };
    }
  }

  // 2. Graceful Cloud Fallback (Firebase AI Logic / Cloud Gemini)
  const cloudResponse = await runCloudInference(systemPrompt, userPrompt);
  return { analysis: cloudResponse, mode: 'CLOUD (Gemini 2.0 Flash)' };
}
```

---

## 🏗️ Architecture

```
                                  [ NASA DONKI & NOAA SWPC ]
                                              │ (Real-Time Telemetry)
                                              ▼
                                 [ HELIOX Observational Hub ]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
             [ Client Browser ]                             [ Firebase Gateway ]
        (Chrome Prompt API / NPU)                      (Cloud Gemini 2.0 Flash API)
                      │                                               │
             ⚡ ON-DEVICE INFERENCE                          ☁️ CLOUD INFERENCE
          - Zero-latency Kp assessment                   - Deep multi-flare correlation
          - Offline emergency advisory                   - Aurora forecast mapping
          - 100% private & resilient                     - Long-horizon mission planning
```

---

## 🚀 Key Features

* **Real-Time Instrumentation:** Live gauges for Kp Index, planetary magnetic field ($B_z$), solar wind speed, and X-ray flux.
* **Hybrid Inference Console:** Interactive UI toggle allowing users and judges to witness the live switch between local on-device NPU reasoning and cloud fallback.
* **3D Planetary Magnetosphere:** Interactive 3D visualization showing coronal mass ejection trajectory relative to Earth.
* **Emergency Offline Mode:** Continues to evaluate telemetry and cached alerts even when network connection is severed.

---

## 💻 Local Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/JesusBarrios/heliox-hybrid.git
cd heliox-hybrid

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience HELIOX.

---

## 📽️ Demo Video & Verification

* **Demonstration Video (YouTube):** *[Link to be added during final submission]*
* **Live Deployment:** *[Vercel URL]*
* **Devpost Project Page:** *[#BuildHybridAI 2026 Submission Entry]*
