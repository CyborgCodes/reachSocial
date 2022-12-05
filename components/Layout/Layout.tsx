import React from "react";
import { Profile } from "../../atoms/profileAtom";
import Navbar from "../Navbar/Navbar";

type LayoutProps = {
  profileData: Profile;
};

export default function Layout({ profileData, children }: any) {
  return (
    <>
      <Navbar profileData={profileData} />
      <main>{children}</main>
    </>
  );
}
