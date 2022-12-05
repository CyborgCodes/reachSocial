import { atom } from "recoil";

export interface Profile {
  id: string;
  email: string;
  numberOfFollowers: number;
  photoURL?: string;
  displayName: string;
  profileId: string;
}

export interface ProfileSnippet {
  profileId: string;
  displayName: string;
  photoURL?: string;
}

interface ProfileState {
  mySnippets: ProfileSnippet[];
  currentProfile?: Profile;
}

const defaultProfileState: ProfileState = {
  mySnippets: [],
};

export const profileState = atom<ProfileState>({
  key: "profileState",
  default: defaultProfileState,
});
