$(function(){
	
	var largeur = 60,
		hauteur = 50,
		nb_cases = largeur * hauteur,
	    vertical = 1,
	   	horizontal = 0,
	   	Direction = "left",
	   	newX,
	   	newY,
	   	fruit_exists = false,
	   	snake_size = 0,
	   	score = 0,
	   	go = true,
	   	speed = 120,
	   	tic,
	   	first_start = true;

	startGame();
	function startGame(){
		if(first_start){
			createGrid(); 
		}
		
		createSnake();
		generateFruit();

		tic = setInterval(function(){
			moveSnake();
		}, speed);
	}
	

	// Création de la grille
	function createGrid(){
		  //$("#grid-container").css({'width': (largeur * 10), 'height': (hauteur *10) })
		  for (i = 0; i < nb_cases; i++){

		  var count = i + 1;
		  horizontal++
		  if(horizontal == (largeur + 1)){
		  	horizontal = 1;
		  	vertical++;
		  }
		  
		  var Case = "<div class='case' x='"+horizontal+"' y='"+vertical+"' id='"+ horizontal+ "-"+ vertical +"'></div>";  
		  $("#grid-container").append(Case);
		  
		}
	}
	
	function createSnake(){
		/*** Tête du serpent ****/
		// Choisis une case au hasard
		var randX = rand(30,(largeur -30)),
			randY = rand(30,(hauteur -30));
		
		// determine la position de la case
		var casePos = getCoordinatesPosition(randX,randY);
		// choisis une direction au hasard
		//var randDirection = directions[Math.floor(Math.random() * directions.length)];
		// place la tête dans la grille
		var snakeHead = "<div class='snake-part s1' x='"+randX+"' y='"+randY+"' style='top:"+casePos.top+"; left: "+casePos.left+"'></div>";
		$("#snake").append(snakeHead);

		for(i = 1; i < 25 ; i++){
			var casePos = getCoordinatesPosition((randX + i), randY);
			var body1 = "<div class='snake-part s"+(i+1)+"' x='"+(randX + i)+"' y='"+randY+"' style='top:"+casePos.top+"; left: "+casePos.left+"'></div>";
			$("#snake").append(body1);
		}


	}


	function generateFruit(){
		$(".fruit").remove();
		if(!fruit_exists){
			var randX = rand(1,largeur),
				randY = rand(1,hauteur);

			// determine la position de la case
			var casePos = getCoordinatesPosition(randX,randY);

			$("#"+randX+"-"+randY).addClass("fruit-on");
			var fruit = "<div class='fruit' x='"+randX+"' y='"+randY+"' style='top:"+casePos.top+"; left: "+casePos.left+"'></div>";
			$("#grid-container").append(fruit);

			fruit_exists = true;
		}
	}

	

	function moveSnake(){
		snake_size = $('.snake-part').length;
		for(i = 1; i <= snake_size; i++){
			
			// on bouge la tête en premier
			if(i == 1){
				
				var elem = $(".s"+i);

				var origX = parseInt(elem.attr("x"));
				var origY = parseInt(elem.attr("y"));

				if(Direction == "top"){
					newX = origX;
					newY = (origY - 1);
				}
				else if(Direction == "right"){
					newX = (origX +1);
					newY = origY;
				}
				else if(Direction == "bottom"){
					newX = origX;
					newY = (origY + 1);
				}
				else if(Direction == "left"){
					newX = (origX -1);
					newY = origY;
				}

				checkIfLost(newX,newY);

				if(go == true){
					goToCoordinates(".s"+i,newX, newY);
				}
				
				var prevX = origX,
					prevY = origY;

				
				var case_destination = $("#"+newX+"-"+newY);
				
				// Si le serpent choppe un fruit
				if(case_destination.hasClass('fruit-on')){
					if(speed > 80){
						speed = speed - 2;
					}					
					changeInterval(speed);
					addSnakePart();
					updateScore();
					
					case_destination.removeClass("fruit-on");
					
					generateFruit();

				}
			}
			// Le corps ensuite
			else{
				var elem = $(".s"+i);

				var origX = parseInt(elem.attr("x"));
				var origY = parseInt(elem.attr("y"));

				goToCoordinates(".s"+i,prevX, prevY);
				prevX = origX;
				prevY = origY;
			}
			
		}

	}


	function addSnakePart(){
		fruit_exists = false;

		var previous_part_x = parseInt($(".s"+snake_size).attr("x"));
		var previous_part_y = parseInt($(".s"+snake_size).attr("y"));

		var ante_previous_part_x = parseInt($(".s"+(snake_size -1)).attr("x"));
		var ante_previous_part_y = parseInt($(".s"+(snake_size -1)).attr("y"));
		
		var diffX = getDifference(previous_part_x, ante_previous_part_x);
		var diffY = getDifference(previous_part_y, ante_previous_part_y);


		if(diffX == "-1" && diffY == "0"){ // Si queue se dirige vers la droite
			var x = (previous_part_x - 1);
			var y = previous_part_y;
			var casePos = getCoordinatesPosition(x,y);
			
		}
		if(diffX == "1" && diffY == "0"){ // Si queue se dirige vers la gauche
			var x = (previous_part_x + 1);
			var y = previous_part_y;
			var casePos = getCoordinatesPosition(x,y);
			
		}
		if(diffX == "0" && diffY == "-1"){ // Si queue se dirige vers le haut
			var x = previous_part_x;
			var y = (previous_part_y - 1);
			var casePos = getCoordinatesPosition(x,y);
			
		}
		if(diffX == "0" && diffY == "1"){ // Si queue se dirige vers le bas
			var x = previous_part_x;
			var y = (previous_part_y + 1);
			var casePos = getCoordinatesPosition(x,y);
		}

		var body = "<div class='snake-part s"+(snake_size + 1)+"' x='"+x+"' y='"+y+"' style='top:"+casePos.top+"; left:"+casePos.left+"'></div>";
		$("#snake").append(body);
	}


	function checkIfLost(x,y){
		// Si le serpent se touche
		$(".snake-part").each(function(){
			if($(this).attr("x") == x && $(this).attr("y") == y){
				console.log("you lose");
				clearInterval(tic);
				$("#restart-container").css("opacity", "1");
				go = false;
			}
		})

		// Si le serpent touche le bord
		if(x <= 0 || x > largeur || y <= 0 || y > hauteur){
			clearInterval(tic);
			$("#restart-container").css("opacity", "1");
			go = false;
		}
	}

	function updateScore(){
		score = score + 10;
		$("#score-input").html(score);
	}

	function changeInterval(value){
		clearInterval(tic);
		tic = setInterval(function(){
			moveSnake();
			console.log(value);
		}, value);
	}


	/****** Appui sur fleches du clavier **********/
	$(document).keydown(function (e) {

      if (e.keyCode == 38 && Direction != "bottom") { // fleche haut
             Direction = "top";
             
      }
      if (e.keyCode == 39 && Direction != "left") { // fleche droite
             Direction = "right";
      
      }
      if (e.keyCode == 40 && Direction != "top") { // fleche bas
             Direction = "bottom";

      }
      if (e.keyCode == 37 && Direction != "right") { // fleche gauche
             Direction = "left";

      }
      if(go == false && e.keyCode == 13){
      	restartGame();
      }
	});

	$("#restart-button").click(restartGame);
	$(".reset-button").click(restartGame);

	function restartGame(){
		if(go == false){
			score = 0;
			$("#score-input").html(score);
			$("#snake").empty();
			$("#grid-container .fruit-on").removeClass("fruit-on");
			$("#restart-container").css("opacity", "0");

			Direction = "left";
		   	newX = 0;
		   	newY = 0;
		   	fruit_exists = false;
		   	snake_size = 0;
		   	go = true;
		   	speed = 120;

			first_start = false;
			startGame();
		}
		
	}
	
	

	// Utils
	function getCoordinatesPosition(x,y){
		return $("#"+x+"-"+y).offset();
	}

	function goToCoordinates(elem,x,y){
		var position = getCoordinatesPosition(x,y);

		// Déplacement de l'élément
		$(elem).css({'top': position.top, 'left': position.left});

		// Changement des attributs x et y de l'element déplacé
		$(elem).attr("x", x);
		$(elem).attr("y", y);

	}

	function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getDifference(num1, num2){
	  //var num1 = parseInt(num1);
	  //var num2 = parseInt(num2);
	  if (num1 > num2){
	    return num1-num2;
	  }
	  else if(num1 < num2){
	  	var diff = "-" + (num2-num1);
	    return diff;
	  }
	  else if(num1 == num2){
	  	return 0;
	  }
	}

});









