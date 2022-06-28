import Profile from "./profileComp";
import { HomeLayout } from "../../components";

const UserProfile = () => {
  return (
    <HomeLayout
      hideFooter={true}
      contentStyle={{
        padding: "20px 0px 0px 20px",
        minHeight: "unset",
      }}
    >
      <br />
      <Profile hideWrapper />
    </HomeLayout>
  );
};

export default UserProfile;
