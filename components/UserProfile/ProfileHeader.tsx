import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { collection, doc, getDoc } from "firebase/firestore";
import { Router, useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { Community } from "../../atoms/communitiesAtom";
import { Profile, profileState } from "../../atoms/profileAtom";
import { auth, firestore } from "../../firebase/clientApp";
import useProfileData from "../../src/hooks/useProfileData";

type profileHeaderProps = {
  profileData: Profile;
};

const ProfileHeader: React.FC<profileHeaderProps> = ({ profileData }) => {
  const {
    profileStateValue,
    onFollowOrUnfollowProfile,
    loading,
    followProfile,
    unfollowProfile,
  } = useProfileData();
  const [user] = useAuthState(auth);
  const [following, setFollowing] = useState(false);
  const isFollowed = true;

  const onFollow = () => {
    followProfile(profileData);
    setFollowing(true);
  };

  const onUnfollow = () => {
    unfollowProfile(profileData.id);
    setFollowing(false);
  };

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {profileStateValue.currentProfile?.photoURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={profileStateValue.currentProfile?.photoURL}
              alt="Profile Image"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              objectFit="cover"
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
            {/* <Button
              variant={isFollowed ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onFollowOrUnfollowProfile(profileData, isFollowed)}
            >
              {isFollowed ? "Followed" : "Follow"}
            </Button> */}
            {following ? (
              <Button
                variant={"outline"}
                height="30px"
                pr={6}
                pl={6}
                isLoading={loading}
                onClick={() => onUnfollow()}
              >
                Followed
              </Button>
            ) : (
              <Button
                variant={"solid"}
                height="30px"
                pr={6}
                pl={6}
                isLoading={loading}
                onClick={() => onFollow()}
              >
                Follow
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
