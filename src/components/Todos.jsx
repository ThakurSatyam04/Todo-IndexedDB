import React, { useEffect, useState } from 'react'
import TodoTable from './TodoTable';
import AddTodo from './AddTodo';

const Todos = () => {

    const idb = window.indexedDB ;

    const [ allTodos, setAllTodos ] = useState([])
    const [addingTodo, setAddingTodo] = useState(false);
    const [addUser,setAddUser] = useState(true);
    const [editUser, setEditUser] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [task, setTask] = useState("");
    const [completiondate,setCompletionDate] = useState(null);
    const [description, setDescription] = useState("");
    const [id,setId] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [priority, setPriority] = useState(false);

    const getAllData = () => {
        const dbPromise = idb.open('todoDatabase', 3);

        dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const tx = db.transaction('todos', 'readonly');
            const to = tx.objectStore('todos');
            const data = to.getAll();

            data.onsuccess = (query) => {
                setAllTodos(query.srcElement.result)
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
      setEditUser(false)
      setTask("");
      setDescription("")
    }

    useEffect(() => {
        getAllData();
    },[])

    const sortedTodos = allTodos.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const filteredTodos = sortedTodos.filter((todo) =>
      todo.task.toLowerCase().includes(searchInput.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleExportData = ()=>{
    const dbPromise = idb.open('todoDatabase', 3);  
  
    dbPromise.onsuccess = (event) => {
      const db = dbPromise.result;
            const tx = db.transaction('todos', 'readonly');
            const to = tx.objectStore('todos');
            const data = to.getAll();

      data.onsuccess = (query) => {
        // setAllTodos(query.srcElement.result)
        const jsonData = JSON.stringify(query.srcElement.result);

      // Create a Blob
        const blob = new Blob([jsonData], { type: 'application/json' });

        // Create a downloadable link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'exportedData.json';

        // Trigger download
        downloadLink.click();
      };

    dbPromise.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
    };
    };      
  }

  return (
    <>
      <div className='relative h-full top-40 left-auto w-full'>
        <AddTodo addingTodo={addingTodo} setAddingTodo={setAddingTodo} addUser= {addUser} editUser={editUser} setTask={setTask} task={task} setDescription={setDescription} description={description} selectedTask= {selectedTask} id={id} setCompletionDate={setCompletionDate} completiondate={completiondate}/>
      </div>
      <div className='w-full flex justify-center flex-wrap items-center'>
        <div className="h-100 w-full flex flex-col items-center justify-center bg-teal-lightest font-sans">
          <div className="relative bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
            <div className="mb-4 w-full flex justify-between items-center">
              <h1 className="text-grey-darkest font-semibold text-2xl">Todo List</h1>
              <div className='flex gap-2'>
                <button onClick={handleExportData}  className="flex-no-shrink p-1 border-2 rounded text-teal border-teal  hover:bg-green-500">Download Tasks</button>
                <button onClick={handleAddingTodo} className="flex-no-shrink p-1 border-2 rounded text-teal border-teal  hover:bg-green-500">
                    CREATE
                </button>
              </div>
            </div>
            <div className='w-8/12 m-auto'>
              <input 
                className='w-full m-auto p-2 rounded-md border border-black'
                type="text" 
                placeholder='search task' 
                onChange={(e)=> setSearchInput(e.target.value)}
                value={searchInput}
              />
            </div>
          </div>
         
        <div className='ml-10 mr-10'>          
          {
            searchInput ? (
              filteredTodos?.map((data) => (
                <TodoTable key={data.id} data = {data} setEditUser={setEditUser} editUser={editUser} setAddingTodo={setAddingTodo} setSelectedTask={setSelectedTask} selectedTask={selectedTask} setTask={setTask} setDescription={setDescription} setId={setId} setAddUser={setAddUser} task={task} description={description} setPriority={setPriority} priority={priority}/>
              ))
            ):(
              allTodos?.map((data) => (
                <TodoTable key={data.id} data = {data} setEditUser={setEditUser} editUser={editUser} setAddingTodo={setAddingTodo} setSelectedTask={setSelectedTask} selectedTask={selectedTask} completiondate={completiondate} setCompletionDate={setCompletionDate} setTask={setTask} setDescription={setDescription} setId={setId} setAddUser={setAddUser} task={task} description={description} setPriority={setPriority} priority={priority}/>     
              ))
            )          
          }
        </div>   
      </div>
    </div>    
      
    </>
  )
}

export default Todos
