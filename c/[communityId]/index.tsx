import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { firestore } from "../../firebase/clientApp";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  return <div>Community Page</div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //get community data and pass it to client
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.data(),
      },
    };
  } catch (error) {
    //could add error page
    console.log("getServerSideProps error", error);
  }
}

export default CommunityPage;
