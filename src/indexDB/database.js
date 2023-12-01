const idb = window.indexedDB ;

const createCollectionsInIndexdDB = () => {
    if(!idb){
        console.log("this browser does not support indexDB")
    }
    
    const request = idb.open("todoDatabase", 3)

    request.onerror = (error) => {
        console.log('Error opening the database')
        console.log("Error : ", error)
    };

    request.onupgradeneeded = (e) => {
        const db = request.result;
        if(!db.objectStoreNames.contains('todos')){
            db.createObjectStore('todos', {
                keyPath: 'id',
            });
        }
    }

    request.onsuccess = (event) => {
        console.log('database opened successfully')
    }
}

export default createCollectionsInIndexdDB;