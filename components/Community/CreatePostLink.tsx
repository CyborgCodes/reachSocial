import { Flex, Icon, Input, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { GiFireBottle } from "react-icons/gi";
import { IoImageOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/AuthModalAtom";
import { auth } from "../../firebase/clientApp";
import useDirectory from "../../src/hooks/useDirectory";

const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const { toggleMenuOpen } = useDirectory();

  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { communityId } = router.query;

    if (communityId) {
      router.push(`/c/${communityId}/submit`);
      return;
    }
    //open the directory menu
    toggleMenuOpen();
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg={useColorModeValue("gray.100", "gray.900")}
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor={useColorModeValue("gray.300", "gray.600")}
      p={2}
      mb={4}
    >
      <Icon as={GiFireBottle} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
        onClick={onClick}
      />
      <Icon
        as={BsLink45Deg}
        fontSize={24}
        color="gray.400"
        cursor="pointer"
        onClick={onClick}
      />
    </Flex>
  );
};
export default CreatePostLink;
