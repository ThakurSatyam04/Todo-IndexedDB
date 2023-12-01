import React, { useEffect, useState } from 'react'
import TodoTable from './TodoTable';
import AddTodo from './AddTodo';

const Todos = () => {

    const idb = window.indexedDB ;

    const [ allTodos, setAllTodos ] = useState([])
    const [addingTodo, setAddingTodo] = useState(false);

    const getAllData = () => {
        const dbPromise = idb.open('todoDatabase', 3);

        dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const tx = db.transaction('todos', 'readonly');
            const to = tx.objectStore('todos');
            const data = to.getAll();

            data.onsuccess = (query) => {
                setAllTodos(query.srcElement.result)
                // getAllData()
            };
            data.onerror = (query) => {
                alert('Error occured in loading data')
            }
            tx.oncomplete = () => {
                db.close();
            }
        };
    }

    const handleAddingTodo = ()=>{
      setAddingTodo(!addingTodo);
    }

    useEffect(() => {
        getAllData();
    },[])

  return (
    <>
      <div className='relative h-full top-40 left-auto w-full'>
        <AddTodo addingTodo={addingTodo} setAddingTodo={setAddingTodo}/>
      </div>
      <div className='w-full flex flex-col justify-center flex-wrap items-center'>
        <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
          <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
            <div className="mb-4 w-full flex justify-between items-center">
              <h1 className="text-grey-darkest font-semibold text-2xl">Todo List</h1>
                <button onClick={handleAddingTodo} className="flex-no-shrink p-2 border-2 rounded text-teal border-teal  hover:bg-green-500">
                    CREATE
                </button>
            </div>
          </div>
        </div>
        
        {
          allTodos?.map((data) => (
                <TodoTable key={data.id} data = {data}/>     
          ))
        }

      </div>
    </>
  )
}

export default Todos
