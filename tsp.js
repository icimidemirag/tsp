//İçimi Demirağ - 191180033

var permute = function(nums){
  var result = [];
  var backtrack = (i, nums) => {
    if(i===nums.length){
      result.push(nums.slice());
      return;
    }  
    for(let j = i; j < nums.length; j++){
      [nums[i],nums[j]] = [nums[j],nums[i]];
      backtrack(i+1, nums);
      [nums[i],nums[j]] = [nums[j],nums[i]];
    }
  }
  backtrack(0, nums);
  return result;
};

function tsp(node, matrix){
  let temp = [];

  for (let i = 0; i < matrix.length; i++) {
      if (i != node) {
          temp.push(i);
      }
  }

  let allPermutation = permute(temp);

  let min_path = Number.MAX_SAFE_INTEGER;
  let weights = [];
  
  for(let item of allPermutation){
      let weight = 0;
      item.unshift(node);
      item.push(node);
      //0,1,2,3,4,5
      //A,B,C,D,E,A
      //length 6 ama i = 4'e kadar olmalı
      for (let i = 0; i < item.length-1; i++) {
          if(matrix[item[i]][item[i+1]] <= 0){
              weight = 0;
              break;
          } 
          weight += matrix[item[i]][item[i+1]];
      }

      if (weight < min_path && weight !== 0) {
          min_path = weight;
      }

      weights.push(weight);
  }

  for(let item of allPermutation){
    for (let i = 0; i <= matrix.length; i++) {
      item[i] = String.fromCharCode(item[i]+65);
    }
  }

  return [min_path, weights, allPermutation];
}

function start() {
  
  const n = Number(document.getElementById("n").value) || 0;
  const snode = Number(document.getElementById("snode").value) || 0;

  if ( !(3 < n && n < 100)) {
    alert("En az 3 — en fazla 100 şehir olmalı.");
    return;
  }

  if (0 > snode || snode > n-1) {
    alert("Başlangıç nodu düğüm sayısı kadar olmalıdır.");
    return;
  }

  min = Math.ceil(n);
  max = Math.floor((n * (n - 1)) / 2);
  let e = Math.floor(Math.random() * (max - min + 1) + min);

  console.log(e);

  const matrix = [];

  var nodeDataArray = [];
  var linkDataArray = [];

  for (let i = 0; i < n; i++) {
    matrix.push([]);
    nodeDataArray.push({ key: i, text: String.fromCharCode(i+65) });
  }

  
  for(let x = 0; x < e; x++){
    let i = Math.floor(Math.random() * n);
    let j = Math.floor(Math.random() * n);
    x--;
    if (i != j) {
      if (matrix[i][j] == null) {
        let weight = Math.floor(Math.random() * 10);
        if(weight!==0){
          linkDataArray.push({ from: i, to: j, text: weight, color:"black" });
          x++;
        }
        matrix[i][j] = weight;
        matrix[j][i] = weight;
      }
    }
  } 
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === undefined) {
        matrix[i][j] = 0;
      }
    }
  }

  let [min_path, weights, allPermutation] = tsp(snode,matrix);

  const txt = document.querySelector("#text");
  let text = "Adjacency Matrix: <br>";
  for (let item of matrix) {
    text += "&emsp;" + item + "<br>";
  }
  text += "<br>";

  let bests = "";
  let flag = true;

  for (let i = 0; i < allPermutation.length; i++) {
    if(weights[i] !== 0){
      text += [ ...allPermutation[i]] + " = " + weights[i];
      if(weights[i] === min_path){
        text += " <-- optimal <br>";
        bests += "&emsp;" + [ ...allPermutation[i]] + "<br>";

        if(flag){
          flag = false;
          const colorPaths = [...allPermutation[i]]        
          for(let i = 0; i<colorPaths.length-1; i++){
            let item = linkDataArray.find(item=>String.fromCharCode(item.from+65) === colorPaths[i] && String.fromCharCode(item.to+65) === colorPaths[i+1])
            if(item){
              item.color = "lime"
            }
            else{
              item = linkDataArray.find(item=>String.fromCharCode(item.to+65) === colorPaths[i] && String.fromCharCode(item.from+65) === colorPaths[i+1])
              if(item){
                item.color = "lime"
              }
            }
          }
        }
        
      }else{
        text += " <br>";
      }
    }
  }
  text += "<br>";

  text += (min_path===Number.MAX_SAFE_INTEGER ? "No solution.": "Best solution/s : " + min_path + "<br>"+ bests)  + "<br>";

  txt.innerHTML = text;
  
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}