# Asset notice

The website source is MIT-licensed, but that license does not cover the VolEq or
Signalbriar names, logos, application icons, or official visual identities.

## VolEq

The following first-party assets were copied without modification from [`DPatrikI/voleq-community`](https://github.com/DPatrikI/voleq-community) at commit [`4ba37d1037ab74c7915e7e2f95092d6304556391`](https://github.com/DPatrikI/voleq-community/commit/4ba37d1037ab74c7915e7e2f95092d6304556391) on 2026-08-24:

| Website file                           | Exact source path                                             | SHA-256                                                            |
| -------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `public/assets/voleq/voleq-mark.png`   | `apps/macos/community/Resources/AppIconSource/voleq-mark.png` | `5019cbd1f7135d9d62b32fcdbccb25b22d4c5f4301682b782fc402a47e720915` |
| `public/assets/voleq/voleq-window.png` | `docs/assets/voleq-community-window.png`                      | `7c979215e04d818dde9815fe197b8583ce2031280c3a6305273a8b0d3eed76ba` |

Their unmodified appearance here is an owner-authorized factual reference to the official VolEq project. Their presence in the public source repository does not make the VolEq branding open source, MPL-2.0-licensed, public domain, or generally reusable.

See the canonical [VolEq trademark policy](https://github.com/DPatrikI/voleq-community/blob/master/TRADEMARKS.md) for the current terms.

## Signalbriar

The following first-party assets were derived from the owner's Signalbriar game repository on 2026-09-16. Both were resized for the web with the `sharp` library's Lanczos kernel, with the full frame preserved and no cropping, watermarking, or colour change:

| Website file                                         | Source path in the Signalbriar repository                                | Transformation       | Source SHA-256                                                     | Published SHA-256                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------ | -------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `public/assets/signalbriar/signalbriar-mark.png`     | `assets/app/signalbriar-app-icon-1024.png`                               | 1024×1024 → 432×432  | `d70a200df10a1ed6a5211c0d353a2f9000f437cd53a81fcbec38aa55d1f86308` | `f6917caf8ea65a34f1983ca333502e3f2bec4c78aed733f8373ab3d93a5fed6c` |
| `public/assets/signalbriar/signalbriar-gameplay.png` | `artifacts/app-store/android-1.0/phone/01-defend-the-signal-android.png` | 1080×1920 → 720×1280 | `7a2c1208b2dbde9b9990e29b40645b5cf14e865802e6b4ebde8967aaa868a3a0` | `6ae23479fda04527df38def10b71bfd67a91258592fe5e75ae57435cb0afeb22` |

The gameplay capture is one of the accepted Play Store screenshot candidates. It is a deterministic Godot-rendered mobile fixture produced from the game's own scenes, not a physical-device screenshot or evidence of device acceptance. The Signalbriar repository is private, so these files are referenced by repository-relative path rather than by a public commit link.

Their appearance here is an owner-authorized factual reference to Signalbriar. Their presence in this public source repository does not make the Signalbriar branding open source, public domain, or generally reusable.
