import React, { useState } from "react";
import Main from "layouts/Main";
import Container from "components/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FundraiserContract from "contracts/Fundraiser.json";
const cc = require("cryptocompare");
import Web3 from "web3";
import { Web } from "@mui/icons-material";
import { useRouter } from "next/router"; // Use useRouter from Next.js
import detectEthereumProvider from "@metamask/detect-provider";

const RequestTable = ({ data }) => {
  const [projectFilter, setProjectFilter] = useState("");
  const [approvalStatus, setApprovalStatus] = useState({});
  const router = useRouter(); // Use useRouter for page navigation

  const filteredData = data.filter((row) => {
    console.log("Data:", row.status);
    const projectMatch =
      row.projectName.toLowerCase().includes(projectFilter.toLowerCase()) ||
      projectFilter === "";

    return projectMatch;
  });

  const handleApprove = async (row) => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        console.log("Please install MetaMask!");
        return;
      }
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        FundraiserContract.abi,
        row.fundInstance._address
      );

      console.log("Row Request ID", row.requestID);
      let requestID = row.requestID;

      // Use the first account to send the transaction
      const fromAddress = accounts[0];

      //Estimate Gas (optional step for better UX)
      const gasEstimate = await contract.methods
        .approveRequest(row.requestID)
        .estimateGas({ from: fromAddress });

      const receipt = await contract.methods
        .approveRequest(row.requestID)
        .send({
          from: fromAddress,
          gas: gasEstimate,
        });
      router.reload();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (row) => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        console.log("Please install MetaMask!");
        return;
      }
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        FundraiserContract.abi,
        row.fundInstance._address
      );

      console.log("Row Request ID", row.status);
      let requestID = row.requestID;

      const fromAddress = accounts[0];

      // Use the first account to send the transaction
      const gasEstimate = await contract.methods
        .rejectRequest(row.requestID)
        .estimateGas({ from: fromAddress });

      const receipt = await contract.methods.rejectRequest(row.requestID).send({
        from: fromAddress,
        gas: gasEstimate,
      });
      router.reload();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <Main>
      <Container>
        <TextField
          label="Filter by Project Name"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          margin="normal"
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Names</TableCell>
                <TableCell>Requested Amount</TableCell>
                <TableCell>Total Donated Amount</TableCell>
                <TableCell>Beneficiary Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.projectName}</TableCell>
                  <TableCell>${row.requestedAmountUSD}</TableCell>
                  <TableCell>${row.availableAmountUSD}</TableCell>
                  <TableCell>{row.beneficiaryHash}</TableCell>
                  <TableCell>
                    {row.status == 0 && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprove(row)}
                          sx={{ marginRight: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleReject(row)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {row.status == 1 && (
                      <CheckCircleOutlineIcon sx={{ color: "success.main" }} />
                    )}
                    {row.status == 2 && (
                      <HighlightOffIcon sx={{ color: "error.main" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Main>
  );
};

export default RequestTable;
