import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  return (
    <Flex bg="white" height="44px" padding="6px 12px">
      <Flex align="center">
        <Image src="" height="30px" />
      </Flex>
      {/*<Directory />*/}
      <SearchInput />
      <RightContent />
    </Flex>
  );
};
export default Navbar;
