$(document).ready(function() {
	var $result = $('.result .image');

	function rgbToHex(r, g, b) {
	    if (r > 255 || g > 255 || b > 255)
	        throw "Invalid color component";
	    return ((r << 16) | (g << 8) | b).toString(16);
	}

	function pixelScriber(file, dataUrl) {
	         var canvas = document.getElementById('canvas-image'),
	            context = canvas.getContext('2d');
	            img = document.getElementById('user-image'),
	            width = file.width,
	            height = file.height;
	  
	        canvas.width = width;
	        canvas.height = height;
	        context.drawImage(img, 0,0, width, height );

	           
	        var imgPixels = context.getImageData(0, 0, width, height),
	                table = $('.img-table');
	          table.css({
	             width: width,
	             height: height
	           });
	           // Once we've got the image set up we can go about reading each
	           // and every one of the pixels
	          
	           // Rows
	            console.log(height);
	           for (var y = 0; y < height; y++) {
	               table.append('<tr class="row-'+y+'"></tr>');
	                console.log(y);
	               // Columns
	   
	                for (var x=0; x < width; x++) {
	                  var i = (y * width + x) * 4,
	                      r = imgPixels.data[i],
	                      g = imgPixels.data[i+1],
	                      b = imgPixels.data[i+2],
	                      hex = "#" + (rgbToHex(r, g, b)).slice(-6);  
	                  
	                     $('.row-'+y).append('<td class=".col-'+x+'" cellpadding="0" colspan="1" width="1"><span  style="background-color: '+hex+'"></span></td>');
	                }
	             }
	}


	Dropzone.options.imageUpload = {
	    url: function() {
	    },
	    maxFilesize: 50,
	    uploadMultiple: false,
	    thumbnailWidth: null,
	    thumbnailHeight: null,
	    init: function() {
	      this.on('thumbnail', function(file, dataUrl) {
	        //Get rid of dropzone, cause we don't need it anymore
	        this.disable();
	        $result.find('form').remove();
	        
	        //Paste the image onto our page, cuz
	        // Set some classes for loading
	        $result.parents('.result').addClass('uploaded loading');
	        
	        // Setup a canvas
	        $result.append('<img id="user-image" src="'+dataUrl+'" width="'+file.width+'" height="'+file.height+'" /><canvas id="canvas-image"></canvas>');
	        
	        setTimeout(function() {
	          console.log('calling scriber');
	          pixelScriber(file, dataUrl);
	          $result.parents('.result').removeClass('loading');
	        }, 500);
	        
	      });
	    }
	};




});