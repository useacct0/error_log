const DB_NAME = "ErrorLogDB";
const STORE_NAME = "handles";
const DB_VERSION = 1;

function openDB(){
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
		
		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(STORE_NAME)){
				db.createObjectStore(STORE_NAME);
			}
		};
	});
}

async function saveDirHandle(handle, key = 'rootDirectory'){
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.put(handle, key);
		
		request.onsuccess = () => resolve(true);
		request.onerror = () => reject(request.error);
	});
}

async function getDirHandle(key = 'rootDirectory'){
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(key);
		
		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);
	});
}