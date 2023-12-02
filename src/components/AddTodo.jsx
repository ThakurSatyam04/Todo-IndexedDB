import React, { useEffect, useState } from "react";
import createCollectionsInIndexdDB from "../indexDB/database";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const AddTodo = ({ addingTodo, setAddingTodo, addUser, editUser,task,setTask,setDescription,description ,selectedTask,id,setCompletionDate,completiondate,priority,setSelectedFile,selectedFile}) => {
  useEffect(() => {
    createCollectionsInIndexdDB();
  });

  const idb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  const [allTasks, setAllTasks] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const dbPromise = idb.open("todoDatabase", 3);

    if (task) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        var tx = db.transaction("todos", "readwrite");
        var data = tx.objectStore("todos");

        if(addUser){
          const datas = data.put({
            id: Math.random().toString(),
            task,
            description,
            completiondate,
            selectedFile,
            due_date: new Date(),
            status: true,
            priority: false,
          });
  
          datas.onsuccess = (query) => {
            tx.oncomplete = function () {
              db.close();
            };
            console.log("success");
            window.location.reload();
            alert("Todo added!");
            // getAllData();
            handleClose();
          };
  
          datas.onerror = (error) => {
            console.log("error is ", error);
          };
        }
        else{
          const datas = data.put({
            id: selectedTask.id,
            task,
            description,
            completiondate,
            selectedFile,
            due_date: new Date(),
            status: true,
            priority:false,
          });
  
          datas.onsuccess = (query) => {
            tx.oncomplete = function () {
              db.close();
            };
            console.log("success");
            window.location.reload();
            alert("Todo edited!");
            setTask("");
            setDescription("");
            setCompletionDate("");
            // getAllData();
            handleClose();
          };
  
          datas.onerror = (error) => {
            console.log("error is ", error);
          };
        }
      };
    }
  };

  const handleClose = ()=>{
    setAddingTodo(!addingTodo)
    setTask("");
    setDescription("");
    setCompletionDate(null);
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div>
      {addingTodo ? (
        <div className="absolute h-100 w-full flex items-center justify-center  font-sans">
          <div className="relative bg-gray-300 rounded shadow p-6 m-4 w-full lg:w-7/12 lg:max-w-7/12 z-10">
            <button onClick={handleClose} className="absolute top-0 right-0 pr-2 font-bold text-2xl cursor-pointer ">X</button>
            <div className="mb-4">
              {
                !editUser? (
                  <h1 className="text-grey-darkest font-semibold">Add Todo +</h1>
                ):(
                  <h1 className="text-grey-darkest font-semibold">Update Todo</h1>
                )
              }              
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 mt-4"
              >
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                  placeholder="Add Todo"
                  type="text"
                  name="task"
                  onChange={(e) => setTask(e.target.value)}
                  value={task}
                />
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                  placeholder="Description"
                  type="text"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
                 <label>Select Date: </label>
                    <DatePicker
                      className="shadow appearance-none border rounded py-2 px-3 mr-4 text-grey-darker"
                      placeholderText="select date"
                      selected={completiondate}
                      onChange={ (date) => setCompletionDate(date) }
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                    />

                    <input type="file" onChange={handleFileChange}/>
                <button
                  className="flex-no-shrink p-2 border-2 rounded text-teal border-teal  hover:bg-teal w-fit m-auto hover:bg-green-500"
                  type="submit"
                >
                  {editUser ? "UPDATE" : "ADD"}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddTodo;
