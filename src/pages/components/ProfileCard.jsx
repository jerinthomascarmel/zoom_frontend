const ProfileCard = ({ username }) => {
  const initials = username.charAt(0).toUpperCase();
  return <div className="profileCard">{initials}</div>;
};



export default ProfileCard;
