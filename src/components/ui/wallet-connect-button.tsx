// components/WalletConnectButton.tsx
'use client';
// Use the AppKit button directly, which handles connection logic via the modal
// configured in src/context/walletContext.tsx

// Note: The className prop might not be directly applicable to <appkit-button />.
// Styling is typically handled through AppKit's theming or custom CSS targeting the element.
// We'll keep the component structure simple for now.

export default function WalletConnectButton() {
  // The <appkit-button /> element provided by @reown/appkit handles
  // opening the connection modal and displaying connection state.
  return <appkit-button />;
}
