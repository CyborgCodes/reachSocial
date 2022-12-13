import {
  Box,
  Flex,
  Icon,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { defaultMenuItem } from "../../atoms/directoryMenuAtom";
import { Profile } from "../../atoms/profileAtom";
import { auth } from "../../firebase/clientApp";
import useDirectory from "../../src/hooks/useDirectory";
import { GiFireBottle } from "react-icons/gi";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

type NavbarProps = {
  profileData: Profile;
};

const Navbar: React.FC<NavbarProps> = ({ profileData }) => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  return (
    <Flex
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={useColorModeValue("xl", "dark-lg")}
      height="44px"
      position="fixed"
      width="100%"
      zIndex="100"
      padding="6px 12px"
      justify={{ base: "space-between", md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/ReachLogo.png" height="40px" />
        <Image
          display={{ base: "none", md: "unset" }}
          src="/images/ReachText.png"
          height="90px"
        />
      </Flex>
      {user && <Directory />}
      {/* <SearchInput user={user} /> */}
      <Flex align="center">
        <ColorModeSwitcher />
        <RightContent user={user} profileData={profileData} />
      </Flex>
    </Flex>
  );
};
export default Navbar;
