# ⚡ SmartGen

**SmartGen** est une plateforme "No-Code" puissante de **Génération de Smart Contracts**. Elle permet à quiconque de générer, déployer et gérer des contrats intelligents sécurisés sur Ethereum et les chaînes compatibles EVM.

🚀 **Déployez des contrats en quelques secondes (ERC20, ERC721, DAO) sans écrire une seule ligne de Solidity.**

## ✨ Fonctionnalités

### 🏭 Générateur de Smart Contracts
- **Tokens ERC20** : Créez des tokens standards avec options de **Max Supply (Capped)**, Premint, et Burnable.
- **Collections NFT (ERC721)** : Lancez des séries NFT avec :
    - **Royalties (EIP-2981)** : Touchez des revenus récurrents sur les ventes secondaires.
    - **Whitelist** : Système de liste blanche intégré pour les mints privés.
    - **URI Storage** : Intégration facile des métadonnées.
- **Multi-Token (ERC1155)** : Idéal pour les jeux (Items/Éditions) ou les collections mixtes.
- **DAO** : Déployez des contrats de Gouvernance (Governor) pour la gouvernance on-chain (Vote, Quorum, Timelock).

### 🎛️ Tableau de Bord Admin (V2/V3)
Gérez vos contrats déployés directement depuis une interface unifiée :
- **Analytics** : Suivi en temps réel de la **Total Supply**, de la **Balance du Contrat** et du Propriétaire.
- **Contrôles Admin** :
    - **Mint/Burn** : Émettez de nouveaux tokens ou détruisez-les.
    - **Pause/Unpause** : Fonctionnalité d'arrêt d'urgence.
    - **Retrait (Withdraw)** : Récupérez les fonds (ETH) accumulés par les ventes.
    - **Gestion Whitelist** : Ajoutez/Retirez des adresses de votre liste blanche NFT.
- **Vérification Automatique** : Vérifiez votre contrat sur Etherscan en 1 clic directement depuis le dashboard.
- **Visionneuse de Code Source** : Régénérez et visualisez instantanément le code source de votre contrat pour une vérification facile sur Etherscan.

### 🛠️ Outils & Launchpad (V5)
- **Mint Page** : Une page publique prête à l'emploi pour vendre vos NFT (`/mint`).
- **Airdrop** : Distribuez vos tokens à une liste d'adresses en quelques clics.
- **Vesting** : Créez des contrats de blocage de tokens pour votre équipe ou vos investisseurs.
- **Support Multi-Chain** : Déployez nativement sur **Ethereum Mainnet, Sepolia, Polygon, Base et Arbitrum**.
- **Assistant IPFS** : Générez et prévisualisez les métadonnées NFT standards (JSON) prêtes à être uploadées sur IPFS (via Pinata ou autre).

## 🏗️ Stack Technique
- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Style** : [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Blockchain** :
    - [Wagmi](https://wagmi.sh/) : React Hooks pour Ethereum.
    - [RainbowKit](https://www.rainbowkit.com/) : La meilleure connexion de wallet.
    - [Viem](https://viem.sh/) : Interface TypeScript bas niveau pour Ethereum.
- **Smart Contracts** : Basés sur les standards éprouvés d'[OpenZeppelin](https://www.openzeppelin.com/).

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Un Wallet Ethereum (MetaMask, Rainbow, etc.)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votreusername/smartgen.git
   cd smartgen
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer l'Environnement**
   Créez un fichier `.env` à la racine (copiez `.env.example` s'il existe) et ajoutez votre Project ID WalletConnect :
   ```env
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=votre_project_id_ici
   NEXT_PUBLIC_RECEIVER_ADDRESS=votre_adresse_eth_ici
   ```
   > Vous pouvez obtenir un Project ID gratuitement sur [WalletConnect Cloud](https://cloud.walletconnect.com/).

4. **Lancer le Serveur de Développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir le Navigateur**
   Rendez-vous sur [http://localhost:3000](http://localhost:3000).

## 📖 Guide d'Utilisation
1. **Connecter le Wallet** : Cliquez sur le bouton de connexion en haut à droite.
2. **Choisir le Réseau** : Sélectionnez votre chaîne cible (ex: Sepolia pour tester).
3. **Générer** : Allez sur la page Générateur, choisissez votre standard (ERC20/721), configurez les options (Nom, Symbole, Cap, Royalties...), et cliquez sur "Deploy".
4. **Gérer** : Une fois déployé, allez sur le **Dashboard** pour voir votre contrat. Utilisez le bouton **Gérer** pour accéder aux contrôles Admin, Whitelist et Analytics.

## 🛡️ Sécurité
Les contrats générés par SmartGen utilisent des implémentations OpenZeppelin standard et auditées. Cependant, auditez toujours vos contrats avant de déployer des fonds importants sur le Mainnet.

## 📄 Licence
Ce projet est sous licence MIT.
