import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { Community } from "../../atoms/communitiesAtom";
import { Profile } from "../../atoms/profileAtom";
import { auth } from "../../firebase/clientApp";
import useCommunityData from "../../src/hooks/useCommunityData";

type ProfileHeaderProps = {
  profileData: Profile;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {user?.photoURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={user?.photoURL}
              alt="Community Image"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {user?.displayName}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                u/{user?.displayName}
              </Text>
            </Flex>
            <Button height="30px" pr={6} pl={6} onClick={() => {}}>
              Follow
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ProfileHeader;
