import { Flex, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoNotificationsOutline } from "react-icons/io5";
import { auth } from "../../../firebase/clientApp";

const icons: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  return (
    <Flex>
      {/* <>
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
      </> */}
    </Flex>
  );
};
export default icons;
