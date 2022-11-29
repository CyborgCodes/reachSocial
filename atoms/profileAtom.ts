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

export interface ProfileSnippet {
  profileId: string;
  photoURL?: string;
}

interface ProfileState {
  profile: Profile[];
  mySnippets: ProfileSnippet[];
  currentProfile?: Profile;
}

const defaultProfileState: ProfileState = {
  profile: [],
  mySnippets: [],
};

export const profileState = atom<ProfileState>({
  key: "profileState",
  default: defaultProfileState,
});
