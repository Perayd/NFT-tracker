require("dotenv").config();
const { ethers } = require("ethers");

// Connect to EVM RPC
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// ERC721 ABI (minimal)
const ERC721_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
];

const contract = new ethers.Contract(
  process.env.NFT_CONTRACT,
  ERC721_ABI,
  provider
);

// 🔥 Real-time NFT transfer tracker
function trackTransfers() {
  console.log("Listening for NFT transfers...\n");

  contract.on("Transfer", (from, to, tokenId, event) => {
    console.log("NFT Transfer Detected:");
    console.log("From:", from);
    console.log("To:", to);
    console.log("Token ID:", tokenId.toString());
    console.log("Tx Hash:", event.log.transactionHash);
    console.log("---------------------------");
  });
}

// 👤 Check NFTs owned by wallet
async function getNFTsOfOwner(walletAddress) {
  const balance = await contract.balanceOf(walletAddress);
  console.log(`NFT Balance: ${balance.toString()}`);

  for (let i = 0; i < balance; i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
    console.log("Owned Token ID:", tokenId.toString());
  }
}

// Start tracker
trackTransfers();

// Example owner check
// getNFTsOfOwner("0xWalletAddressHere");
