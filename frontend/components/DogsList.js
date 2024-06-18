import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function DogsList({ dogs, getDogs, setCurrentDog }) {
  const navigate = useNavigate()

  const editDog = (id) => {
    setCurrentDog(id)
    navigate('form')
  }

  const deleteDog = (id) => {
    fetch(`http://localhost:3003/api/dogs/${id}`, {method: 'DELETE'})
      .then(res => {
        if(!res.ok) throw new Error(`Something went wrong deleting the dog, ${res.status}`)
        getDogs()
        setCurrentDog(null)
      })
      .catch(error => {
        console.log('Oh no!', error)
      })
  }
   
  return (
    <div>
      <h2>Dogs Shelter</h2>
      <ul>
        {
          dogs.map(dog => (
            <li key={dog.id}>
              {`${dog.name}, ${dog.breed}, ${dog.adopted ? '': 'NOT '} adopted`}
            <div>
              <button onClick={() => editDog(dog.id)}>Edit</button>
              <button onClick={() => deleteDog(dog.id)}>Delete</button>
            </div>
          </li>
          ))
        }
      </ul>
    </div>
  )
}

