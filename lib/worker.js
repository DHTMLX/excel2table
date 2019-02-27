let api;
const calls = {};

let idcount = 1;
function id(){
	return idcount++;
}

export function getWorker(url){
	if (api) return api;

	const wk = new Worker(url);

	wk.addEventListener("message", e => {
		if (e.data.type === "ready"){
			const promise = calls[e.data.uid];
			promise.resolve(e.data);
			delete calls[e.data.uid];
        }
   	});

	api = {
		send: function(data){
			var uid = id();
			return new Promise(function(resolve, reject){
				calls[uid] = { resolve, reject };
				data.uid = uid;
				wk.postMessage(data);
			});
		}
	};

	return api;
}