import { Menu, MenuItem, Icon, Flex, Text } from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const friendList = () => {
  return (
    <Menu>
      <MenuItem
        border="gray.400"
        justifyContent="space-between"
        bg="white"
        borderRadius="4px 4px 0px 0px"
      >
        <Text>Hello</Text>
        <Flex>
          <Flex mr={2}>
            <Icon as={MdOutlineAddCircleOutline} fontSize={22} />
          </Flex>
          <Flex>
            <Icon as={IoMdCloseCircleOutline} fontSize={22} />
          </Flex>
        </Flex>
      </MenuItem>
      <MenuItem
        border="gray.400"
        justifyContent="space-between"
        bg="white"
        borderRadius="0px 0px 4px 4px"
      >
        Hope
        <Flex>
          <Flex mr={2}>
            <Icon as={MdOutlineAddCircleOutline} fontSize={22} />
          </Flex>
          <Flex>
            <Icon as={IoMdCloseCircleOutline} fontSize={22} />
          </Flex>
        </Flex>
      </MenuItem>
    </Menu>
  );
};
export default friendList;
