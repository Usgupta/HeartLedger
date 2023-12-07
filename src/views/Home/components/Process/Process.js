/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const mock = [
  {
    title: 'Donors',
    subtitle: 'Donate and view how your money has been used',
    icon: <CurrencyBitcoinIcon />,
  },
  {
    title: 'NGOs',
    subtitle: 'Accept donations and disburse funds to beneficiaries',
    icon: <AccountBalanceIcon />,
  },
  {
    title: 'Beneficiaries',
    subtitle: 'Request for funds from a specific campaign',
    icon: <VolunteerActivismIcon />,
  },
];

const Process = () => {
  const theme = useTheme();
  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          variant={'h6'}
          component={'p'}
          color={'text.secondary'}
          align={'center'}
        >
          {/* Our goal is to create a space that makes donations more transparent */}
          <br />
          {/* Using the new potential of the world of cryptocurrencies. */}
        </Typography>
      </Box>
      <Box>
        <Grid container spacing={4}>
          {mock.map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                display={'flex'}
                flexDirection={'column'}
                data-aos={'fade-up'}
                data-aos-delay={i * 100}
                data-aos-offset={100}
                data-aos-duration={600}
              >
                <Box
                  component={Avatar}
                  width={80}
                  height={80}
                  marginBottom={2}
                  bgcolor={alpha(theme.palette.primary.main, 0.1)}
                  color={theme.palette.primary.main}
                  variant={'rounded'}
                  borderRadius={2}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant={'h5'}
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.subtitle}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Process;
