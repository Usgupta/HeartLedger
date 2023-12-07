import React, { useState, useLayoutEffect } from "react";
import DataTable from "views/DataTable";
import { useTheme } from "@mui/material/styles";
import FundraiserFactory from "contracts/FundraiserFactory.json";
import FundraiserContract from "contracts/Fundraiser.json";
import Web3 from "web3";
const cc = require("cryptocompare");
import detectEthereumProvider from "@metamask/detect-provider";

const AllTransactions = () => {
  const theme = useTheme();
  const [funds, setFunds] = useState([]);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [data, setData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const web3 = new Web3("wss://polygon-mumbai.g.alchemy.com/v2/vfU1nY87ym-xqIkiT9wHvu6BNiYyyMcQ");

  const convertWeiToUsd = async (weiAmount) => {
    const ethAmount = web3.utils.fromWei(weiAmount, "ether");
    try {
      const prices = await cc.price("ETH", ["USD"]);
      const exchangeRate = prices.USD;
      const usdAmount = ethAmount * exchangeRate;
      return parseFloat(usdAmount.toFixed(2));
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return 0;
    }
  };

  const init = async () => {
    // const provider = await detectEthereumProvider();
    // if (provider) {
    //   web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = FundraiserFactory.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    const fundsinstance = new web3.eth.Contract(
      FundraiserFactory.abi,
      deployedNetwork && deployedNetwork.address
    );

    console.log(fundsinstance, 'idk man')

    setAccounts(accounts);
    const funds = await fundsinstance.methods.fundraisers(1000, 0).call();
    setFunds(funds);

    funds.forEach((fundAddress) => {
      const fundContract = new web3.eth.Contract(
        FundraiserContract.abi,
        fundAddress
      );
      setContract(fundContract);

      console.log(fundAddress, 'is my')

      // Listen for DonationReceived and RequestApproved events
      let num = 0;
      fundContract.events
        .DonationReceived({ fromBlock: 0 })
        .on("data", async (event) => {
          console.log(event, "event")
          const donationData = {
            projectName: event.returnValues.fundName,
            ngoName: event.returnValues.ngoAddress,
            sendOrRecAddr: event.returnValues.donor,
            amount: await convertWeiToUsd(event.returnValues.value),
            type: "Donation",
            date: new Date(event.returnValues.date * 1000).toLocaleString()

          };
          setData((prevData) => [...prevData, donationData]);
        })
        .on("error", console.error);

      fundContract.events
        .RequestApproved({ fromBlock: 0 })
        .on("data", async (event) => {
          const requestApprovedData = {
            projectName: event.returnValues.fundName,
            ngoName: event.returnValues.ngoAddress,
            sendOrRecAddr: event.returnValues.beneficiary,
            amount: await convertWeiToUsd(event.returnValues.value),
            type: "Beneficiary Aid",
            date: new Date(event.returnValues.date * 1000).toLocaleString()
          };
          setData((prevData) => [...prevData, requestApprovedData]);
        })
        .on("error", console.error);
    });

    setIsDataLoaded(true);
    // } else {
    //   console.error("Ethereum provider not found");
    // }
  };

  useLayoutEffect(() => {
    init();
  }, []);

  return (
    <div>
      {isDataLoaded ? (
        <DataTable data={data} theme={theme} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AllTransactions;
