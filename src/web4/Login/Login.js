import {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useLayoutEffect,
} from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Account from "./components/Account";
import { ellipseAddress, getChainData } from "./lib/utilities";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";
const ethers = require("ethers");
import React from "react";
import detectEthereumProvider from "@metamask/detect-provider";


import Web3Modal from "web3modal";
const contractAddress = "0x9F8AD91Fa30B00679be1FEfD621c1de25fE23B9a";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isUserRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserRole",
    "outputs": [
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "enum UserAccessControl.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "setUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function storeUserAddress(walletAddress, role, provider) {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Parse the role based on the enum UserRole
  let parsedRole;
  console.log("The role is", role);
  if (role.toLowerCase() === "beneficiary") {
    parsedRole = 1;
  } else if (role.toLowerCase() === "donor") {
    parsedRole = 0;
  } else if (role.toLowerCase() === "ngo") {
    parsedRole = 2;
  } else {
    console.error("Invalid role");
    return;
  }

  try {
    // Check if the user is registered
    const isRegistered = await contract.isUserRegistered(walletAddress);

    if (!isRegistered) {
      // If not registered, call the smart contract to register
      const transaction = await contract.setUser(walletAddress, parsedRole);
      await transaction.wait();
      console.log(`User registered: ${walletAddress} with role: ${parsedRole}`);
    } else {
      const role = await contract.getUserRole(walletAddress);
      console.log(`User already registered: ${walletAddress}`);
      console.log("The user is alreadt registssered with role:", role);
      sessionStorage.setItem("Address", walletAddress);
      sessionStorage.setItem("Role", role);
      sessionStorage.setItem("IsLoggedIn", true)
      console.log(sessionStorage);
    }
  } catch (error) {
    console.error("Error storing user address:", error);
  }
}
export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.INFURA_API_KEY, // required
    },
  },
};
let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mumbai", // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "RESET_WEB3_PROVIDER":
      return initialState;
    default:
      throw new Error();
  }
}

export const Login = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, address, chainId } = state;
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checklogin, setChecklogin] = useState('');
  // const [nric, setNric] = useState('');
  const connect = useCallback(
    async function () {
      if (role) {
        try {
          const provider = await web3Modal.connect();
          const web3Provider = new providers.Web3Provider(provider);
          const signer = web3Provider.getSigner();
          const address = await signer.getAddress();
          const network = await web3Provider.getNetwork();

          console.log(role);
          console.log(role, address);
          await storeUserAddress(address, role, web3Provider);

          dispatch({
            type: "SET_WEB3_PROVIDER",
            provider,
            web3Provider,
            address,
            chainId: network.chainId,
          });
          window.location.reload();
        } catch (error) {
          alert(error.message);
        }
      }
    },
    [role]
  );

  useEffect(() => {
    if (submitting) {
      connect();
    }
  }, [submitting, connect]);

  const RoleDialog = React.memo(() => {
    const handleSubmit = () => {
      setSubmitting(true);
      setShowRoleDialog(false)
    };

    return (
      <Dialog
        open={showRoleDialog}
        onClose={() => setShowRoleDialog(false)}
        style={{ width: "80%", height: "70%", margin: "auto" }}
      >
        <DialogTitle>Registration</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            {["Donor", "Beneficiary", "NGO"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit and Connect</Button>
        </DialogActions>
      </Dialog>
    );
  });

  const disconnect = useCallback(

    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
      setAnchorEl(null);
      sessionStorage.setItem("Address", " ")
      sessionStorage.setItem("Role", "3")
      const ROLE1 = sessionStorage.getItem('Role')
      setChecklogin(ROLE1)
      // sessionStorage.setItem("isLoggedIn", false)
      console.log(sessionStorage)
      window.location.reload();
    },
    [provider]
  );

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    const ROLE = sessionStorage.getItem('Role')
    setChecklogin(ROLE)
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log("accountsChanged", accounts);
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const chainData = getChainData(chainId);
  const handleOpenRoleDialog = () => {
    setShowRoleDialog(true);
  };

  return (
    <div className="container" >
      {checklogin === '0' || checklogin === '1' || checklogin === '2' ? (
        <Account
          icon="https://firebasestorage.googleapis.com/v0/b/virtualground-meta.appspot.com/o/nft%2Ficon.png?alt=media&token=51904b60-2b20-47aa-9502-67f4aabc8061"
          address={ellipseAddress(address)}
          handleLogout={disconnect}
        />
      ) : (
        <IconButton
          color="primary"
          onClick={handleOpenRoleDialog}
          size="medium"
        >
          <AccountBalanceWalletIcon fontSize="large" />
        </IconButton>
      )}
      <RoleDialog />
    </div>
  );
};

export default Login;
