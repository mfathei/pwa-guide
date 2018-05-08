var dbPromise = idb.open('posts-store', 1, function(db){
	if(!db.objectStoreNames.contains('posts')){
		db.createObjectStore('posts', {keyPath: 'id'});
	}
});

function writeData(st, data){
	return dbPromise.then(
		function(db){
			var tx = db.transaction('posts', 'readwrite');
			var store = tx.objectStore('posts');
			store.put(data[key]);
			return tx.complete;
		});
}

