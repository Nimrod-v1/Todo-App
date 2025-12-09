import { useState , useEffect } from 'react'

const STORAGE_KEY = 'todos-app'



function App() {


  const[filter, setFilter] = useState('all')

//  const[todos,setTodos] = useState([])

  const[todos,setTodos] = useState(()=>{
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored): [];
    } catch (error) {
      console.log(`Gatyesz bratyesz localstor ${error}`);
      return [];
    }
  })

  const [text,setText] = useState('')

  useEffect(()=>{
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.log(`Hiba a localstorage-el ${error}`);
    }
  },[todos])


  /*const toggleTodo = (id) =>{
    setTodos((prev) => {
      prev.map((prevTodo) =>{
        let newTodo
        if (prevTodo.id === id) {
          newTodo.id = prevTodo.id
          newTodo.text = prevTodo.text
          newTodo.isChecked = !prevTodo.isChecked
        }
        else{
          newTodo = prevTodo;
        }
        return newTodo
      })
    })
  }*/

  const toggleTodo = (id)=>{
    setTodos((prev)=>
      prev.map((prevTodo)=>
        prevTodo.id === id ? {...prevTodo,isChecked: !prevTodo.isChecked}:prevTodo
      )
    )
  }

  const addTodo = () => {
    const todoText = text.trim()
    if (!todoText) return
    const newTodo = {
      id: crypto.randomUUID(),
      text: todoText,
      isChecked: false,
      createAt: Date.now()
    }

    setTodos((prev)=>[newTodo,...prev])
    
    setText('')
  }

  const handleKeyDown = (event) =>{
    if (event.key === "Enter"){
      addTodo()
    }
  }

  const deleteTodo = (id) =>{
    setTodos((prev) => prev.filter((prevTodo)=> prevTodo.id != id))
  }
    
  const deleteChecked = () =>{
    setTodos((prev) => prev.filter((prevTodo)=> prevTodo.isChecked != true))
  }



  const filteredTodos = todos.filter((todo)=>{
    if (filter === 'active') return !todo.isChecked 
    if (filter === 'done') return todo.isChecked
    return true
      
    
  })

  const remaining = todos.filter((todo)=> !todo.isChecked).length

  return(

    <div className='app-root'>

      <div className='todo-card'>

        <header>
          <h1>Teendőlista</h1>
          <p>egyszerü todo</p>
        </header>

        
        <div className='input-row'>
          <input 
          type="text" placeholder='Új feladat hozzáadása...'
          value={text}
          onChange={(event)=> setText(event.target.value)}
          onKeyDown={handleKeyDown}
          />

          <button 
          type='button' onClick={addTodo}>
            Hozzáad
            </button>

        </div>
        {/*-------Ha van state-------*/ }
        {todos.length>0?(
          <>
            {/*szűrő sáv*/}
            <div className='toolbar'>
              <div className="filter">
                <button type='button' className={filter === 'all'?'black':''} onClick={()=> setFilter("all")}>
                  Mind
                  </button>
                <button type='button' className={filter === 'active'?'black':''} onClick={()=> setFilter("active")}>
                  Aktív
                  </button>
                <button type='button' className={filter === 'done'?'black':''} onClick={()=> setFilter("done")}>
                  Kész
                  </button>
              </div>

              <button type='button' className='clear-btn' disabled ={todos.every((todo)=> !todo.isChecked)} onClick={deleteChecked}>
                Kész feladatok törlése
                </button>

            </div>

            <ul className='todo-list'>
                {filteredTodos.map((todo)=>{
                  return <li key={todo.id} className={todo.isChecked?'completed':''}>
                    <label htmlFor="">
                      <input type='checkbox' checked={todo.isChecked} onChange={()=> toggleTodo(todo.id)}/>
                      <span className='todo-text'>{todo.text}</span>
                    </label>

                    <button type='button' className='delete-btn' onClick={() => deleteTodo(todo.id)}>
                      X
                      </button>

                  </li>
                })}
            </ul>

            <footer>
              <span>{remaining} feladat van hátra</span>
            </footer>
          </>
          
        ):(
          <>
            
            {/*-------empty state-------*/}
            <p className='empty-state'>Még nincsen teendőd Írj be valamit fent és nyomd meg a <strong>Hozzáad</strong> gombot!</p>
          </>
        )}




      </div>
    </div>
  )

}

export default App
