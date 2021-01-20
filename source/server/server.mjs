// For use with Node versions 12.4 and above
import express from 'express';
import socketio from 'socket.io'
import path from 'path';
import { fileURLToPath } from 'url';
import sockets from './sockets.js';
import multer from "multer";

const storage = multer.diskStorage({
	destination:function(req,file,cd){
		cd(null,`public/upload`);
	},
	filename:function(req,file,cd){
		cd(null,file.originalname);
	}
})
const upload = multer({storage:storage})

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, '..', '..', 'public');
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
	console.log(`Invalid NODE_ENV, please use 'production'`);
}

console.log('Running in PRODUCTION, this will NOT work locally');
app.use(express.static(publicPath))
const server = app.listen(port,()=>{
	console.log("Start")
})
const io = socketio.listen(server);
// serve index.html when user requests '/'
// app.get('/', function (req, res) {
	// res.sendFile(publicPath + '/index.html');
	// });
app.get("/",(req,res)=>{
	res.sendFile(publicPath + "/test.html")
})
app.get("/socket",(req,res)=>{
	res.sendFile(publicPath + "/index1.html")
})
app.post("/upload2",upload.single("file2"),(req,res)=>{
	res.send("upload" + JSON.stringify(req.file) )
})
sockets(io);

// TODO: consider separating this into it's own file with interval as an argument
// called 100 times a second on the server side
setInterval(function () {
	const nsp = io.of('/');
	let pack = [];
	for (let id in io.sockets.sockets) {
		const socket = nsp.connected[id];
		// only push sockets that have been initialised
		if (socket.userData.shape !== undefined) {
			pack.push({
				id: socket.id,
				shape: socket.userData.shape,
				color: socket.userData.color,
				position: socket.userData.position,
				quaternion: socket.userData.quaternion
			});
		};
	}
	// send remote data array 'pack' to all clients
	if (pack.length > 0) io.emit('remoteData', pack);
}, 10);