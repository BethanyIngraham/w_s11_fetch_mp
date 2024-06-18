import React, {useEffect, useState} from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import DogForm from './DogForm'
import DogsList from './DogsList'

export default function App() {
  const [dogs, setDogs] = useState([])
  const [currentDog, setCurrentDog] = useState(null)

  useEffect(() => {
    getDogs()
  },[])

  const getDogs = () => {
    fetch('http://localhost:3003/api/dogs')
      .then(res => {
        if(!res.ok) throw new Error(`Oh no! Status is ${res.status}`)
        const contentType = res.headers.get('Content-Type')
        if(contentType.includes('application/json')) 
        return res.json()  
      })
      .then(setDogs)
      .catch(error => {
        console.log('There was a problem getting the dogs', error)
      })
  }

  return (
    <div>
      <nav>
        <NavLink to="/">Dogs</NavLink>
        <NavLink to="/form">Form</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<DogsList 
        dogs={dogs}
        getDogs={getDogs}
        setCurrentDog={setCurrentDog}
         />} />
        <Route path="/form" element={<DogForm 
        dog={currentDog && dogs.find(dg => dg.id === currentDog)}
        getDogs={getDogs}
        reset={() => setCurrentDog(null)}
        />} />
      </Routes>
    </div>
  )
}
