import React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Main from "layouts/Main";
import Container from "components/Container";
import Newsletter from "components/Newsletter";
import FundraiserGrid from "./components/FundraiserGrid";
import Hero from "components/Hero";
import Process from "./components/Process";

const Home = () => {
  const theme = useTheme();

  return (
    <Main>
      <Container>
        <Hero
          image={
            "https://images.unsplash.com/photo-1515890435782-59a5bb6ec191?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          // title={'Fund a project!'}
          heading={"Raise funds and make donations in MATIC"}
          subtitle={
            "Our goal is to create a space that makes donations more transparent using the new potential of blockchain"
          }
        />
      </Container>
      {/* <Container>
        <Hero />
      </Container> */}
      <Container paddingY={3}>
        <Process />
      </Container>
      <Container>
        <FundraiserGrid />
      </Container>
      <Box
        position={"relative"}
        marginTop={{ xs: 4, md: 6 }}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 1,
          }}
        >
          <path
            fill={theme.palette.alternate.main}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
        {/* <Container>
          <Newsletter />
        </Container> */}
      </Box>
    </Main>
  );
};

export default Home;
