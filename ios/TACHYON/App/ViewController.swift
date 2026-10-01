import UIKit
import WebKit
import SafariServices

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler {

    var webView: WKWebView!
    private let impactLight = UIImpactFeedbackGenerator(style: .light)
    private let impactMedium = UIImpactFeedbackGenerator(style: .medium)
    private let impactHeavy = UIImpactFeedbackGenerator(style: .heavy)
    private let notificationHaptic = UINotificationFeedbackGenerator()

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black

        setupWebView()
        loadApp()
    }

    private func setupWebView() {
        let configuration = WKWebViewConfiguration()
        let userContentController = WKUserContentController()

        // 1. Register JavaScript bridge handlers
        userContentController.add(self, name: "storeKit")
        userContentController.add(self, name: "haptics")

        // 2. Disable pinch-to-zoom for 100% native app feel
        let viewportScript = """
        var meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        """
        let userScript = WKUserScript(source: viewportScript, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        userContentController.addUserScript(userScript)

        configuration.userContentController = userContentController
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []

        webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = .black
        webView.scrollView.backgroundColor = .black
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        // Pass StoreKitManager reference to webview
        StoreKitManager.shared.activeWebView = webView

        view.addSubview(webView)
    }

    private func loadApp() {
        // Look for bundled web app first, fallback to hosted or root files
        if let indexPath = Bundle.main.path(forResource: "index", ofType: "html") {
            let indexUrl = URL(fileURLWithPath: indexPath)
            let baseDir = indexUrl.deletingLastPathComponent()
            webView.loadFileURL(indexUrl, allowingReadAccessTo: baseDir)
        } else {
            // Live development or fallback URL
            if let remoteUrl = URL(string: "https://rngwww.github.io/Fast-reading-app/") {
                let request = URLRequest(url: remoteUrl)
                webView.load(request)
            }
        }
    }

    // MARK: - WKScriptMessageHandler
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "storeKit" {
            guard let dict = message.body as? [String: Any],
                  let action = dict["action"] as? String else { return }

            if action == "purchase" {
                let productId = dict["productId"] as? String ?? "com.tachyon.reader.annual"
                Task {
                    do {
                        let success = try await StoreKitManager.shared.purchase(productId: productId)
                        await MainActor.run {
                            if success {
                                self.webView.evaluateJavaScript("window.__onNativePurchaseSuccess('\(productId)')")
                            }
                        }
                    } catch {
                        print("Purchase error: \(error.localizedDescription)")
                    }
                }
            } else if action == "restore" {
                Task {
                    do {
                        let hasSub = try await StoreKitManager.shared.restorePurchases()
                        await MainActor.run {
                            self.webView.evaluateJavaScript("window.__onNativeRestoreSuccess(\(hasSub))")
                        }
                    } catch {
                        await MainActor.run {
                            self.webView.evaluateJavaScript("window.__onNativeRestoreSuccess(false)")
                        }
                    }
                }
            }
        } else if message.name == "haptics" {
            guard let type = message.body as? String else { return }
            switch type {
            case "light":
                impactLight.impactOccurred()
            case "medium":
                impactMedium.impactOccurred()
            case "heavy":
                impactHeavy.impactOccurred()
            case "success":
                notificationHaptic.notificationOccurred(.success)
            case "error":
                notificationHaptic.notificationOccurred(.error)
            default:
                impactLight.impactOccurred()
            }
        }
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url, navigationAction.navigationType == .linkActivated {
            // Open external URLs in native SFSafariViewController
            if url.scheme == "http" || url.scheme == "https" {
                let safariVC = SFSafariViewController(url: url)
                present(safariVC, animated: true)
                decisionHandler(.cancel)
                return
            }
        }
        decisionHandler(.allow)
    }
}
