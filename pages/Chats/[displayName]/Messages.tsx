import { Flex, Icon, Menu, MenuItem, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import FriendList from "../../../components/Friends/friendList";
import PageContent from "../../../components/Layout/PageContent";

type MessagesProps = { user?: User | null };

const Messages: React.FC<MessagesProps> = ({ user }) => {
  return (
    <PageContent>
      <>
        <Flex>
          <Flex>Chat section</Flex>
        </Flex>
      </>
      <>
        <FriendList />
      </>
    </PageContent>
  );
};
export default Messages;
