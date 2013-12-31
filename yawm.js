var x11 = require('x11');
var active, la=-1, mask = x11.eventMask, root, X;
x11.createClient(function(err, display) {
	if (err) {return console.error(err)};
	X = display.client;
	root = display.screen[0].root;
	//	64 is Super Modifier
	X.GrabKey(root, 0, 64,  30, 0, 1);	//	U
	X.GrabKey(root, 0, 64, 111, 0, 1);	//	Up
	X.GrabKey(root, 0, 64, 113, 0, 1);	//	Left
	X.GrabKey(root, 0, 64, 114, 0, 1);	//	Right
	X.GrabKey(root, 0, 64, 116, 0, 1);	//	Down
	X.ChangeWindowAttributes(root, { eventMask: x11.eventMask.Exposure|x11.eventMask.SubstructureRedirect }, function(err) {
		if (err.error == 10) {
			console.error('Error: another window manager already running.');
			process.exit(1);
		}
	});
	console.log("yawm.js is started\n\tSuperMod+U raise window\n\tSuperMod+Arrows to move\n");
}).on('error', function(err) {
	console.error(['error! : ', err]);
}).on('event', function(ev) {
	if (ev.type === 2) {
		var kc = ev.keycode;
		if (ev.keycode >= 111 && ev.keycode <= 116 && active) {
			X.GetGeometry(active, function(err, cG) {
				X.MoveWindow(active, cG.xPos+(kc==114)*7-(kc==113)*7, cG.yPos+(kc==116)*7-(kc==111)*7);
			});
		};
	} else if (ev.type === 3) {
		if (ev.keycode == 30 && ev.child != 0) {
			X.RaiseWindow(active=ev.child);
		};
	} else if (ev.type === 20 ) {
		X.MoveWindow(ev.wid, (Math.random()*311)|0, (Math.random()*311)|0);
		X.MapWindow(active=ev.wid);
	} else if (ev.type === 23 ) {
		X.ResizeWindow(active=ev.wid, ev.width, ev.height);
	};
	if(active != la)
		console.log("Active wID: "+(la=active));
});
