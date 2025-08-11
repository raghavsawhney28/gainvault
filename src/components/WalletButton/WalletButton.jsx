import React from 'react';
import { Wallet, LogOut, Loader2 } from 'lucide-react'; // Assuming you have a loader icon
import usePhantomWallet from '../../hooks/usePhantomWallet';
import styles from './WalletButton.module.css';

const WalletButton = () => {
  const {
    connected,
    connecting,
    publicKey,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isPhantomInstalled,
  } = usePhantomWallet();

  if (!isPhantomInstalled) {
    return (
      <button
        className={styles.installButton}
        onClick={() => window.open('https://phantom.app/', '_blank')}
      >
        Install Phantom
      </button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className={styles.connectedWallet}>
        <div className={styles.walletInfo}>
          <Wallet size={16} />
          <span>{formatAddress(publicKey)}</span>
        </div>
        <button
          className={styles.disconnectButton}
          onClick={disconnectWallet}
          title="Disconnect Wallet"
          aria-label="Disconnect Wallet"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      className={styles.connectButton}
      onClick={connectWallet}
      disabled={connecting}
      aria-busy={connecting}
      aria-label="Connect Phantom Wallet"
    >
      {connecting ? <Loader2 size={16} className={styles.spinner} /> : <Wallet size={16} />}
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletButton;
