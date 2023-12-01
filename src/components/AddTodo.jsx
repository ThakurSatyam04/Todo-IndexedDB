import React, { useEffect, useState } from "react";
import createCollectionsInIndexdDB from "../indexDB/database";

const AddTodo = ({ addingTodo, setAddingTodo }) => {
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
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);

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

  const handleAddTodo = (e) => {
    e.preventDefault();
    console.log("button hit");

    const dbPromise = idb.open("todoDatabase", 3);

    if (task) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        var tx = db.transaction("todos", "readwrite");
        var data = tx.objectStore("todos");

        const users = data.put({
          id: allTasks?.length + 1,
          task,
          description,
          due_date: new Date(),
          status: true,
        });

        users.onsuccess = (query) => {
          tx.oncomplete = function () {
            db.close();
          };
          console.log("success");
          alert("Todo added!");
          getAllData();
        };

        users.onerror = (error) => {
          console.log("error is ", error);
        };
      };
    }
  };

  // const handleEditTodo = (id) => {
  //   if (editId !== null) {
  //       setEditId(id)
  //       const dbPromise = idb.open('todoDatabase', 3);

  //       dbPromise.onsuccess = () => {
  //         const db = dbPromise.result;
  //         const tx = db.transaction('todos', 'readonly');
  //         const data = tx.objectStore('todos');
  //         const request = data.get(editId);

  //         request.onsuccess = () => {
  //           const todoToEdit = request.result;
  //           setTodo(todoToEdit.task || ''); // Set the todo text in the input field
  //         };

  //         request.onerror = (err) => {
  //           console.error(err);
  //         };
  //       };
  //     }
  // }

  const handleClose = ()=>{
    setAddingTodo(!addingTodo)
  }

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div>
      {addingTodo ? (
        <div className="absolute h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
          <div className="relative bg-gray-300 rounded shadow p-6 m-4 w-full lg:w-7/12 lg:max-w-7/12">
            <button onClick={handleClose} className="absolute top-0 right-0 pr-2 font-bold text-2xl cursor-pointer ">X</button>
            <div className="mb-4">
              <h1 className="text-grey-darkest font-semibold">Add Todo +</h1>
              <form
                onSubmit={handleAddTodo}
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
                <button
                  className="flex-no-shrink p-2 border-2 rounded text-teal border-teal  hover:bg-teal w-fit m-auto hover:bg-green-500"
                  type="submit"
                >
                  {editId !== null ? "UPDATE" : "ADD"}
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
