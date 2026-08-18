import { useState } from 'react'
import './App.css'
import Hero from './components/Hero/Hero'
import AddEmployee from './components/AddEmployee/AddEmployee'
import EmployeeList from './components/EmployeeList/EmployeeList'


function App() {
  const [employeeUpdateToken, setEmployeeUpdateToken] = useState(0)

  const refreshEmployees = () => {
    setEmployeeUpdateToken((currentToken) => currentToken + 1)
  }

  return (
    <>
      <Hero />
      <AddEmployee onEmployeeSaved={refreshEmployees} />
      <EmployeeList updateToken={employeeUpdateToken} onEmployeesChanged={refreshEmployees} />
    </>
  )
}

export default App
