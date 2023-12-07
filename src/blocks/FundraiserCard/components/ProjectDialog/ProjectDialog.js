import React, { useState } from "react";
import PropTypes from "prop-types";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Dialog,
  Stack,
  Typography,
  Button,
  IconButton,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Collapse,
  Alert,
} from "@mui/material";
import {
  Favorite,
  ManageAccounts,
  CurrencyExchange,
  Close,
} from "@mui/icons-material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DialogBox from "blocks/DialogBox";
import { LoadingButton } from "@mui/lab";

const ProjectDialog = ({
  onClose,
  open,
  web3,
  contract,
  account,
  exchangeRate,
  image,
  name,
  description,
  goalAmount,
  totalDonations,
  totalDonationsEth,
  withdrawFunds,
  isOwner,
  renderDonationsList,
  role

}) => {
  const theme = useTheme();
  const [amount, setAmount] = useState(5);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingDonate, setLoadingDonate] = useState(false);
  const [isRequest, setisRequest] = useState(false);
  const [isDonate, setisDonate] = useState(false);
  const [hash, setHash] = useState("");
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [loginState, setLoginState] = useState("")

  console.log('goals',goalAmount)



  const submitFunds = async () => {
    // const loginstate = sessionStorage.getItem('Role')
    // console.log(sessionStorage)
    // setLoginState(loginstate)
    setLoadingDonate(true);
    setisDonate(true);
    const ethTotal = amount / exchangeRate;
    const donation = web3.utils.toWei(ethTotal.toString());
    try {
      const Transaction = await contract.methods.donate().send({
        from: account,
        value: donation,
        gas: 650000,
      });
      console.log("[Logs]Transaction:", Transaction);
      setHash(Transaction.transactionHash);
      setDialogBoxOpen(true);
      setAlertOpen(true);
    } catch (error) {
      console.log(error);
      alert("Error donating");
      setLoadingDonate(false);
    }
    setLoadingDonate(false);
  };
  const requestFunds = async () => {

    setLoadingRequest(true);
    setisRequest(true);
    const ethTotal = amount / exchangeRate;
    const request = web3.utils.toWei(ethTotal.toString());
    try {
      const requestTransaction = await contract.methods
        .createRequest(account, request)
        .send({
          from: account,
          gas: 650000,
        });
      console.log("[Logs]requestTransaction:", requestTransaction);
      setHash(requestTransaction.transactionHash);
      setDialogBoxOpen(true);
      setAlertOpen(true);
    } catch (error) {
      console.log(error);
      alert("Error donating");
      setLoadingRequest(false);
    }
    setLoadingRequest(false);
  };
  return (

    <Dialog onClose={onClose} open={open} maxWidth={"lg"}>
      <Box paddingY={{ xs: 1, sm: 2 }} paddingX={{ xs: 2, sm: 4 }}>
        <Box
          paddingY={{ xs: 1, sm: 2 }}
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <Box
            component={"svg"}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width={24}
            height={24}
            onClick={onClose}
            sx={{ cursor: "pointer" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </Box>
        </Box>
        <Box paddingY={2}>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Box>
                <Box
                  sx={{
                    width: 1,
                    height: "auto",
                    "& img": {
                      width: 1,
                      height: 1,
                      objectFit: "cover",
                      borderRadius: 2,
                    },
                  }}
                >
                  <img src={image} alt={name} />
                </Box>
                {/* {renderDonationsList} */}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box
                  padding={1}
                  display={"inline-flex"}
                  borderRadius={1}
                  bgcolor={theme.palette.success.light}
                  marginBottom={1}
                >
                  <Typography sx={{ color: "common.white", lineHeight: 1 }}>
                    Goal: ${goalAmount}
                  </Typography>
                </Box>
                <Typography variant={"h5"} fontWeight={700} gutterBottom>
                  {name}
                </Typography>
                <Typography variant={"subtitle2"}>{description}</Typography>
                <Box
                  marginTop={2}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  {/* <Typography>
                    Raised:{" "}
                    <Typography component={"span"} fontWeight={700}>
                      ${totalDonations || 0} ≈ {totalDonationsEth} ETH
                    </Typography>
                  </Typography> */}

                  {/* <Box
                    display={"flex"}
                    alignItems={"center"}
                    padding={1}
                    borderRadius={1}
                    bgcolor={theme.palette.error.light}
                  >
                    <Typography
                      variant={"caption"}
                      sx={{ color: "common.white" }}
                      marginLeft={0.5}
                    >
                      Required: $
                      {totalDonations > goalAmount
                        ? goalAmount - totalDonations
                        : 0}
                    </Typography>
                  </Box> */}
                </Box>
                <Box marginTop={2}>

                  {/* <Typography>
                    Donate:
                    <Typography component={"span"} fontWeight={700}>
                      ${amount} ≈ {parseFloat(amount / exchangeRate).toFixed(4)}{" "}
                      ETH
                    </Typography>
                  </Typography> */}

                  <Stack
                    marginTop={1}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                  >
                    {[10, 15, 20].map((item) => (
                      <Box
                        key={item}
                        onClick={() => setAmount(item)}
                        sx={{
                          borderRadius: 1,
                          padding: 1,
                          border: `2px solid ${amount === item
                            ? theme.palette.primary.main
                            : theme.palette.divider
                            }`,
                          cursor: "pointer",
                        }}
                      >
                        <Typography>${item}</Typography>
                      </Box>
                    ))}
                    <FormControl variant="standard">
                      <InputLabel htmlFor="standard-adornment-amount">
                        Amount
                      </InputLabel>
                      <Input
                        id="standard-adornment-amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">$</InputAdornment>
                        }
                      />
                    </FormControl>
                  </Stack>
                </Box>
                <Stack
                  marginTop={3}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                >
                  {role === '0' ? (
                    <LoadingButton
                      variant={"contained"}
                      color={"primary"}
                      size={"large"}
                      startIcon={<Favorite />}
                      loading={loadingDonate}
                      onClick={submitFunds}
                      fullWidth
                    >
                      Donate
                    </LoadingButton>) : null}

                  {role === '1' ? (
                    <LoadingButton
                      variant={"contained"}
                      color={"primary"}
                      size={"large"}
                      startIcon={<MonetizationOnIcon />}
                      loading={loadingRequest}
                      onClick={requestFunds}
                      fullWidth
                    >
                      Request
                    </LoadingButton>) : null}
                  {/* {isOwner && (
                    <Button
                      color={"primary"}
                      startIcon={<CurrencyExchange />}
                      size={"large"}
                      fullWidth
                      sx={{
                        bgcolor: alpha(theme.palette.primary.light, 0.1),
                      }}
                      onClick={withdrawFunds}
                    >
                      {" "}
                      Withdraw
                    </Button>
                  )} */}
                </Stack>
                {isRequest && (
                  <DialogBox
                    open={dialogBoxOpen}
                    onClose={() => {
                      setDialogBoxOpen(false);
                      setisRequest(false); // This line sets isRequest to false when DialogBox is closed
                    }}
                    title={"Thank you!"}
                    message={`Request successful with transaction hash: ${hash}`}
                    buttonText="View on polygonscan"
                    buttonLink={`https://mumbai.polygonscan.com/tx/${hash}`}
                  />
                )}
                {isDonate && (
                  <DialogBox
                    open={dialogBoxOpen}
                    onClose={() => {
                      setDialogBoxOpen(false);
                      setisDonate(false); // This line sets isRequest to false when DialogBox is closed
                    }}
                    title={"Thank you!"}
                    message={`Donation successful with transaction hash: ${hash}`}
                    buttonText="View on polygonscan"
                    buttonLink={`https://mumbai.polygonscan.com/tx/${hash}`}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

ProjectDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  web3: PropTypes.object,
  account: PropTypes.string,
  contract: PropTypes.object,
  exchangeRate: PropTypes.number,
  totalDonations: PropTypes.string,
  totalDonationsEth: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  goalAmount: PropTypes.number,
  renderDonationsList: PropTypes.func,
};

export default ProjectDialog;
