var restrictedList, megaList, otherList, rawPokemonList;
var previews = document.getElementsByClassName("preview");
var atk, def, spatk, spdef, spe, acc, eva, valueMem;
var previewColors = document.getElementsByClassName("previewcolor");
var statElements = document.getElementsByClassName("statElements");
var statConversion;
var pkdexArray;
var c;

$(document).ready(function(){ //called when jquery determines the page is ready
	atk = [0,0,0,0,0,0,0];
	def = [0,0,0,0,0,0,0];
	spatk = [0,0,0,0,0,0,0];
	spdef = [0,0,0,0,0,0,0];
	spe = [0,0,0,0,0,0,0];
	acc = [0,0,0,0,0,0,0];
	eva = [0,0,0,0,0,0,0];
	setStatuses();
	pkdexArray = JSONtoArray(POKEDEX_XY);
	c = new Array(previews.length);
	valueMem = new Array(previews.length);
	for(var i = 0; i < previews.length; ++i)
	{
		valueMem[i] = ["Attack = 0"];
		previews[i].innerHTML = `<select>
									<option>Not Seen</option>
									<option>Brought</option>
								</select>
								<select>
									<option>Healthy</option>
									<option>Burned</option>
									<option>Paralyzed</option>
									<option>Poisoned</option>
									<option>Fainted</option>
								</select>` + previews[i].innerHTML;
		c[i] = completely(previews[i]);
		c[i].options = pkdexArray;
	}
});

var JSONtoArray = function(JSONThing){ //converts JSON to array of things
	var array = new Array();
	var id = 0;
	for(var thing in JSONThing){
		++id;
		JSONThing[thing]["id"] = id;
		array.push(thing);
	}
	return array;
}

var auto = function(preset){ //auto select a team
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

var effects = function(id, turn){ //editing a field effect
	var elements = document.getElementsByClassName(id);
	for(var i = 0; i < elements.length; ++i){
		if(i < turn)
			elements[i].style.background = '#43ABA4';
		else
			elements[i].style.background = '#CCE0DF';

	}
}

var clearBattle = function(){ //clearing effects, statuses, pokemon, etc
	effects('tw_player', 0);
	effects('tw_opp', 0);
	effects('tr', 0);
	effects('taunt', 0);
	effects('encore', 0);
	atk = [0,0,0,0,0,0,0];
	def = [0,0,0,0,0,0,0];
	spatk = [0,0,0,0,0,0,0];
	spdef = [0,0,0,0,0,0,0];
	spe = [0,0,0,0,0,0,0];
	acc = [0,0,0,0,0,0,0];
	eva = [0,0,0,0,0,0,0];
	for(var i = 0; i < previews.length; ++i){
		previews[i].innerHTML = '<div class = "statElements"></div>';
	}
	setStatuses();
	for(var i = 0; i < previews.length; ++i){
		previews[i].innerHTML = `<select>
									<option>Not Seen</option>
									<option>Brought</option>
								</select>
								<select>
									<option>Healthy</option>
									<option>Burned</option>
									<option>Paralyzed</option>
									<option>Poisoned</option>
									<option>Fainted</option>
								</select>` + previews[i].innerHTML;
		c[i] = completely(previews[i]);
		c[i].options = pkdexArray;
	}
	auto("clear"); //clearing team preview
}

var setStatuses = function(){ //updates all boosts/drops
	for(var i = 0; i < previews.length; ++i){
		statElements[i].innerHTML=`<select id='stat` + i + `'>
									<option>Attack = ` + atk[i] + `</option>
									<option>Defense = ` + def[i] + `</option>
									<option>Special Attack = ` + spatk[i] + `</option>
									<option>Special Defense = ` + spdef[i] + `</option>
									<option>Speed = ` + spe[i] + `</option>
									<option>Accuracy = ` + acc[i] + `</option>
									<option>Evasion = ` + eva[i] + `</option>
								</select>
								<input type='button' onclick='statInc(`+i+`, 1);' value='+'>
								<input type='button' onclick='statInc(`+i+`, -1);' value='-'>`
		statConversion = {
			"Attack": atk,
			"Defense": def,
			"Special Attack": spatk,
			"Special Defense": spdef,
			"Speed": spe,
			"Accuracy": acc,
			"Evasion": eva
		}
	}
}

var statInc = function(id, inc){
	var originalValue = document.getElementById("stat"+id).value;
	var value = originalValue.substring(0, originalValue.indexOf('=')-1);
	if(statConversion[value][id]+inc <= 6 && statConversion[value][id]+inc >= -6)
	statConversion[value][id]+=inc;
	setStatuses();
	valueMem[id] = originalValue.substring(0, originalValue.indexOf('=') + 1) + ' ' + statConversion[value][id]; //so we can remember what the selector was on last
	for(var i = 0; i < valueMem.length; ++i){
		document.getElementById("stat"+i).value = valueMem[i];
	}
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