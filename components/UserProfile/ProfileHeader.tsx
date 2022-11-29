import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { Community } from "../../atoms/communitiesAtom";
import { Profile } from "../../atoms/profileAtom";
import { auth } from "../../firebase/clientApp";
import useCommunityData from "../../src/hooks/useCommunityData";

type profileHeaderProps = {
  profileData: Profile;
};

const ProfileHeader: React.FC<profileHeaderProps> = ({ profileData }) => {
  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {profileData.photoURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={profileData.photoURL}
              alt="Profile Image"
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
                {profileData.displayName}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                @{profileData.displayName}
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
