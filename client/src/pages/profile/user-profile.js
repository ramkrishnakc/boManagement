import ProfileComponent from "./index";
import HomeLayout from "../../components/HomeLayout";

const UserProfile = () => {
  return (
    <HomeLayout
      hideFooter={true}
      contentStyle={{
        padding: "20px 0px 0px 20px",
        minHeight: "unset",
      }}
    >
      <ProfileComponent hideWrapper />
    </HomeLayout>
  );
};

export default UserProfile;
