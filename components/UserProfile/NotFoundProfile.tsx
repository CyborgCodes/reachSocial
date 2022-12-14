import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const NotFoundProfile: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Sorry, that profile does not exist or has been deleted
      <Link href="/">
        <Button mt={4}>GO HOME</Button>
      </Link>
    </Flex>
  );
};
export default NotFoundProfile;
