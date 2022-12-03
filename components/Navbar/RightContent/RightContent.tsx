import { Button, Flex } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { Profile } from "../../../atoms/profileAtom";
import { auth } from "../../../firebase/clientApp";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
  profileData: Profile;
};

const RightContent: React.FC<RightContentProps> = ({ user, profileData }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} profileData={profileData} />
      </Flex>
    </>
  );
};
export default RightContent;
