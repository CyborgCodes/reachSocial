import { Flex } from "@chakra-ui/react";
import React from "react";
import AuthButtons from "../Navbar/RightContent/AuthButtons";

const LoginPage: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      minWidth="270px"
    >
      Please Log-in or Sign-up to Continue
      <Flex mt={4}>
        <AuthButtons />
      </Flex>
    </Flex>
  );
};
export default LoginPage;
