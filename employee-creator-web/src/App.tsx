import "./App.css";
import Hero from "./components/Hero/Hero";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import EmployeeList from "./components/EmployeeList/EmployeeList";

function App() {
  return (
    <div className="appShell">
      <Hero />
      <main className="workspace">
        <AddEmployee />
        <section className="employeeDirectory" aria-label="Employee directory">
          <EmployeeList />
        </section>
      </main>
    </div>
  );
}

export default App;
