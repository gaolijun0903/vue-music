import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_HISTORY_KEY = '__play__'
const PLAY_HISTORY_MAX_LENGTH = 15


function insertArray(arr,val,compare,maxLen){
	const index = arr.findIndex(compare)
	if(index===0){
		return
	}
	if(index>0){
		arr.splice(index,1)
	}
	arr.unshift(val)
	if(maxLen && arr.length>maxLen){
		arr.pop()
	}
}

function deleteFromArray(arr,compare){
	const index = arr.findIndex(compare)
	if(index>-1){
		arr.splice(index,1)
	}
}

export function saveSearch(query){
	let searches = storage.get(SEARCH_KEY,[])
	insertArray(searches,query,(item)=>{
		return item === query
	},SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY,searches)
	return searches
}

export function loadSearch(){
	return storage.get(SEARCH_KEY,[])
}

export function deleteSearch(search){
	let searches = storage.get(SEARCH_KEY,[])
	deleteFromArray(searches,(item)=>{
		return search === item
	})
	storage.set(SEARCH_KEY,searches)
	return searches
}

export function clearSearch(){
	storage.remove(SEARCH_KEY)
	return []
}


//这里有问题！！！！！！！！！
export function savePlay(song){
	let playHistory = storage.get(PLAY_HISTORY_KEY,[]);
	insertArray(playHistory,song,(item)=>{
		return item.id === song.id
	},PLAY_HISTORY_MAX_LENGTH)
	storage.set(PLAY_HISTORY_KEY,playHistory)
	return playHistory
}

export function loadPlay(){
	return storage.get(PLAY_HISTORY_KEY,[])
}














