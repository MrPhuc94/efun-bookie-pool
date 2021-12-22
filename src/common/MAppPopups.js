import { useSelector } from "react-redux";

function MAppPopups(props) {
  const appPopUps = useSelector((state) => state.app.appPopUps || []);
  return appPopUps[0] ? appPopUps[0] : null;
}

export default MAppPopups;
