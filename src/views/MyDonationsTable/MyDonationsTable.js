import React, { useEffect, useState } from 'react';
import Main from 'layouts/Main';
import Container from 'components/Container';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';


const MyDonationsTable = ({ data }) => {
  // const [data1, setData] = useState([]);
  // setData(data)
  console.log('i got hs', data)
  console.log('my lenght', data.length)
  const [ngoFilter, setNgoFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  // useEffect(()=>{

  // },[data1])

  // Function to filter data based on NGO and project name
  // Function to filter and sort data based on Project Name and Date
  const filteredAndSortedData = data
    .filter((row) => row.projectName.toLowerCase().includes(projectFilter.toLowerCase()) || projectFilter === '')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  return (
    <Main>
      <Container>
        {/* Filter input fields */}
        {/* <TextField
          label="Filter by NGO"
          value={ngoFilter}
          onChange={(e) => setNgoFilter(e.target.value)}
          margin="normal"
        /> */}
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
                <TableCell>Date</TableCell>
                <TableCell>Project Name</TableCell>
                {/* <TableCell>NGO Name</TableCell> */}
                <TableCell>Amount</TableCell>
                {/* <TableCell>Donor/Beneficiary Address</TableCell> */}
                {/* <TableCell>Type</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.projectName}</TableCell>
                  {/* <TableCell>{row.ngoName}</TableCell> */}
                  {/* <TableCell style={{ color: row.type === 'Donation' ? 'green' : 'red' }}> */}
                  {/* {row.amount} */}
                  {/* </TableCell> */}
                  <TableCell>{row.amount}</TableCell>
                  {/* <TableCell>{row.type}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Main>
  );
};

export default MyDonationsTable;

