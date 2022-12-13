import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { RiAccountCircleLine } from "react-icons/ri";
import { Profile } from "../../atoms/profileAtom";
import { auth } from "../../firebase/clientApp";

import useProfileData from "../../src/hooks/useProfileData";

type profileHeaderProps = {
  profileData: Profile;
};

const ProfileHeader: React.FC<profileHeaderProps> = ({ profileData }) => {
  const { profileStateValue, onFollowOrUnfollowProfile, loading } =
    useProfileData();
  const isFollowed = !!profileStateValue.mySnippets.find(
    (item) => item.profileId === profileData.id
  );
  // const isFollowed = false;
  const [user] = useAuthState(auth);

  return (
    <Flex direction="column" width="100%" height="180px">
      <Box height="50%" bg="green.600" />
      <Flex
        justify="center"
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={useColorModeValue("xl", "dark-lg")}
        flexGrow={1}
      >
        <Flex width="95%" maxWidth="860px">
          {profileStateValue.currentProfile?.photoURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={profileStateValue.currentProfile?.photoURL}
              alt="Profile Image"
              position="relative"
              top={-3}
              color="green.600"
              border="2px solid white"
              objectFit="cover"
            />
          ) : (
            <Icon
              as={RiAccountCircleLine}
              fontSize={70}
              position="relative"
              top={-3}
              color="grey.300"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px" direction={{ base: "column", md: "row" }}>
            <Flex direction="column" mr={6} mb="12px">
              <Text fontWeight={800} fontSize="16pt" cursor="context-menu">
                {profileData.displayName}
              </Text>
              <Text
                fontWeight={600}
                fontSize="10pt"
                color="gray.400"
                cursor="context-menu"
              >
                @{profileData.displayName}
              </Text>
            </Flex>
            {user?.uid === profileData.id ? null : (
              <Button
                variant={isFollowed ? "outline" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                maxWidth="100px"
                isLoading={loading}
                onClick={() =>
                  onFollowOrUnfollowProfile(profileData, isFollowed)
                }
              >
                {isFollowed ? "Followed" : "Follow"}
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ProfileHeader;

function onFollowOrUnfollowProfile(
  profileData: Profile,
  isFollowed: boolean
): void {
  throw new Error("Function not implemented.");
}
