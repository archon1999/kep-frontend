import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByUsername, resources } from 'app/routes/resources';
import {
  useUserAbout,
  useUserDetails,
  useUserRatings,
  useUserSocial,
} from 'modules/users/application/queries';

export const useUserProfilePage = () => {
  const { t } = useTranslation();

  const { username = '' } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const { data: user, isLoading, error, mutate } = useUserDetails(username);

  const { data: ratings, isLoading: ratingsLoading } = useUserRatings(username);

  const {
    data: about,
    isLoading: aboutLoading,
    error: aboutError,
    mutate: reloadAbout,
  } = useUserAbout(username);

  const { data: social } = useUserSocial(username);

  const isOwner = currentUser?.username === username;

  const profilePath = getResourceByUsername(resources.UserProfile, username);

  const tabs = [
    { value: 'about', label: t('users.profile.tabs.about') },
    { value: 'ratings', label: t('users.profile.tabs.ratings') },
    { value: 'competition-prizes', label: t('users.profile.prizes.title') },
    { value: 'achievements', label: t('users.profile.tabs.achievements') },
    ...(isOwner ? [{ value: 'purchases', label: t('users.profile.tabs.purchases') }] : []),
    { value: 'activity-history', label: t('users.profile.tabs.activityHistory') },
  ];

  const requestedTab = location.hash.slice(1);

  const activeTab = tabs.some((tab) => tab.value === requestedTab) ? requestedTab : 'about';

  useDocumentTitle('pageTitles.userProfile', { username });
  return {
    username,
    location,
    navigate,
    user,
    isLoading,
    error,
    mutate,
    ratings,
    ratingsLoading,
    about,
    aboutLoading,
    aboutError,
    reloadAbout,
    social,
    isOwner,
    profilePath,
    tabs,
    activeTab,
  };
};
