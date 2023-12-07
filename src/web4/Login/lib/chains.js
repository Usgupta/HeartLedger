const supportedChains = [
  {
    name: "Polygon Mumbai",
    short_name: "matic",
    chain: "MATIC",
    network: "mumbai",
    chain_id: 80001,
    network_id: 80001,
    rpc_url:
      "https://polygon-mumbai.g.alchemy.com/v2/vfU1nY87ym-xqIkiT9wHvu6BNiYyyMcQ",
    native_currency: {
      symbol: "MATIC",
      name: "MATIC",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "Polygon",
    short_name: "matic",
    chain: "MATIC",
    network: "mumbai",
    chain_id: 137,
    network_id: 137,
    rpc_url: "https://polygon-rpc.com/",
    native_currency: {
      symbol: "MATIC",
      name: "MATIC",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
];

export default supportedChains;
