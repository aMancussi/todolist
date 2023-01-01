import { useState, useEffect } from 'react';
import Selected from './components/Select';
import Todo from './components/Todo'


const App = () => {

  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('listita')) || [])

  useEffect (() => {
    window.localStorage.setItem('listita', JSON.stringify(todos))
  }, [todos])
  

  const [inputValue, setInputValue] = useState('')

  const [currentFilter, setCurrentFilter] = useState('Todas')

  const [isEditMode, setIsEditMode] = useState(false)

  const [editingIdx, setEditingIdx] = useState()

  const [defaultCategories, setDefaultCategories] = useState([
    { value: 'Todas', label: 'Todas', key: 'Todas' },
    { value: 'Pendientes', label: 'Pendientes', key: 'Pendientes'  },
    { value: 'Completadas', label: 'Completadas', key: 'Completadas' },
    { value: 'Importantes', label: 'Importantes', key: 'Importantes' }
  ])

  const [categoryInput, setCategoryInput] = useState('')






  const filterFn = (item) => {
    if (currentFilter === 'Completadas') {
      return item.checked === true
    }

    if (currentFilter === 'Pendientes') {
      return item.checked === false
    }

    if (currentFilter === 'Importantes') {
      return item.favorited === true
    }
    
    return true
  }

  const handleChange = (e) => {
    const newText = e.target.value
    setInputValue(newText)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const alreadyExist = todos.some(item => item.description === inputValue)

    if (alreadyExist) {
      alert('El todo que intentas agregar ya existe en la lista')
      return
    }

    if (inputValue === '') {
      alert('Por favor ingrese un todo c:')
      return
    }

    if (!isEditMode) {

      const newTodo = {
        description: inputValue,
        checked: false,
        favorited: false
      }

      const list = [...todos, newTodo]
      setTodos(list)
      setInputValue('')
      localStorage.setItem('list', JSON.stringify(list));

    } else {
      const editingTodo = todos[editingIdx]
      editingTodo.description = inputValue

      const prevTodos = todos.slice(0, editingIdx)
      const nextTodos = todos.slice(editingIdx + 1, todos.length)

      const newTodos = [...prevTodos, editingTodo, ...nextTodos]
      setTodos(newTodos)

      setIsEditMode(false)
      setInputValue('')
    }
  }

  const deleteTodo = (itemClicked) => {
    const newTodos = todos.filter(item => item !== itemClicked)
    setTodos(newTodos)
  }

  const handleCheck = (inputCheckValue, text) => {
    const checkedTodoIdx = todos.findIndex(item => item.description === text)
    const checkedTodo = todos[checkedTodoIdx]
    checkedTodo.checked = inputCheckValue

    const prevTodos = todos.slice(0, checkedTodoIdx)
    const nextTodos = todos.slice(checkedTodoIdx + 1, todos.length)

    const newTodos = [...prevTodos, checkedTodo, ...nextTodos]
    setTodos(newTodos)
  }

  const handleSelectChange = (e) => {
    setCurrentFilter(e.target.value)
  }

  const handleEdit = (itemClicked) => {
    setIsEditMode(true)
    const editingTodoIdX = todos.findIndex(item => item === itemClicked)
    const editingTodo = todos[editingTodoIdX]
    setEditingIdx(editingTodoIdX)
    setInputValue(editingTodo.description)
  }

  const handleFavorite = (itemClicked) => {

    const importantIdx = todos.findIndex(item => item === itemClicked)
    const importantItem = todos[importantIdx]

    const newImportant = {...importantItem}

    newImportant.favorited = !newImportant.favorited

    const prevTodos = todos.slice(0, importantIdx)
    const nextTodos = todos.slice(importantIdx+1, todos.length)

    const newTodos = [...prevTodos, newImportant, ...nextTodos]

    setTodos(newTodos)

  }

  const handleCategoryChange = (e) => {
    const newText = e.target.value
    setCategoryInput(newText)
    console.log(categoryInput)
    
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()

    const newCategory = {
      value: categoryInput,
      label: categoryInput,
      key: categoryInput
      
    }
    const newList = [...defaultCategories, newCategory]
    setDefaultCategories(newList)
    setCategoryInput('')
    localStorage.setItem('newList', JSON.stringify(newList));
  }




  return (
    <div>

      <h1>
        Todo's Mancussi
      </h1>

      <select onChange={handleSelectChange}>
      {defaultCategories.map(item => {
        return(
          
          <Selected
          label={item.value}
          value={item.value}
          key={item.key}
          />
          
        )
      })}
      </select>
 
      <form onSubmit={handleCategorySubmit}>
       <input
       value={categoryInput}
       onChange={handleCategoryChange}
       />
       <button onClick={handleCategorySubmit}>addCat</button>
      </form>


      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={handleChange}
          placeholder='Ingresar todo...' />

        <button onClick={handleSubmit}>
          {isEditMode ? 'Editar' : 'Publicar'}
        </button>
      </form>



      {todos.filter(filterFn).map(item => {
        return (
          <Todo 
            key={item.description}
            text={item.description}
            isChecked={item.checked}
            onCheck={handleCheck}
            deleteTodo={() => deleteTodo(item)}
            editTodo={() => handleEdit(item)}
            favoriteTodo={() => handleFavorite(item)}
            isImportant={item.favorited}
          />
        )
      })}
    </div>
  );
}

export default App;