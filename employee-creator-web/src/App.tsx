import './App.css'
import Hero from './components/Hero/Hero'
import AddEmployee from './components/AddEmployee/AddEmployee'
import EmployeeEntry from './components/EmployeeEntry/EmployeeEntry'
import type { Employee } from './utils/employee'

const previewEmployee: Employee = {
  id: 1,
  firstname: 'Ava',
  middlename: 'Marie',
  lastname: 'Thompson',
  email: 'ava.thompson@example.com',
  phone: '0412345678',
  employeeAddress: '123 Main Street, Adelaide SA 5000',
  contractType: 'PERMANENT',
  startDate: '2022-08-15',
  endDate: null,
  employmentType: 'FULL_TIME',
  hourPerWeek: 38,
  deleted: false,
}

function App() {
  return (
    <>
      <Hero />
      <AddEmployee />
      <EmployeeEntry employee={previewEmployee} />
    </>
  )
}

export default App
