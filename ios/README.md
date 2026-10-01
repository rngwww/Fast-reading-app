# TACHYON — iOS Installation & App Store Guide

Welcome to the native iOS version of **TACHYON**. This guide provides simple, step-by-step instructions on how to install and test this version on your iPhone.

---

## 📱 Method 1: Instant 10-Second Install on iPhone (No Mac or Computer Needed)

You can run TACHYON directly on your iPhone as a standalone full-screen app right now with zero code compiling:

1. **Open Safari** on your iPhone.
2. Navigate to your app URL (or hosted GitHub Pages link: `https://rngwww.github.io/Fast-reading-app/`).
3. Tap the **Share button** at the bottom center of Safari (the square icon with the arrow pointing up `⬆️`).
4. Scroll down and tap **"Add to Home Screen"** (`➕`).
5. Tap **"Add"** in the top-right corner.
6. The TACHYON icon will appear on your iPhone Home Screen. Tap it to launch:
   - It opens in full-screen immersion (no browser address bars).
   - All synthetic audio clicks, haptic feedback, dark modes, and offline book storage work immediately.

---

## 💻 Method 2: Opening and Installing via Mac & Xcode (Official Native App)

If you have a Mac and want to run the official native Xcode project or install it onto your iPhone via USB:

### Prerequisites:
- A Mac running macOS 13 (Ventura) or newer.
- **Xcode** installed (Free from the Mac App Store).
- An Apple ID (a free personal Apple ID works for testing; an Apple Developer account is only needed for App Store publishing).

### Step-by-Step Instructions:

1. **Open the Project in Xcode**:
   - In Finder, navigate to the `ios/TACHYON/` folder.
   - Double-click `TACHYON.xcodeproj`. Xcode will open.

2. **Select Your Signing Team**:
   - In Xcode's left sidebar, click the top-level **TACHYON** blue project icon.
   - In the center panel, select the **"Signing & Capabilities"** tab.
   - Under **Team**, choose your Apple ID / Name from the dropdown.
   - Xcode will automatically generate your free provisioning profile.

3. **Choose Your Target Device**:
   - At the top bar of Xcode (next to the "Play" `▶️` button), click the device selector.
   - Select either **an iPhone Simulator** (e.g., iPhone 15 Pro) or plug in your physical **iPhone** using a USB-to-Lightning/USB-C cable.

4. **Click Run (`▶️`)**:
   - Click the **Play button** in the top-left corner of Xcode (or press `Command + R`).
   - Xcode will compile the Swift code, build the native `WKWebView` shell with StoreKit 2 and Taptic Engine bridges, and launch TACHYON directly on your phone!

---

## 🛒 StoreKit 2 & In-App Purchases Testing

The app is equipped with modern **Apple StoreKit 2** support:
- **Product IDs**:
  - `com.tachyon.reader.annual` ($39.99/year)
  - `com.tachyon.reader.monthly` ($4.99/month)
- **StoreKit Configuration File (for local testing in Xcode)**:
  - In Xcode, you can test purchases and restores for free in the simulator without real credit card charges by using StoreKit Testing.
- **Restore Purchases**:
  - Accessible on the Prime page and under **Settings > Membership > Restore Purchases**.

---

## ⚖️ App Store Compliance & Legal Documents

Apple requires active, clickable links to privacy policies and subscription terms before approving an app (Apple Guideline 3.1.2). These are built directly into the app:
- **Privacy Policy**: Confirms 100% on-device local storage with zero server tracking.
- **Terms of Service**: Details auto-renewable subscriptions, billing cycles, and cancellation via Apple ID.
- **EULA**: Standard Apple End User License Agreement.
- Access them directly in the app via **Settings > Legal & Privacy** or at the bottom of the **Prime** screen.

---

## 🚀 App Store Submission Checklist

When you are ready to submit to the App Store:
1. In Xcode, set the run destination to **"Any iOS Device (arm64)"**.
2. Go to the menu: **Product > Archive**.
3. Once the build finishes, click **"Distribute App"** > **"App Store Connect"**.
4. Test on your iPhone via **Apple TestFlight**, then click **"Submit for Review"**!
