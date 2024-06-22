import MemberTable from "./components/MembersTable";
import "bootstrap/dist/css/bootstrap.min.css";
const App = () => {
  return (
    <>
      <div className="container-fluid mt-1 bg-light">
        <h4 className="pt-3"> All Members </h4>
        <MemberTable />
      </div>
    </>
  );
};

export default App;
