import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const initialForm = { name: '', breed: '', adopted: false }

export default function DogForm({ dog, getDogs, reset }) {
  const [values, setValues] = useState(initialForm)
  const [breeds, setBreeds] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if(dog) {
      setValues(dog)
    } else {
      setValues(initialForm)
    }
  }, [dog])

  useEffect(() => {
    fetch('/api/dogs/breeds')
    .then(res => res.json())
    .then(breeds => setBreeds(breeds.toSorted()))
    .catch(error => console.log(error))
  }, [])

  const updateDog = () => {
    fetch(`/api/dogs/${values.id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: new Headers({'Content-Type': 'application/json'})
    })
    .then(res => {
      if(!res.ok) throw new Error(`Unable to PUT dog, ${res.status}` )
      getDogs()
      reset()
      navigate('/')
    })
    .catch(error => console.log('Error', error))
  }

  const createDog = () => {
    fetch('/api/dogs', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: new Headers ({'Content-Type': 'application/json'})
    })
    .then(res => {
      if(!res.ok) throw new Error(`Unable to POST dog, ${res.status}` )
      getDogs()
      navigate('/')
    })
    .catch(error => console.log('Error', error))
  }

  const onReset = (event) => {
    event.preventDefault()
    setValues(initialForm)
    reset()
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const action = dog ? updateDog : createDog
    action()
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setValues({
      ...values, [name]: type === 'checkbox' ? checked : value
    })
  }
  return (
    <div>
      <h2>
        { dog ? 'Update Dog' : 'Create Dog'}
      </h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Name"
          aria-label="Dog's name"
        />
        <select
          name="breed"
          value={values.breed}
          onChange={onChange}
          aria-label="Dog's breed"
        >
          <option value="">---Select Breed---</option>
          {breeds.map(br => 
            <option key={br}>{br}</option>
          )}
        </select>
        <label>
          Adopted: <input
            type="checkbox"
            name="adopted"
            checked={values.adopted}
            onChange={onChange}
            aria-label="Is the dog adopted?"
          />
        </label>
        <div>
          <button type="submit">
            { dog ? 'Update Dog' : 'Create Dog'}
          </button>
          <button onClick={onReset} aria-label="Reset form">Reset</button>
        </div>
      </form>
    </div>
  )
}

