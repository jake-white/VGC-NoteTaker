var restrictedList, megaList, otherList, rawPokemonList;
var previews = document.getElementsByClassName("preview");
var previewColors = document.getElementsByClassName("previewcolor");
var c;

$(document).ready(function(){
	c = new Array(previews.length);
	var pkdexArray = JSONtoArray(POKEDEX_XY);
	for(var i = 0; i < previews.length; ++i)
	{
		previews[i].innerHTML += `<select>
									<option>Not Seen</option>
									<option>Brought</option>
								</select>`
		previews[i].innerHTML += `<select>
									<option>Healthy</option>
									<option>Burned</option>
									<option>Paralyzed</option>
									<option>Poisoned</option>
									<option>Fainted</option>
								</select>`
		c[i] = completely(previews[i]);
		c[i].options = pkdexArray;
	}
});

var JSONtoArray = function(JSONThing){
	var array = new Array();
	var id = 0;
	for(var thing in JSONThing){
		++id;
		JSONThing[thing]["id"] = id;
		array.push(thing);
	}
	return array;
}

var auto = function(preset){
	var presetArray = new Array(6);
	if(preset=="bigsix"){
		presetArray = ["Groudon", "Xerneas", "Kangaskhan", "Salamence", "Smeargle", "Talonflame"];
	}
	else if(preset=="rayogre"){
		presetArray = ["Rayquaza", "Kyogre"];
	}
	for(var i = 0; i < 6; ++i){
		c[i].setText('');
		if(presetArray[i] != undefined)
			c[i].setText(presetArray[i]);
	}

	analyze();
}

var bring = function(number){
	previewColors[number].style.background = color;
}
var faint = function(number){
	previewColors[number].style.background = "#ff4c4c";
}

var effects = function(id, turn){
	var elements = document.getElementsByClassName(id);
	console.log(elements[0].style);
	for(var i = 0; i < elements.length; ++i){
		if(i < turn)
			elements[i].style.background = '#43ABA4';
		else
			elements[i].style.background = '#CCE0DF';

	}
}

var clearBattle = function(){
	console.log("CLEARED")
	auto("clear"); //clearing team preview
}

var analyze = function(){
	restrictedList = new Array();
	megaList = new Array();
	otherList = new Array();
	rawPokemonList = new Array();
	document.getElementById("restricts").innerHTML = "Restricted Pokemon: ";
	document.getElementById("megas").textContent = "Potential Mega Pokemon: ";
	document.getElementById("others").textContent = "Others: ";
	for(var i = 0; i < previews.length; ++i)
	{
		var pokemon = c[i].getText();
		if(pokemon != ''){
			var properName = pokemon[0].toUpperCase() + pokemon.substring(1);
			var pokeData = POKEDEX_XY[properName];
			var thisID = ID_dex[properName];
			rawPokemonList.push(properName);
			if(pokeData["restricted"]){
				if(restrictedMegas.indexOf(properName) != -1){
					megaList.push(properName);
					document.getElementById("megas").innerHTML += "<img src='gen6icons/" + thisID + ".png'><img src='mega.png'>  |  ";
				}
				restrictedList.push(properName);
				document.getElementById("restricts").innerHTML += "<img src='gen6icons/" + thisID + ".png'>  |  ";
			}
			else if(pokeData["formes"] != undefined && 
				(pokeData["formes"].indexOf("Mega " + properName) != -1 || pokeData["formes"].indexOf("Mega " + properName + " X") != -1 || pokeData["formes"].indexOf("Mega " + properName + " Y") != -1) &&
				unlikelyMegas.indexOf(properName) == -1){
				megaList.push(properName);
				document.getElementById("megas").innerHTML += "<img src='gen6icons/" + thisID + ".png'><img src='mega.png'>  |  ";
			}
			else{
				otherList.push(properName);
				if(unlikelyMegas.indexOf(properName) != -1)				
					document.getElementById("others").innerHTML += "<img src='gen6icons/" + thisID + ".png'><img src='mega.png'> <sup>?</sup>  |  ";
				else
					document.getElementById("others").innerHTML += "<img src='gen6icons/" + thisID + ".png'>  |  ";
			}
		}
	}
}