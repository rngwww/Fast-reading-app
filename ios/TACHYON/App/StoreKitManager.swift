import Foundation
import StoreKit
import WebKit

@MainActor
class StoreKitManager {
    static let shared = StoreKitManager()

    weak var activeWebView: WKWebView?

    // Apple App Store Product IDs
    let productIds: [String] = [
        "com.tachyon.reader.annual",
        "com.tachyon.reader.monthly"
    ]

    private var updateListenerTask: Task<Void, Error>? = nil

    private init() {}

    deinit {
        updateListenerTask?.cancel()
    }

    // Start background listener for external updates (e.g., Ask to Buy, Family Sharing, renewals)
    func startTransactionListener() {
        updateListenerTask = Task.detached {
            for await result in Transaction.updates {
                do {
                    let transaction = try self.checkVerified(result)
                    await transaction.finish()
                    await self.notifyWebviewActiveState(true)
                } catch {
                    print("Transaction verification failed: \(error)")
                }
            }
        }
    }

    // Purchase a product using StoreKit 2
    func purchase(productId: String) async throws -> Bool {
        let products = try await Product.products(for: [productId])
        guard let product = products.first else {
            throw NSError(domain: "StoreKitManager", code: 404, userInfo: [NSLocalizedDescriptionKey: "Product not found in App Store"])
        }

        let result = try await product.purchase()

        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await transaction.finish()
            await notifyWebviewActiveState(true)
            return true
        case .userCancelled:
            return false
        case .pending:
            return false
        @unknown default:
            return false
        }
    }

    // Restore existing purchases using StoreKit 2
    func restorePurchases() async throws -> Bool {
        try await AppStore.sync()

        var hasActiveEntitlement = false

        for await result in Transaction.currentEntitlements {
            do {
                let transaction = try checkVerified(result)
                if productIds.contains(transaction.productID) {
                    if transaction.revocationDate == nil {
                        hasActiveEntitlement = true
                        break
                    }
                }
            } catch {
                print("Error checking entitlement: \(error)")
            }
        }

        await notifyWebviewActiveState(hasActiveEntitlement)
        return hasActiveEntitlement
    }

    // Check if the transaction came legitimately from Apple's servers
    nonisolated private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let safe):
            return safe
        }
    }

    private func notifyWebviewActiveState(_ isActive: Bool) async {
        guard let webView = activeWebView else { return }
        let js = "window.__onNativeRestoreSuccess(\(isActive));"
        webView.evaluateJavaScript(js, completionHandler: nil)
    }
}
