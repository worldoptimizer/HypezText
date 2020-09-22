/*!
Hype zText v1.2
https://bennettfeely.com/ztext, Licensed MIT | (c) 2020 Bennett Feely
Tweaked by (c) 2020 Max Ziebell, (https://maxziebell.de). MIT-license
*/
/*
* Version-History
* 1.0	Initial release under MIT
* 1.1	Fixed event garbage collection
* 1.2	Fixed redraws with zDraw
*/

if("HypezText" in window === false) window['HypezText'] = (function () {
	
	if (!(CSS.supports("-moz-transform-style", "preserve-3d") ||
		CSS.supports("-ms-transform-style", "preserve-3d") ||
		CSS.supports("-webkit-transform-style", "preserve-3d") ||
		CSS.supports("transform-style", "preserve-3d"))) {
		console.error( "zTextHypeEdition is disabled because CSS transform-style: preserve3d; is unsupported.");
		return;
	}

	// Default values
	_default = {
		depth: "1rem",
		direction: "both",
		event: "none",
		eventRotation: "30deg",
		eventDirection: "default",
		fade: false,
		layers: 10,
		perspective: "500px",
		z: true,
	};

	_observer = {};
	_event = {};
	_cache = {};

	function zTextify(selector, options) {
		var sceneElm = document.getElementById(options.hypeDocument.currentSceneId());
		var zs = sceneElm.querySelectorAll(selector);
		var api = [];
		zs.forEach((z) => {
			api.push(zDraw(z, Object.assign(uniformOptions(z), options)));
		});
		return api;
	}

	function zDraw(z, options) {
		var z_engaged = options.zEngaged || _default.zEngaged;

		if (z_engaged !== "false") {
			var z_observer = _observer[options.hypeDocument.documentId()];
			var z_event = _event[options.hypeDocument.documentId()];
			var z_cache = _cache[options.hypeDocument.documentId()];
			
			var depth = options.depth || _default.depth;
			var depth_unit = depth.match(/[a-z]+/)[0];
			var depth_numeral = parseFloat(depth.replace(depth_unit, ""));

			var direction = options.direction || _default.direction;

			var event = options.event || _default.event;
			var event_rotation = options.eventRotation || _default.eventRotation;
			var event_rotation_unit = event_rotation.match(/[a-z]+/)[0];
			var event_rotation_numeral = parseFloat(
				event_rotation.replace(event_rotation_unit, "")
			);
			var event_direction = options.eventDirection || _default.eventDirection;

			var fade = options.fade || _default.fade;
			var layers = options.layers || _default.layers;
			var perspective = options.perspective || _default.perspective;
			var transform = options.transform || _default.transform;

			// Grab the text and replace it with a new structure
			if (options.innerHTML || options.purgeCache) delete z_cache[z.id];
			var text = options.innerHTML || z_cache[z.id] || z.innerHTML;
			if (!z_cache[z.id]) z_cache[z.id] = z.innerHTML;

			z.innerHTML = "";
			z.style.display = "inline-block";
			z.style.position = "relative";
			z.style.webkitPerspective = perspective;
			z.style.perspective = perspective;

			// Create a wrapper span that will hold all the layers
			var zText = document.createElement("span");
			zText.setAttribute("class", "z-text");
			zText.style.display = "inline-block";
			zText.style.webkitTransformStyle = "preserve-3d";
			zText.style.transformStyle = "preserve-3d";

			// Create a layer for transforms from JS to be applied
			// CSS is stupid that transforms cannot be applied individually
			var zLayers = document.createElement("span");
			zLayers.setAttribute("class", "z-layers");
			zLayers.style.display = "inline-block";
			zLayers.style.webkitTransformStyle = "preserve-3d";
			zLayers.style.transformStyle = "preserve-3d";

			zText.append(zLayers);

			for (i = 0; i < layers; i++) {
				let pct = i / layers;

				// Create a layer
				var zLayer = document.createElement("span");
				zLayer.setAttribute("class", "z-layer");
				zLayer.innerHTML = text;
				zLayer.style.display = "inline-block";

				// Shift the layer on the z axis
				if (direction === "backwards") {
					var zTranslation = -pct * depth_numeral;
				}
				if (direction === "both") {
					var zTranslation = -(pct * depth_numeral) + depth_numeral / 2;
				}
				if (direction === "forwards") {
					var zTranslation = -(pct * depth_numeral) + depth_numeral;
				}

				var transform = "translateZ(" + zTranslation + depth_unit + ")";
				zLayer.style.webkitTransform = transform;
				zLayer.style.transform = transform;

				// Manipulate duplicate layers
				if (i >= 1) {
					// Overlay duplicate layers on top of each other
					zLayer.style.position = "absolute";
					zLayer.style.top = 0;
					zLayer.style.left = 0;

					// Hide duplicate layres from screen readers and user interation
					zLayer.setAttribute("aria-hidden", "true");

					zLayer.style.pointerEvents = "none";

					zLayer.style.mozUserSelect = "none";
					zLayer.style.msUserSelect = "none";
					zLayer.style.webkitUserSelect = "none";
					zLayer.style.userSelect = "none";

					// Incrementally fade layers if option is enabled
					if (fade === true || fade === "true") {
						zLayer.style.opacity = (1 - pct) / 2;
					}
				}

				// Add layer to wrapper span
				zLayers.append(zLayer);
			}

			// Finish adding everything to the original element
			z.append(zText);

			// Remove all events on this z element if there are any
			if (z_event.hasOwnProperty(z.id)) {
				z_event[z.id].forEach(function(removeEvent){ removeEvent(); });
			}

			// reinit at empty array
			z_event[z.id] = [];
			

			function tilt(x_pct, y_pct) {
				// Switch neg/pos values if eventDirection is reversed
				if (event_direction == "reverse") {
					var event_direction_adj = -1;
				} else {
					var event_direction_adj = 1;
				}

				// Multiply pct rotation by eventRotation and eventDirection
				var x_tilt = x_pct * event_rotation_numeral * event_direction_adj;
				var y_tilt = -y_pct * event_rotation_numeral * event_direction_adj;

				// Keep values in bounds [-1, 1]
				var x_clamped = Math.min(Math.max(x_tilt, -1), 1);
				var y_clamped = Math.min(Math.max(y_tilt, -1), 1);

				// Add unit to transform value
				var unit = event_rotation_unit;

				// Rotate .z-layers as a function of x and y coordinates
				var transform =
					"rotateX(" + y_tilt + unit + ") rotateY(" + x_tilt + unit + ")";
				zLayers.style.webkitTransform = transform;
				zLayers.style.transform = transform;
			}

			// Capture mousemove and touchmove events and rotate .z-layers
			if (event === "pointer") {
				function zMousemove (e) {
					var x_pct = (e.clientX / window.innerWidth - 0.5) * 2;
					var y_pct = (e.clientY / window.innerHeight - 0.5) * 2;
					tilt(x_pct, y_pct);
				}

				window.addEventListener("mousemove", zMousemove, false);
				z_event[z.id].push(function(){ window.removeEventListener("mousemove", zMousemove, false); });

				function zTouchmove(e) {
					var x_pct = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
					var y_pct = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
					tilt(x_pct, y_pct);
				}

				window.addEventListener("touchmove", zTouchmove, false);
				z_event[z.id].push(function(){ window.removeEventListener("touchmove", zTouchmove, false); });
			}

			// Capture scroll event and rotate .z-layers
			if (event == "scroll") {
				function zScroll() {
					var bounds = z.getBoundingClientRect();
					var center_x = bounds.left + bounds.width / 2 - window.innerWidth / 2;
					var center_y = bounds.top + bounds.height / 2 - window.innerHeight / 2;
					var x_pct = (center_x / window.innerWidth) * -2;
					var y_pct = (center_y / window.innerHeight) * -2;
					tilt(x_pct, y_pct);
				}
				zScroll();
				window.addEventListener("scroll", zScroll, false);
				z_event[z.id].push(function(){ window.removeEventListener("scroll", zScroll, false); });
			}

			if (event == "scrollY") {
				function zScrollY() {
					var bounds = z.getBoundingClientRect();
					var center_y = bounds.top + bounds.height / 2 - window.innerHeight / 2;
					var y_pct = (center_y / window.innerHeight) * -2;
					tilt(0, y_pct);
				}
				zScrollY();
				window.addEventListener("scroll", zScrollY, false);
				z_event[z.id].push(function(){ window.removeEventListener("scroll", zScrollY, false); });
			}

			if (event == "scrollX") {
				function zScrollX() {
					var bounds = z.getBoundingClientRect();
					var center_x = bounds.left + bounds.width / 2 - window.innerWidth / 2;
					var x_pct = (center_x / window.innerWidth) * -2;
					tilt(x_pct, 0);
				}
				zScrollX();
				window.addEventListener("scroll", zScrollX, false);
				z_event[z.id].push(function(){ window.removeEventListener("scroll", zScrollX, false); });
			}

			// START : timeline Event
			if (event == "timeline") {
				function transferRotation() {
					var re = /(\w+)\(([^)]*)\)/g, zt='', ot='';
					while (m = re.exec(z.style.transform)) {
						switch(m[1]){
							case "rotateX":
							case "rotateY":
							case "rotateZ":
								zt+=m[0]+' ';
								break;

							default:
								ot+=m[0]+' ';
								break;	
						}
					}
					if (zt) z.querySelector('.z-text').style.transform = zt;
					z.style.setProperty('transform', ot, 'important');
				}
				if (!z_observer.hasOwnProperty(z.id)){
					z_observer[z.id] = new MutationObserver(transferRotation);
					z_observer[z.id].observe(z, {
						attributes: true,
						attributeFilter: ['style']
					})
				}
			}
			// END
			return {
				tilt: tilt
			}
		}
	}

	function uniformOptions(z){
		return {
			depth: z.dataset.zDepth || _default.depth,
			direction: z.dataset.zDirection || _default.direction,
			event: z.dataset.zEvent || _default.event,
			eventRotation: z.dataset.zEventrotation || _default.eventRotation,
			eventDirection: z.dataset.zEventdirection || _default.eventDirection,
			fade: z.dataset.zFade || _default.fade,
			layers: parseFloat(z.dataset.zLayers) || _default.layers,
			perspective: z.dataset.zPerspective || _default.perspective,
			zEngaged: z.dataset.z || _default.z,
		};
	}

	function HypeDocumentLoad(hypeDocument, element, event) {
		_observer[hypeDocument.documentId()] = {};
		_event[hypeDocument.documentId()] = {};
		_cache[hypeDocument.documentId()] = {};

		hypeDocument.zTextify = function(selector, options){
			return zTextify(selector, Object.assign(options || {}, {hypeDocument: hypeDocument}));
		}

		hypeDocument.zDraw = function(z, options){
			return zDraw(z, Object.assign(options || {}, {hypeDocument: hypeDocument}));
		}
	}

	function HypeSceneLoad(hypeDocument, element, event) {
		// Get all elements with the [data-z] attribute in scene
		element.querySelectorAll("[data-z]").forEach((z) => {
			// Make uniform option keys
			var options = Object.assign(uniformOptions(z), { hypeDocument: hypeDocument});
			zDraw(z, options);
		});
	}

	function HypeSceneUnload(hypeDocument, element, event) {
		Object.values(_event[hypeDocument.documentId()]).forEach(function(z_event){
			z_event.forEach(function(removeEvent){ removeEvent(); });
		});
		_event[hypeDocument.documentId()] = {};
		_cache[hypeDocument.documentId()] = {};
	}

	if("HYPE_eventListeners" in window === false) { window.HYPE_eventListeners = Array(); }
	window.HYPE_eventListeners.push({"type":"HypeDocumentLoad", "callback":HypeDocumentLoad});
	window.HYPE_eventListeners.push({"type":"HypeSceneLoad", "callback":HypeSceneLoad});
	window.HYPE_eventListeners.push({"type":"HypeSceneUnload", "callback":HypeSceneUnload});
	
	/* Reveal Public interface to window['HypezText'] */
	return {
		version: '1.2',
	};
})();