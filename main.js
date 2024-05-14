const targetElements = [];
function addExamples(values) {
    seperatedValues = values.replace(/\s/g, "").split("and");
    document.querySelector(".word_one").value = seperatedValues[0];
    document.querySelector(".word_two").value = seperatedValues[1];
    createMatrix();
}

function levenshtein(str1, str2) {
  
    if (typeof(str1) !== 'string' || typeof(str2) !== 'string') throw new Error('Pass two strings!')
    
    var distances = []
    
    for (var i = 0; i <= str1.length; ++i) distances[i]    = [ i ]
    for (var i = 0; i <= str2.length; ++i) distances[0][i] =   i
    
    for (var j = 1; j <= str2.length; ++j)
      for (var i = 1; i <= str1.length; ++i)
  
        distances[i][j] =
  
          str1[i - 1] === str2[j - 1] ?
          distances[i - 1][j - 1] :    
                                       
          Math.min.apply(Math, [       
             distances[i - 1][  j  ] + 1
           , distances[  i  ][j - 1] + 1
           , distances[i - 1][j - 1] + 1
         ])
  
    return distances;
    
  }

function clearMatrix() {
    document.querySelector(".matrix-container").innerHTML = "";
    document.querySelector(".explanation-container").innerHTML = "";
}

function createMatrix(button) {
    clearMatrix();
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, 5000);
    const matrixContainer = document.querySelector(".matrix-container");
    const word1 = document.querySelector(".word_one").value;
    const word2 = document.querySelector(".word_two").value;
    if(word1 == ""|| word2 == ""){
        return;
    }
    const word1Length = word1.length + 2;
    const word2Length = word2.length + 2;
    
    let cellIndex = 0;
    let rowIndex = 0;
    let word2Index = 0;
    let colIndex = 0;
    for(var i = 0; i < word1Length; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        row.id = "row" + rowIndex;
        for(var j = 0; j < word2Length; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = cellIndex;
            row.appendChild(cell);
            if(j >= 2 && i == 0){
                cell.innerHTML = word2.charAt(word2Index);
                cell.classList.add("word");
                word2Index++;
            }
            if(j >= 1 && i == 1){
                cell.innerHTML = colIndex;
                colIndex++;
            }
            if(i >= 2 && j == 0){
                cell.innerHTML = word1.charAt(rowIndex - 2);
                cell.classList.add("word");
            }
            if(i >= 2 && j == 1){
                cell.innerHTML = rowIndex - 1;
            }
            if(j == 0){
                cell.classList.add("br");
            }
            if(i == 0){
                cell.classList.add("bb");
            }
            if(i >= 1 && j >= 1){
                cell.classList.add("value");
            }
            cellIndex++;
        }
        rowIndex++;
        matrixContainer.appendChild(row);
    }
    const levenshteinMatrix = levenshtein(word1.toLowerCase(), word2.toLowerCase());
    const shortestPath = shortestPathPositions(word1.toLowerCase(), word2.toLowerCase());

    for(let w = 0; w < shortestPath.length; w++){
        let target = word2Length + 1 + shortestPath[w]["i"] * word2Length + shortestPath[w]["j"];
        if(target < word1Length * word2Length){
            document.getElementById(target).classList.add("path");
            targetElements.push(document.getElementById(target));
        }
    }
    let ri = 1;
    let ci = 1;
    let target = i * word2Length + 2;
    for(var i = 2; i < word1Length; i++) {
        target = i * word2Length + 2;
        ci = 1;
        for(var j = 2; j < word2Length; j++) {
            let targetElement = document.getElementById(target);
            targetElement.innerHTML = levenshteinMatrix[ri][ci];
            ci++;
            target++;
        }
        ri++;
    }
    animateNeighbors();
}

function animateNeighbors() {
    const word1 = document.querySelector(".word_one").value;
    const word2 = document.querySelector(".word_two").value;
    const word1Length = word1.length + 2;
    const word2Length = word2.length + 2;
    let i = 0;
    let nodes = [];
    let row = 1;
    let col = 1;
    let index = 1;
    let target = row * word2Length + 1;
    nodes.push(document.getElementById(target));
    while(row < word1Length && col < word2Length){
        let list = [];
        list.push(document.getElementById(target));
        for(var l = 0; l < col; l++){ //row
            list.push(document.getElementById(target - l));
        }
        for(var k = 0; k < row; k++){ //column
            list.push(document.getElementById(target - k * word2Length));
        }
        nodes.push(Array.from(new Set(list)));
        row++;
        col++;
        index++;
        target = row * word2Length + index;
    }
    let tmp_list = []
    if(word2Length > word1Length){
        for(var s = word1Length; s < word2Length; s++){
            for(var m = 2; m < word1Length + 1; m++){
                let target = (m - 1) * word2Length + s;
                tmp_list.push(document.getElementById(target));
            }
        }
    }
    else if(word2Length < word1Length){
        for(var s = word2Length; s < word1Length; s++){
            for(var m = 2; m < word2Length + 1; m++){
                let target = s * word2Length +(m - 1);
                tmp_list.push(document.getElementById(target));
            }
        }

    }
    nodes.push(Array.from(new Set(tmp_list)));
    let g = 0;
    animationIntervall = setInterval(() => {
        for(var j = 0; j < nodes[g].length; j++){
            nodes[g][j].classList.add("fade-in");
        }
        g++;
        if(g == nodes.length){
            addExplanations(levenshtein(word1, word2)[word1.length][word2.length]);
            clearInterval(animationIntervall);
        }
    }, 250);
}
function shortestPathPositions(str1, str2) {
	str1 = str1.toLowerCase();
	str2 = str2.toLowerCase();
	let m = [],
		paths = [],
		l1 = str1.length,
		l2 = str2.length;
	for (let i = 0; i <= l1; i++) {
		m[i] = [i];
		paths[i] = [[i - 1, 0]];
	}
	for (let j = 0; j <= l2; j++) {
		m[0][j] = j;
		paths[0][j] = [0, j - 1];
	}
	for (let i = 1; i <= l1; i++)
		for (let j = 1; j <= l2; j++) {
			if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
				m[i][j] = m[i - 1][j - 1];
				paths[i][j] = [i - 1, j - 1];
			} else {
				let min = Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1]);
				m[i][j] = min + 1;
				if (m[i - 1][j] === min) paths[i][j] = [i - 1, j];
				else if (m[i][j - 1] === min) paths[i][j] = [i, j - 1];
				else if (m[i - 1][j - 1] === min) paths[i][j] = [i - 1, j - 1];
			}
		}

	let levenpath = [];
	let j = l2;
	for (let i = l1; i >= 0 && j >= 0; )
		for (j = l2; i >= 0 && j >= 0; ) {
			levenpath.push({ i, j });
			let t = i;
			i = paths[i][j][0];
			j = paths[t][j][1];
		}
	levenpath = levenpath.reverse();
	for (let i = 0; i < levenpath.length; i++) {
		const last = levenpath[i - 1],
			cur = levenpath[i];
		if (i !== 0) {
			if (
				cur.i === last.i + 1 &&
				cur.j === last.j + 1 &&
				m[cur.i][cur.j] !== m[last.i][last.j]
			)
				cur.type = "replace";
			else if (cur.i === last.i && cur.j === last.j + 1)
				cur.type = "insert";
			else if (cur.i === last.i + 1 && cur.j === last.j)
				cur.type = "delete";
		}
	}
	return levenpath;
}

