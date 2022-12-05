import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GiFireBottle } from "react-icons/gi";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { Profile, profileState } from "../../atoms/profileAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useDirectory from "../../src/hooks/useDirectory";
import useProfileData from "../../src/hooks/useProfileData";
import { updateProfile } from "firebase/auth";

type userProfileItemProps = {
  loading?: boolean;
  profileData: Profile;
};

const UserProfileItem: React.FC<userProfileItemProps> = ({
  loading,
  profileData,
}) => {
  const { toggleMenuOpen } = useDirectory();
  const [user] = useAuthState(auth);
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const setProfileStateValue = useSetRecoilState(profileState);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const updateImage = async () => {
    if (!selectedFile) return;
    setImageLoading(true);
    try {
      const imageRef = ref(storage, `users/${user?.uid}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const profileImgURL = await getDownloadURL(imageRef);
      await updateDoc(
        doc(
          firestore,
          `users/${profileData?.id}/profileSnippets`,
          profileData.id
        ),
        {
          photoURL: profileImgURL,
        }
      );
      console.log("HERE IS THE PROFILE PIC URL", profileImgURL);

      setProfileStateValue((prev) => ({
        ...prev,
        currentProfile: {
          ...prev.currentProfile,
          photoURL: profileImgURL,
        } as Profile,
      }));
    } catch (error: any) {
      console.log("update profile image error", error.message);
    }
    setImageLoading(false);
  };

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
        align="center"
        justify="space-between"
        color="white"
        p={3}
        bg="green.600"
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          User Profile
        </Text>
      </Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" direction="column" mb={2}>
          {user?.uid === profileData?.id && (
            <Box
              bg="gray.100"
              width="100%"
              p={2}
              borderRadius={4}
              border="1px solid"
              borderColor="gray.300"
              cursor="pointer"
              mb={3}
            >
              <Text fontSize="9pt" fontWeight={700} color="blue.500">
                Add description
              </Text>
            </Box>
          )}
        </Flex>
        <Flex width="100%" p={2} fontWeight={600} fontSize="10pt">
          <Flex direction="row" flexGrow={1}>
            <Text mr={2}>
              {profileData?.numberOfFollowers?.toLocaleString()}
            </Text>
            <Text>Followers</Text>
          </Flex>
        </Flex>
        <Divider mb={3} />
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reach Profile, built for you.
          </Text>
          <Button height="30px" onClick={toggleMenuOpen} mt={3}>
            Create Post
          </Button>
        </Stack>
        {user?.uid === profileData?.id && (
          <>
            <Divider mt={3} />
            <Stack fontSize="10pt" spacing={1} mt={3}>
              <Flex align="center" justify="space-between">
                <Text
                  color="blue.500"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => selectFileRef.current?.click()}
                >
                  Change Image
                </Text>
                {profileData?.photoURL || selectedFile ? (
                  <Image
                    borderRadius="full"
                    objectFit="cover"
                    boxSize="40px"
                    src={selectedFile || profileData?.photoURL}
                    alt="Dan Abramov"
                  />
                ) : (
                  <Icon
                    as={GiFireBottle}
                    fontSize={40}
                    color="green.400"
                    mr={2}
                  />
                )}
              </Flex>
              {selectedFile &&
                (imageLoading ? (
                  <Spinner />
                ) : (
                  <Text cursor="pointer" onClick={updateImage}>
                    Save Changes
                  </Text>
                ))}
              <input
                id="file-upload"
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                hidden
                ref={selectFileRef}
                onChange={onSelectImage}
              />
            </Stack>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default UserProfileItem;
