import type { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import CreatePostLink from "../components/Community/CreatePostLink";
import LoginPage from "../components/Community/LoginPage";
import PersonalHome from "../components/Community/PersonalHome";
import Recommendations from "../components/Community/Recommendations";
import PageContent from "../components/Layout/PageContent";
import { auth } from "../firebase/clientApp";

<title>Reach Social Media</title>;
const Home: NextPage = () => {
  const [user] = useAuthState(auth);
  return (
    <PageContent>
      <>
        {user ? (
          <>
            <CreatePostLink />
            <Recommendations />
          </>
        ) : (
          <LoginPage />
        )}
      </>
      <>
        <PersonalHome />
      </>
    </PageContent>
  );
};

export default Home;
