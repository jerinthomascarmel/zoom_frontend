const RoundedIcon = ({ icon, onClick, color = "white" }) => {
  return (
    <div id="RoundedIcon" style={{ backgroundColor: color }} onClick={onClick}>
      {icon}
    </div>
  );
};

export default RoundedIcon;
