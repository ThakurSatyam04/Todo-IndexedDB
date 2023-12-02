import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const TodoTable = ({data,editUser,setEditUser,setAddingTodo,setSelectedTask,selectedTask,setTask, setDescription,completiondate,setId,setAddUser,id,task,description,setCompletionDate,setPriority,priority}) => {

  const idb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  const [allTasks, setAllTasks] = useState([]);
  const [isData, setIsData] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState(`${isData.status}`);

  const datas = function(){ 
    allTasks.map((data)=>(
      setIsData(data)
    ))
  }

  const getAllData = () => {
    const dbPromise = idb.open("todoDatabase", 3);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

        var tx = db.transaction("todos", "readonly");
        var datas = tx.objectStore("todos").getAll();

      datas.onsuccess = (query) => {
        setAllTasks(query.srcElement.result);
      };

      tx.oncomplete = function () {
        db.close();
      };
    };
  };
 

  const handleTaskComplete = () =>{
    setTaskCompleted(!taskCompleted);
    setSelectedTask(data)
    console.log(data.id)

    const dbPromise = idb.open("todoDatabase", 3);
    
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
    
      var tx = db.transaction("todos", "readwrite");
      var taskdata = tx.objectStore("todos"); 

      const getRequest = taskdata.get(data.id);
      
      getRequest.onsuccess = (event) => {
        const existingTodo = event.target.result;
      
        if (existingTodo.status === false) {
          // Existing todo found, you can now update it
          existingTodo.status = true;
      
          const updateRequest = taskdata.put(existingTodo);
      
          updateRequest.onsuccess = () => {
            tx.oncomplete = function () {
              db.close();
            };
            console.log("Status updated:", existingTodo);
            window.location.reload();
      
            alert("Todo marked as not done!");
            // getAllData();
          };
      
          updateRequest.onerror = (error) => {
            console.log("Error updating status:", error);
          };
        } else {
          existingTodo.status = false;
      
          const updateRequest = taskdata.put(existingTodo);
      
          updateRequest.onsuccess = () => {
            tx.oncomplete = function () {
              db.close();
            };
            console.log("Status updated:", existingTodo);
            window.location.reload();
            alert("Todo marked as done!");
            // getAllData();
          };
      
          updateRequest.onerror = (error) => {
            console.log("Error updating status:", error);
          };
          
        }
      };
      
      getRequest.onerror = (error) => {
        console.log("Error fetching todo:", error);
      };  

    }
  }

  const handleTaskRemove = () => {
    const dbPromise = idb.open("todoDatabase", 3);

    dbPromise.onsuccess = function () {
      const db = dbPromise.result;
      var tx = db.transaction("todos", "readwrite");
      var deletedTodo = tx.objectStore("todos");
      const deleteTodo = deletedTodo.delete(data.id);

      deleteTodo.onsuccess = (query) => {
        tx.oncomplete = function () {
          db.close();
        };
        alert("Todo deleted!");
      };
      getAllData();
      window.location.reload();
    };
  };

  const handleEdit = () => {
    setSelectedTask(data)
    setId(selectedTask.id)
    setEditUser(true)
    setAddingTodo(true)
    setAddUser(false);
    setTask(data.task)
    setDescription(data.description)
    setCompletionDate(data.completiondate)

  }

  const handlePriorityChange = (e)=>{
    setPriority(e.target.checked);
    setSelectedTask(data)
    console.log(data.id)

    const dbPromise = idb.open("todoDatabase", 3);
    
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
    
      var tx = db.transaction("todos", "readwrite");
      var taskdata = tx.objectStore("todos"); 

      const getRequest = taskdata.get(data.id);
      
      getRequest.onsuccess = (event) => {
        const existingTodo = event.target.result;
      
        if (existingTodo.priority === false) {
          // Existing todo found, you can now update it
          existingTodo.priority = true;
      
          const updateRequest = taskdata.put(existingTodo);
      
          updateRequest.onsuccess = () => {
            tx.oncomplete = function () {
              db.close();
            };
            console.log("Status updated:", existingTodo);
            window.location.reload();
      
            alert("Priority Marked");
            // getAllData();
          };
      
          updateRequest.onerror = (error) => {
            console.log("Error updating status:", error);
          };
        } else {
          existingTodo.priority = false;
      
          const updateRequest = taskdata.put(existingTodo);
      
          updateRequest.onsuccess = () => {
            tx.oncomplete = function () {
              db.close();
            };
            console.log("Status updated:", existingTodo);
            window.location.reload();
            alert("Remove from priority!");
            // getAllData();
          };
      
          updateRequest.onerror = (error) => {
            console.log("Error updating status:", error);
          };
          
        }
      };
      
      getRequest.onerror = (error) => {
        console.log("Error fetching todo:", error);
      };  

    }
  }
  
  useEffect(()=>{
    getAllData();
  },[])
  
  useEffect(()=>{
    datas();
  })

  return (
    <div className='w-full sm:w-[510px] bg-slate-100 p-2 shadow-lg  rounded-md'>     
          {
            data.status === false ? 
            (
              <div className="relative flex  items-center ">                
                <p className="w-full line-through  text-red-500">{data.task}</p>
                <button onClick={handleTaskComplete} className="p-2 ml-4 mr-2 border-2 rounded text-grey border-grey hover:bg-gray-500 hover:text-white whitespace-nowrap">Not Done</button>
                <button onClick={handleTaskRemove} className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red  hover:bg-red-500 "><MdDelete /></button>
              </div>              
            )
            : 
            (
              <div className="relative flex mb-4 items-center">
                <div className='absolute top-0 right-0 flex items-center justify-center gap-2'>
                    <label>priority</label>
                    <input 
                      className='mt-1.5' 
                      type="checkbox"
                      onChange={handlePriorityChange}
                      checked={data.priority}
                    /> 
                </div>
                <div className="w-full text-grey-darkest">
                  <p className="text-grey-darkest">{data.task}</p>
                  <p className='text-gray-500'>{data.description}</p> 
                  <p>Due Date: {format(data.completiondate, 'dd/MM/yyyy')}</p>
                </div>
                <button onClick={handleTaskComplete} className="flex-no-shrink p-1 ml-4 mr-2 border-2 rounded  text-green border-green hover:bg-green-500 mt-4">Done</button>
                <button onClick={handleEdit} className="p-2 ml-4 mr-2 border-2 rounded text-grey border-grey hover:bg-gray-500 hover:text-white whitespace-nowrap mt-4"><FaEdit /></button>
                <button onClick={handleTaskRemove} className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red  hover:bg-red-500 mt-4"><MdDelete /></button>                
              </div>
            )
          }
        <hr/>
    </div>
  )
}

export default TodoTable
