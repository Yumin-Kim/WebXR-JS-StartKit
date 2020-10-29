import * as io from 'socket.io-client';
let socket;
let localPlayerId;
const localIds = [];
let remoteData = [];

// TODO: Consider turning game into a system https://aframe.io/docs/1.0.0/core/systems.html
AFRAME.registerComponent('game', {

	init: function () {
		// append new local-player component to scene
		this.el.sceneEl.setAttribute('local-player', '');

		socket.on('remoteData', function (data) { remoteData = data });

		// socket.on('reconnect', function (data) {
		// 	socket.emit('clientReconnected', localPlayerId);
		// 	// delete local-player object
		// 	// 
		// });

		// Remove remote players who disconnect
		// TODO handle local player disconnecting when server restarts
		// TODO consider calculating this from remoteData instead of discrete event
		socket.on('deletePlayer', function (data) {
			// let disconnectedPlayer = document.getElementById(data.id);
			console.log(`Player ${data.id} disconnected`);
			// TODO: Add this nice disconnect visual back in later
			// if (disconnectedPlayer) {
			// 	disconnectedPlayer.setAttribute('destroyer', { ttl: 3 });
			// 	disconnectedPlayer.setAttribute('dynamic-body', { shape: 'box', mass: 2, angularDamping: 0.5, linearDamping: 0.9 });
			// }
		});
	},

	tick: function (t, dt) {
		// TODO: Use closures to avoid creating new variables each frame - 
		// https://aframe.io/docs/1.0.0/introduction/best-practices.html#tick-handlers
		let scene = this.el.sceneEl;
		// Return if there are no remote players
		if (remoteData === undefined || remoteData.length == 0 || localPlayerId === undefined) { return };

		let remoteIds = remoteData.map(player => player.id);
		remoteData.forEach(function (data) {
			if (localPlayerId != data.id) {
				if (!document.getElementById(data.id)) {
					// Append player to scene if remote player does not exist
					// TODO: Check for race conditions and consider implementing concept of initialising players
					// TODO: Add a create remote player function or constructor
					let remotePlayer = document.createElement('a-entity');
					remotePlayer.setAttribute('player', {
						id: data.id,
						shape: data.shape,
						color: data.color,
						x: data.x,
						y: data.y,
						z: data.z
					});
					scene.appendChild(remotePlayer);
					localIds.push(data.id);
				} else if (document.getElementById(data.id)) {
					// Update remote player position if it does exist
					let remotePlayer = document.getElementById(data.id);
					remotePlayer.object3D.position.set(data.x, data.y, data.z);
					remotePlayer.object3D.quaternion.set(data.rx, data.ry, data.rz, data.rw);
				}
			}
		});
		// After creating any missing remote player locally, delete local player not on the remote
		if (JSON.stringify(remoteIds.sort()) !== JSON.stringify(localIds.sort())) { // discrepancy exists
			let orphanedIds = localIds.filter(x => !remoteIds.includes(x));
			orphanedIds.forEach(function (id) {
				if (id != localPlayerId ) {
					console.log(`Deleting orphan ${id}`);
					let orphanedElement = document.getElementById(id);
					orphanedElement.parentNode.removeChild(orphanedElement);
					let i = localIds.indexOf(id);
					localIds.splice(i, i + 1);
				}
			})
		};

		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();

		let localPlayerElement = document.getElementById(localPlayerId);
		if (localPlayerElement) {
			localPlayerElement.object3D.getWorldPosition(position);
			localPlayerElement.object3D.getWorldQuaternion(quaternion);
		}

		// TODO: Send positional data as Vector3
		socket.emit('update', {
			x: position.x,
			y: position.y,
			z: position.z,
			rx: quaternion.x,
			ry: quaternion.y,
			rz: quaternion.z,
			rw: quaternion.w
		});
	}
});

// builds the player model itself
AFRAME.registerComponent('player', {

	// TODO: Consider creating an 'a-player' primitive
	// TODO: Add separate collision geometry to prevent players intersecting
	multiple: true,

	schema: {
		color: { type: 'color' },
		shape: { type: 'string' },
		id: { type: 'string' },
		x: { type: 'number' },
		y: { type: 'number' },
		z: { type: 'number' }
	},

	init: function () {
		const colors = ['#3A7D44', '#ffc2c5', '#e3bac6', '#bc9ec1', '#dbf4a7', '#9dcdc0', '#ff934f', '#5E6472', '#507DBC'];
		const shapes = ['octahedron', 'dodecahedron', 'box', 'tetrahedron'];
		let el = this.el;
		let color = this.data.color;
		let shape = this.data.shape;
		let local = !shape;
		let position = new THREE.Vector3(this.data.x, this.data.y + 1.6, this.data.z); // account for head height
		
		// if player component is local, set some values for the player
		if (local) {
			color = colors[Math.floor(Math.random() * colors.length)];
			shape = shapes[Math.floor(Math.random() * shapes.length)];
			position = new THREE.Vector3(0, 0, -1.3);
		}
		
		// create the 3d model of the player 
		el.setAttribute('id', this.data.id);
		el.setAttribute('geometry', { primitive: shape });
		el.setAttribute('material', 'color', color);
		el.setAttribute('scale', '0.25 0.25 0.25');
		el.setAttribute('position', position);

		// emit 'init' event to share info about the player if player is local
		if (local) {
			console.log(`${localPlayerId} (you) joined as a ${color} ${shape}`);
			this.initSocket(shape, color, position);
		} else {
			console.log(`Player ${this.data.id} joined as a ${color} ${shape}`);
		}
	},

	initSocket: function (shape, color, position) {
		socket.emit('init', {
			shape: shape,
			color: color,
			id: this.data.id,
			x: position.x,
			y: position.y,
			z: position.z
		});
	}
});

// gets called first when the user connects and creates the socket
AFRAME.registerComponent('local-player', {
	multiple: false,

	init: function () {
		socket = io();

		socket.on('setId', function (data) {
			localPlayerId = data.id;
			localIds.push(data.id);
			let camera = document.getElementById('camera');
			let localPlayer = document.createElement('a-entity');
			localPlayer.setAttribute('player', { id: data.id });
			localPlayer.setAttribute('is-local', 'yes');
			camera.appendChild(localPlayer);
		});
	}
});