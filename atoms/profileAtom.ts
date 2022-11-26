import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Profile {
  id: string;
  profileId: string;
  email: string;
  numberOfFollowers: number;
  numberOfFollowing: number;
  photoURL?: string;
  displayName: string;
}

export type Followers = {
  id: string;
  profileId: string;
  photoURL?: string;
  followersValue: number;
};

interface ProfileState {
  profile: Profile[];
  followers: Followers[];
  currentProfile?: Profile;
}

const defaultProfileState: ProfileState = {
  profile: [],
  followers: [],
};

export const profileState = atom<ProfileState>({
  key: "profileState",
  default: defaultProfileState,
});