function addExplanations(distance) {
    const explanationContainer = document.querySelector(".explanation-container");
    const finalDistance = document.createElement("p");
    finalDistance.innerHTML = "The Levenshtein distance is <b>" + distance + "</b>:";
    explanationContainer.appendChild(finalDistance);
    const word1 = document.querySelector(".word_one").value;
    const word2 = document.querySelector(".word_two").value;

    const shortest = shortestPathPositions(word1, word2);
    const list = document.createElement("ul");

    let index = 0;
    let wordPlain = word1;
    let word = word1;
    for(var i = 1; i < shortest.length; i++){
        const li = document.createElement("li");
        li.innerHTML = "";
        let string = "";
        
        if(shortest[i].type == "replace"){
            if(word1.charAt(shortest[i].i - 1) != word2.charAt(shortest[i].j - 1)){
                string = "replace " + word1.charAt(shortest[i].i - 1) + " with " + word2.charAt(shortest[i].j - 1) + " at position " + shortest[i].i;;
            }
            if(index == 0){
                word = "<b>" + word2.charAt(shortest[i].j - 1) + "</b>" + wordPlain.slice(index + 1, wordPlain.length);
                wordPlain = word2.charAt(shortest[i].j - 1) + wordPlain.slice(index + 1, wordPlain.length);
            }
            if(index != 0){
                word = wordPlain.slice(0, shortest[i].j - 1) + "<b>" + word2.charAt(shortest[i].j - 1) + "</b>" + wordPlain.slice(shortest[i].j, wordPlain.length);
                wordPlain = word.slice(0, shortest[i].j - 1) + word2.charAt(shortest[i].j - 1) + wordPlain.slice(shortest[i].j, wordPlain.length);
            }
            string = word + ": " + string;
            index++;
        }
        else if(shortest[i].type == "insert"){
            string = "insert " + word2.charAt(shortest[i].j - 1) + " at position " + shortest[i].i;
            if(index == 0){
                word = word2.charAt(shortest[i].j - 1) + wordPlain;
                wordPlain = word2.charAt(shortest[i].j - 1) + wordPlain;
            }
            if(index != 0){
                word = wordPlain.slice(0, shortest[i].j - 1) + "<b>" + word2.charAt(shortest[i].j - 1) + "</b>" + wordPlain.slice(shortest[i].j - 1, wordPlain.length);
                wordPlain = wordPlain.slice(0, shortest[i].j - 1) + word2.charAt(shortest[i].j - 1) + wordPlain.slice(shortest[i].j - 1, wordPlain.length);
            }
            string = word + ": " + string;
            index++;
        }
        else if(shortest[i].type == "delete"){
            string = "delete " + word1.charAt(shortest[i].i - 1) + " at position " + shortest[i].i;
            word = removeCharacterAtIndex(wordPlain, index);
            wordPlain = removeCharacterAtIndex(wordPlain, index);
            string = word + ": " + string;
        }
        else {
            string = "don't change " + word1.charAt(shortest[i].i - 1) + " at position " + shortest[i].i;
            if(index == 0){
                word = "<b>" + wordPlain.charAt(shortest[i].j - 1) + "</b>" + wordPlain.slice(index + 1, wordPlain.length);
            }
            if(index != 0){
                word = wordPlain.slice(0, shortest[i].j - 1) + "<b>" + wordPlain.charAt(shortest[i].j - 1) + "</b>" + wordPlain.slice(shortest[i].j, wordPlain.length);
            }
            string = word + ": " + string;
            index++;
        }
        li.innerHTML = string;
        list.appendChild(li);
    }
    explanationContainer.appendChild(list);
    //addHoverEffect(list);
}

function addHoverEffect(l) {
    const list = l.children;
    for(var i = 0; i < list.length; i++){
        list[i].addEventListener("mouseenter", () => {
            targetElements[i].classList.add("highlight");
        });
    }
}

function removeCharacterAtIndex(str, index) {
    return str.slice(0, index) + str.slice(index + 1);
}
