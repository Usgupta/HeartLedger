import React, { useState, useLayoutEffect } from "react";
import RequestTable from "views/RequestTable";
import { useTheme } from "@mui/material/styles";
import FundraiserFactory from "contracts/FundraiserFactory.json";
import FundraiserContract from "contracts/Fundraiser.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
const cc = require("cryptocompare");

const ViewRequests = () => {
  const theme = useTheme();
  const [funds, setFunds] = useState([]);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [data, setData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/vfU1nY87ym-xqIkiT9wHvu6BNiYyyMcQ"
    )
  );
  const convertWeiToUsd = async (weiAmount) => {
    const ethAmount = web3.utils.fromWei(weiAmount, "ether"); // Convert Wei to ETH
    try {
      const prices = await cc.price("ETH", ["USD"]);
      const exchangeRate = prices.USD; // Get the ETH to USD exchange rate
      const usdAmount = ethAmount * exchangeRate; // Convert ETH to USD
      return parseFloat(usdAmount.toFixed(2));
      //return weiAmount;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return 0; // Return 0 or handle the error as needed
    }
  };

  useLayoutEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FundraiserFactory.networks[networkId];
        const accounts = await web3.eth.getAccounts();
        const fundsinstance = new web3.eth.Contract(
          FundraiserFactory.abi,
          deployedNetwork && deployedNetwork.address
        );

        console.log('Fund Instance:', fundsinstance,)

        setAccounts(accounts);
        const funds = await fundsinstance.methods.fundraisers(1000, 0).call();
        setFunds(funds);

        let requestData = [];

        for (const fundAddress of funds) {
          const fundContract = new web3.eth.Contract(
            FundraiserContract.abi,
            fundAddress
          );

          const fngo = await fundContract.methods.ngoAddress().call();
          console.log("fngo:", fngo);
          console.log('ad', accounts)
          // const useraddress = "0x6A0560385DeC22E29cB606e2707e1aD13Fdd7333";
          // if (fngo !== useraddress) {
          //   continue;
          // }

          const requests = await fundContract.methods.allRequests().call();
          const proj_name = await fundContract.methods.fundName().call();
          const totalDonation = await fundContract.methods
            .totalDonations()
            .call();
          console.log("[Logs] Account User:", accounts[0])
          for (let i = 0; i < requests.amounts.length; i++) {
            console.log("[Logs] NGO Address:", requests.ngoAddresses[i])
            if (requests.ngoAddresses[i] == accounts[0]) {
              requestData.push({
                projectName: proj_name,
                requestID: requests.requestID[i],
                requestedAmount: requests.amounts[i],
                requestedAmountUSD: await convertWeiToUsd(requests.amounts[i]),
                availableAmount: totalDonation,
                availableAmountUSD: await convertWeiToUsd(totalDonation),
                beneficiaryHash: requests.beneficiaries[i],
                status: requests.statuses[i],
                fundInstance: fundContract,
              });
            }
          }
        }

        setData(requestData);
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isDataLoaded ? (
        <RequestTable data={data} theme={theme} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ViewRequests;
