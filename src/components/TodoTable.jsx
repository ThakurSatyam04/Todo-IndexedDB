import React, { useEffect, useState } from 'react'

const TodoTable = ({data}) => {

  const idb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  const [allTasks, setAllTasks] = useState([]);
  const [isData, setIsData] = useState([]);

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
  const [taskCompleted, setTaskCompleted] = useState(`${isData.status}`);

  const handleTaskComplete = () =>{
    setTaskCompleted(!taskCompleted);
  }

  const handleTaskRemove = () =>{
  } 

  

  useEffect(()=>{
    getAllData();
  },[])
  
  useEffect(()=>{
    datas();
  })

  return (
    <>      
        <div className='w-[500px]'>
          {
            taskCompleted? 
            (
            <div className="flex mb-4 items-center">
              <div className="w-full text-grey-darkest">
                <p className="text-grey-darkest">{data.task}</p>
                <p className='text-gray-500'>{data.description}</p> 
              </div>
              <button onClick={handleTaskComplete} className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded  text-green border-green hover:bg-green-500">Done</button>
              <button onClick={handleTaskRemove} className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red  hover:bg-red-500">Remove</button>
        </div>)
            :
            (<div className="flex mb-4 items-center ">
            <p className="w-full line-through  text-red-500">{data.task}</p>
            <button onClick={handleTaskComplete} className="p-2 ml-4 mr-2 border-2 rounded text-grey border-grey hover:bg-gray-500 hover:text-white whitespace-nowrap">Not Done</button>
            <button onClick={handleTaskRemove} className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red  hover:bg-red-500 ">Remove</button>
        </div>)
          }
            
          	
        </div>
    </>
  )
}

export default TodoTable
