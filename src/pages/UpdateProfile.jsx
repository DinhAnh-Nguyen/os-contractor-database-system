import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../contexts/Authorization";
import ProfileForm from "../components/profileForm/ProfileForm";
import RecruiterProfileForm from "../components/profileForm/RecruiterProfileForm";
import { userProfileContext } from "../contexts/UserProfileContext";
import { toast } from "react-toastify";
import Navigation from "../components/navigation/Navigation";

export default function MyProfile() {
	const { user } = useContext(authContext);
	const { userProfile } = useContext(userProfileContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (user === null) {
			toast.error('Please Login To View Profile');
			navigate('/');
		}
	}, [user]);

  return (
    <>
      <Navigation menu="Profile" />
      <main>
        {userProfile?.userType === "techs" && <ProfileForm />}
        {userProfile?.userType === "recruiter" && <RecruiterProfileForm />}
      </main>
    </>
  );
}
