import { Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import CreatePostLink from "../components/Community/CreatePostLink";
import PersonalHome from "../components/Community/PersonalHome";
import Recommendations from "../components/Community/Recommendations";
import PageContent from "../components/Layout/PageContent";

const Home: NextPage = () => {
  return (
    <PageContent>
      <>
        <CreatePostLink />
        <Recommendations />
      </>
      <>
        <PersonalHome />
      </>
    </PageContent>
  );
};

export default Home;
