import React from "react";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import { GiFireBottle } from "react-icons/gi";
import useDirectory from "../../src/hooks/useDirectory";

const PersonalHome: React.FC = () => {
  const { toggleMenuOpen } = useDirectory();
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="green.600"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={GiFireBottle} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reach frontpage, built for you.
          </Text>
          <Button height="30px" onClick={toggleMenuOpen}>
            Create Post
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default PersonalHome;
