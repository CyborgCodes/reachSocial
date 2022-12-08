import { Flex } from "@chakra-ui/react";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Please log-in or sign-up to continue
    </Flex>
  );
};
export default LoginPage;
