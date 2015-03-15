var symbol = "";

var saveImages = function(images) {

	var saveCount = 0;

	for (var i = 0; i < images.length ; i++) {

		getDataUrlFromUrl(images[i].url, { id: i + 1 }).then(function (result) {

			var image = { type: "BingBackground", id: result.options.id, data: result.dataURL };
			
			postMessage(image);

		});

	}
	
}

var getDataUrlFromUrl = function (url, options) {
    return new Promise(function (success, fail) {

        try {

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'blob';

			xhr.onload = function(e) {
				if (this.status == 200) {
				
					var blob = new Blob([this.response], {type: 'image/png'});
					
					var reader = new FileReader();
					
					reader.onload = function(event) {
						success({ options: options, dataURL: event.target.result });
					}
					
					reader.readAsDataURL(blob);
	
				}
			};

			xhr.send();
		
        }
        catch (e) {
            fail(e);
        }

    });
};


onmessage = function(event) {
	if (event.data) {
		saveImages(event.data);
	}
}
