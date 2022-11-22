import { User } from "firebase/auth";
import React from "react";
import { Community } from "../../../atoms/communitiesAtom";
import PageContent from "../../../components/Layout/PageContent";
import UserProfileItem from "../../../components/UserProfile/UserProfileItem";

type profileProps = {};

const profile: React.FC = () => {
  return (
    <PageContent>
      <>Hello</>
      <>
        <UserProfileItem />
      </>
    </PageContent>
  );
};
export default profile;
