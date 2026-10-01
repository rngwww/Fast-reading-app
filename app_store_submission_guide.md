# TACHYON — Apple App Store Submission Guide

This document contains everything you need to copy and paste directly into **App Store Connect** (`appstoreconnect.apple.com`) to submit TACHYON for official Apple review.

---

## 1. App Store Listing Metadata

| Field | Value to Enter in App Store Connect |
| :--- | :--- |
| **App Name** | `TACHYON: Speed Reading RSVP` |
| **Subtitle** (Max 30 chars) | `Absorb Books at 1000+ WPM` |
| **Primary Category** | `Education` or `Books` |
| **Secondary Category** | `Productivity` |
| **Bundle ID** | `com.tachyon.reader` |
| **SKU** | `TACHYON-IOS-01` |
| **Keywords** (Max 100 chars) | `speed reader,rsvp,reading,fast reader,spritz,ebook,epub reader,bionic reading,retention,books` |
| **Support URL** | `https://rngwww.github.io/Fast-reading-app/` |
| **Marketing URL** | `https://rngwww.github.io/Fast-reading-app/` |
| **Privacy Policy URL** | `https://rngwww.github.io/Fast-reading-app/` (Accessible directly in-app) |

---

## 2. App Store Description (Copy & Paste)

```text
Read books, articles, and documents at superhuman speeds with TACHYON.

Powered by Rapid Serial Visual Presentation (RSVP), TACHYON flashes words at your exact focal point. By eliminating the eye movements and inner vocalization that slow down traditional reading, TACHYON allows your brain to absorb text at 300 to 1,200+ words per minute without visual fatigue.

KEY FEATURES:

• OPTICAL RETICLE ALIGNMENT
Every word is automatically centered on its optimal recognition point, accented with high-contrast focal colors (Crimson, Cyan, Emerald, Gold, and more).

• SYNTHETIC RHYTHM SOUND SUITE
Synchronize your visual processing with rhythmic audio clicks (Organic, Mechanical, Wood, Pulse, and Vinyl clicks) for enhanced focus and pace.

• 4 CINEMATIC THEMES
Read in total comfort day or night with Dark (Obsidian), Light, Graphite, and Parchment themes with ambient glass styling.

• IMPORT FULL NOVELS & DOCUMENTS
Easily import your favorite EPUB books and TXT files. Tap into your offline library anytime, anywhere.

• COMPREHENSION & RETENTION TRACKING
Test your retention after reading sprints with intuitive recall checks and streak tracking.

• 100% PRIVATE & ON-DEVICE
Your books, reading habits, and stats are processed and stored strictly on your device. Zero server uploads, zero third-party tracking, zero data collection.

---

SUBSCRIPTION DETAILS:
TACHYON is free to download and use with starter limits. Upgrade to TACHYON Prime for unlimited book imports, full library storage, all 9 focal colors, and all sound profiles.

Payment will be charged to your Apple ID account at confirmation of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. Manage or cancel subscriptions in your App Store Account Settings anytime.

Terms of Service: https://rngwww.github.io/Fast-reading-app/
Privacy Policy: https://rngwww.github.io/Fast-reading-app/
```

---

## 3. In-App Purchases Configuration (StoreKit 2)

In App Store Connect under **App Store > Subscriptions**:

1. **Create Subscription Group**: `TACHYON Prime`
2. **Product 1 (Annual Plan — Recommended)**:
   - **Reference Name**: `TACHYON Prime Annual`
   - **Product ID**: `com.tachyon.reader.annual`
   - **Subscription Duration**: `1 Year`
   - **Price**: `$39.99` (Tier 40)
   - **Free Trial**: `7 Days Free Trial`
3. **Product 2 (Monthly Plan)**:
   - **Reference Name**: `TACHYON Prime Monthly`
   - **Product ID**: `com.tachyon.reader.monthly`
   - **Subscription Duration**: `1 Month`
   - **Price**: `$4.99` (Tier 5)

---

## 4. App Privacy Nutrition Labels (Mandatory)

In App Store Connect under **App Privacy**:

- **Question**: *"Do you or your third-party partners collect data from this app?"*
- **Select**: **No, we do not collect data from this app.**
- *Rationale: All documents, reading speeds, and stats are stored strictly inside IndexedDB on the device. No remote analytics or trackers are included.*

---

## 5. Age Rating Questionnaire

Answer the Apple Age Rating questionnaire:
- Cartoon/Fantasy Violence: **None**
- Realistic Violence: **None**
- Profanity or Crude Humor: **None**
- Mature/Suggestive Themes: **None**
- Medical/Treatment Information: **None**
- Unrestricted Web Access: **No**
- Gambling: **None**

➡️ **Result**: **Rated 4+ (Approved for All Ages)**

---

## 6. App Review Information (Notes for Apple Review Team)

Copy and paste this into the **"Review Notes"** field for the Apple reviewer:

```text
Hello Apple Review Team,

TACHYON is an RSVP speed-reading application.

Features for Review:
1. RSVP Speed Reader: Tap the reader stage to start and pause word flashing. Users can adjust WPM speed using the scrubber slider.
2. Library & File Import: Three preloaded books are available to read immediately. Users can tap "+ Add Book" to import .epub or .txt files.
3. Freemium Model:
   - Free users can read up to 600 words of any imported book and keep up to 3 books in the library.
   - Prime unlocks unlimited book lengths, all 9 focal colors, and all sound profiles.
4. Testing In-App Purchases:
   - You can test subscriptions using the StoreKit sandbox or tap "Start Free Trial" on the Prime tab.
   - A visible "Restore Purchases" button is present on the Prime tab and in Settings under Membership.
   - Clickable links for Privacy Policy, Terms of Service, and EULA are available on the Prime tab and in Settings > Legal & Privacy.

Please let us know if you need any additional information. Thank you!
```

---

## 7. App Store Visual Assets

- **App Icon**: `assets/icons/icon-1024.png` (1024×1024 px, solid background, zero alpha transparency, ready to upload).
- **Screenshots**: Capture full-screen screenshots from the iPhone simulator or device:
  1. Reader Stage during reading with illuminated focal letter.
  2. Library view showing book cards with retention rating icons.
  3. Settings showing cinematic themes (Dark, Light, Graphite, Parchment) and sound profiles.
  4. Prime benefits showcase.
