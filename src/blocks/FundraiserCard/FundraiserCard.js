import React, { useState, useEffect } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Stack,
  Typography,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ProjectDialog from "./components/ProjectDialog/ProjectDialog";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import FundraiserContract from "contracts/Fundraiser.json";

const cc = require("cryptocompare");

const FundraiserCard = ({ fundraiser }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [web3, setWeb3] = useState(null);
  const router = useRouter();

  const [description, setDescription] = useState(null);
  const [image, setImage] = useState("");
  const [fundName, setFundName] = useState(null);
  const [goalAmount, setGoalAmount] = useState(null);
  const [totalDonations, setTotalDonations] = useState(null);
  const [totalDonationsEth, setTotalDonationsEth] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAccount, setuserAccount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [userDonations, setUserDonations] = useState(null);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  // const [newBeneficiary, setNewBeneficiary] = useState(null);

  useEffect(() => {
    const fetchAccountAndInit = async () => {
      try {
        const provider = await detectEthereumProvider();
        if (!provider) {
          console.log("Please install MetaMask!");
          return;
        }

        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
          console.log("No accessible accounts!");
          return;
        }

        setuserAccount(accounts[0]);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccountAndInit();
  }, []); // This useEffect runs once when the component mounts

  useEffect(() => {
    if (userAccount && fundraiser) {
      init(fundraiser);
    }
  }, [userAccount, fundraiser]); // This useEffect runs when userAccount or fundraiser changes

  const init = async (fundraiser) => {
    try {
      const fund = fundraiser;
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const account = await web3.eth.getAccounts();
      // setuserAccount(account[0]);
      // if (userAccount !== null) {
      //   console.log("accounts---", userAccount);
      //   setAccountsLoaded(true);
      // } else {
      //   // Trigger alert or dialog box if account is not available
      // }

      const number = await web3.eth.getBlockNumber();

      const instance = new web3.eth.Contract(FundraiserContract.abi, fund);
      setWeb3(web3);
      setContract(instance);

      // {info or to do} why use instance inste bm    ad of contract
      // getting properties of the project
      instance.events
        .DonationReceived({
          fromBlock: number - 50,
        })
        .on("data", (event) => {
          console.log("Donation Received:", event.returnValues);
          // You can perform additional actions here if needed
        })
        .on("error", console.error);

      setFundName(await instance.methods.fundName().call());
      setImage(await instance.methods.image().call());
      setDescription(await instance.methods.description().call());
      setGoalAmount(await instance.methods.goalAmount().call());
      console.log("---------Account:---------", userAccount);
      console.log(fundName, image, description, goalAmount);
      const totalDonation = await instance.methods.totalDonations().call();
      await cc
        .price("ETH", ["USD"])
        .then((prices) => {
          exchangeRate = prices.USD;
          setExchangeRate(prices.USD);
        })
        .catch(console.error);

      const eth = web3.utils.fromWei(web3.utils.toBN(totalDonation), "ether");
      // {to change} fixed the decimal
      setTotalDonationsEth(parseFloat(eth).toFixed(4));
      const dollarDonationAmount = exchangeRate * eth;
      setTotalDonations(dollarDonationAmount.toFixed(2));

      // info of retrieving the donors donation history from Fundraiser Contract (value and date) for frontend but it is not project specific
      // {to change} add the address also
      const userDonation = await instance.methods
        .myDonations()
        .call({ from: userAccount });
      setUserDonations(userDonation);
      const isUser = userAccount;
      const isOwner = await instance.methods.owner().call();
      console.log("Owner:", isOwner);
      console.log("User:", isUser);
      if (isOwner === isUser) {
        setIsOwner(true);
        console.log("OWNER", userAccount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const setBeneficiary = async () => {
  //   await contract.methods
  //     .setBeneficiary(newBeneficiary)
  //     .send({ from: userAccount });
  //   alert(`Fundraiser Beneficiary Changed`);
  //   setOpen(false);
  // };

  const renderDonationsList = () => {
    console.log("renderDonationList is called");
    var donations = userDonations;
    if (donations === null) {
      console.log("null");
      return null;
    }
    // const totalDonations = donations.length;
    const totalDonations = donations.values.length;
    console.log("------ HELLO -----", donations);
    // console.log("donation legnth", totalDonations, donations)
    let donationList = [];
    var i;
    for (i = 0; i < totalDonations; i++) {
      const ethAmount = web3.utils.fromWei(donations.values[i], "ether");
      console.log(ethAmount, "eth amount");
      const userDonation = exchangeRate * ethAmount;
      const donationDate = donations.dates[i];
      const ngoAddress = donations.ngoAddresses[i];
      donationList.push({
        donationAmount: userDonation.toFixed(2),
        date: donationDate,
        ngoAddress: ngoAddress,
      });
      console.log("<<<<", donationList);
    }
    console.log("donationlist", donationList);
    return donationList.map((donation) => {
      console.log(
        "donationlist maping is called",
        fundName,
        donation.donationAmount,
        donation.date,
        donation.ngoAddress
      );
      const handleReceiptClick = (donation) => {
        // Use Next.js router for navigation
        console.log("donation:", donation.donationAmount);
        router.push({
          pathname: "/receipt",
          query: {
            donation: donation.donationAmount,
            date: donation.date,
            fund: fundName,
          },
        });
      };
      console.log("------ Checkpoint -----");
      return (
        <Box>
          <Typography component={"span"} fontWeight={700}>
            ${donation.donationAmount}
          </Typography>
          <Button
            startIcon={<ReceiptIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleReceiptClick(donation)}
          >
            Receipt
          </Button>
        </Box>
      );
    });
  };

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Box display={"block"} width={1} height={1}>
        <Card
          sx={{
            width: 1,
            height: 1,
            display: "flex",
            flexDirection: "column",
            boxShadow: "none",
            bgcolor: "transparent",
            backgroundImage: "none",
          }}
        >
          <CardMedia
            title={fundName}
            image={image}
            sx={{
              position: "relative",
              height: 320,
              overflow: "hidden",
              borderRadius: 2,
              filter:
                theme.palette.mode === "dark" ? "brightness(0.7)" : "none",
            }}
            onClick={() => setOpen(true)}
          >
            <Stack
              direction={"row"}
              spacing={1}
              sx={{
                position: "absolute",
                top: "auto",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: theme.palette.success.light,
                  paddingY: "4px",
                  paddingX: "8px",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant={"caption"}
                  fontWeight={700}
                  sx={{
                    color: theme.palette.common.white,

                    lineHeight: 1,
                  }}
                >
                  ${totalDonations || "0"} raised
                </Typography>
              </Box>
            </Stack>
          </CardMedia>
          <Box marginTop={1}>
            <Typography fontWeight={700}>{fundName}</Typography>
          </Box>
          <Stack marginTop={1} spacing={1} direction={"row"}>
            <Button
              color={"primary"}
              size={"large"}
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width={20}
                  height={20}
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              fullWidth
              sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
              onClick={() => setOpen(true)}
            >
              View
            </Button>
          </Stack>
        </Card>
        <ProjectDialog
          open={open}
          key={fundraiser}
          onClose={() => setOpen(false)}
          web3={web3}
          contract={contract}
          exchangeRate={exchangeRate}
          totalDonations={totalDonations}
          totalDonationsEth={totalDonationsEth}
          image={image}
          name={fundName}
          description={description}
          goalAmount={goalAmount}
          account={userAccount}
          isOwner={isOwner}
          renderDonationsList={renderDonationsList()}
              role = {sessionStorage.getItem('Role')}
        />
      </Box>
    </Grid>
  );
};

export default FundraiserCard;
