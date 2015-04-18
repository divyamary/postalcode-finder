
	$(function(){
	$("#submit").click(function(event){
	$('.result').hide();
		
	var lat='';
	var lng='';
	var postalcode='';
	var googleAddress='';
	var addressCodes=[];
	var incr=0;
	var fail=false;
	var address =$('#address').val();	
		
	var geocoder = new google.maps.Geocoder(); 
	geocoder.geocode( {'address': address}, 
	function(results, status) { 
		if (status == google.maps.GeocoderStatus.OK) { 
			$(results).each(function (i,j){
				lat=results[i].geometry.location.lat();
				lng=results[i].geometry.location.lng();
				var geocoder2 = new google.maps.Geocoder(); 
					geocoder2.geocode( {'location': {lat: lat, lng: lng} }, 
						function(results, status) { 
								googleAddress=results[0].formatted_address;
								lat = results[0].geometry.location.lat();
								lng = results[0].geometry.location.lng();								
									$(results[0].address_components).each(function (i,j){	
										$(j).each(function(key, val){			
											if(val.types[0]=="postal_code"){
												postalcode= val.long_name;
												var obj = {addr:googleAddress, poCode:postalcode, lat:lat, lng:lng};
												addressCodes[incr]=obj;
												incr++;
											}
										
										});
										
									});
								if(addressCodes!=null&& addressCodes.length>0){
								showResults();
								}
								}
						); 
					
					});
			}
			if(status == google.maps.GeocoderStatus.ZERO_RESULTS){
			fail=true;
			showResults();
			return false;
			}
			}
	
	);
	
	
	function showResults(){	
	if(fail){
		$('.fail p').html('The address you entered does not exist or is incorrect.');
		$('.fail').fadeIn();
		$('#map-canvas').hide();
	} else {
		$('#map-canvas').fadeIn();
		$('.success p').html("Postal Code for the address '"+addressCodes[0].addr+"' is <span class='postalcode'>"+addressCodes[0].poCode+"</span>");
		$('.success').fadeIn();
		var latitude=addressCodes[0].lat;
		var longitude=addressCodes[0].lng;
		var latlng = new google.maps.LatLng(latitude,longitude);
		var mapOptions = {
		zoom: 16,
		center: latlng
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
		var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					title:addressCodes[0].addr
		});
		if(addressCodes.length>1){	
		$('.suggest p').html("Not the address you were looking for?<button class='suggestBtn'>See other suggestions</button>");
		$('.suggest').fadeIn();
		$(".suggestBtn").click(function(event){
		$('.suggest p').empty();
		
		$.each(addressCodes, function(i,j){
			if(i==0){
				return;
			}
			$('.suggest p').append("<ul><a data-lng='"+addressCodes[i].lng+"'data-lat='"+addressCodes[i].lat+"' class='suggestRes' href='#'>"+addressCodes[i].addr+"</a></ul>");
		});
				
		$(".suggestRes").click(function(e){
			e.preventDefault();
			
			var lat= $(this).attr('data-lat');
			var lng= $(this).attr('data-lng');
			$.each(addressCodes, function(i,j){
				if(addressCodes[i].lat==lat && addressCodes[i].lng==lng){				
				$('.success p').html("Postal Code for the address '"+addressCodes[i].addr+"' is <span class='postalcode'>"+addressCodes[i].poCode+"</span>");							
				var latlng = new google.maps.LatLng(addressCodes[i].lat,addressCodes[i].lng);
				var mapOptions = {
				zoom: 16,
				center: latlng
				};
				var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
				var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					title:addressCodes[i].addr
				});
				}
			});
		});
		});		
	}
	}
	}
		
	});	
	});	