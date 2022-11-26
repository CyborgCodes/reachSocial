import {
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { getAuth, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { GetServerSidePropsContext } from "next";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { useSetRecoilState } from "recoil";
import { Profile, profileState } from "../../atoms/profileAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useDirectory from "../../src/hooks/useDirectory";

type userProfileItemProps = {
  loading?: boolean;
  profileData: Profile;
};

const UserProfileItem: React.FC<userProfileItemProps> = ({
  loading,
  profileData,
}) => {
  const { toggleMenuOpen } = useDirectory();
  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid;
  }

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
      await updateDoc(doc(firestore, "users"), {
        photoURL: profileImgURL,
      });
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
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="50px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" direction="column" mb={2}>
          {user?.photoURL ? (
            <Image src={user?.photoURL} />
          ) : (
            <Icon as={VscAccount} fontSize={50} color="" mr={2} />
          )}
          <Text fontWeight={600}>{user?.displayName}</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reach frontpage, built for you.
          </Text>
          <Button height="30px" onClick={toggleMenuOpen}>
            Create Post
          </Button>
        </Stack>
        <Divider />
        <Stack fontSize="10pt" spacing={1}>
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
                boxSize="40px"
                src={selectedFile || profileData?.photoURL}
                alt="Profile Image"
              />
            ) : (
              <Icon as={FaReddit} fontSize={40} color="brand.100" mr={2} />
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
      </Flex>
    </Flex>
  );
};

export default UserProfileItem;
