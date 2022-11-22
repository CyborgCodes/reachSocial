import { Flex, Icon } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsChatDots } from "react-icons/bs";
import { IoNotificationsOutline } from "react-icons/io5";
import { auth } from "../../../firebase/clientApp";

const icons: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  return (
    <Flex>
      <>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
          onClick={() => router.push(`/Chats/${user?.displayName}/Messages`)}
        >
          <Icon as={BsChatDots} fontSize={20} />
        </Flex>

        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={IoNotificationsOutline} fontSize={20} />
        </Flex>
      </>
    </Flex>
  );
};
export default icons;
