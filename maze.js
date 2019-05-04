class UnionSet{
  constructor(size){
    this.set = new Array(size);
    for(var i = this.set.length - 1;i >= 0; i--){
      this.set[i] = -1;
    }
  }

  union(root1, root2){
    if(this.set[root1] < this.set[root2]){
        this.set[root2] = root1;
    } else {
        if(this.set[root1] === this.set[root2]){
            this.set[root2]--;
        }   
        this.set[root1] = root2;
    }   
  }

  findSet(x){
    if(this.set[x] < 0) return x;
    return this.set[x] = this.findSet(this.set[x]);
  }
  sameSet(x,y){
    return this.findSet(x) === this.findSet(y);
  }
  unionElement(x,y){
    this.union(this.findSet(x),this.findSet(y));
  }
}

class Maze{
  constructor(columns,rows,canvas){
    this.columns  = columns;
    this.rows   =   rows;
    this.cells  =   columns * rows;

    this.linkedMap  =   {};
    this.unionSets  =   new UnionSet(this.cells);
    this.canvas    =   canvas;
    this.start  = 0;
    this.startend = [];

  }

    //生成迷宫
  generate(){
    // 每次任意取两个相邻的格子，如果它们不在同一个连通集，
    // 则拆掉中间的墙，让它们连在一起成为一个连通集
    while(!this.linkedToFirstCell()){
      var cellPairs = this.pickRandomCellPairs();
      if(!this.unionSets.sameSet(cellPairs[0], cellPairs[1])){
        this.unionSets.unionElement(cellPairs[0], cellPairs[1]);
        this.addLinkedMap(cellPairs[0], cellPairs[1]);
      }   
    }   
  }

  linkedToFirstCell(){
    for(var i = 1; i < this.cells; i++){
        if(!this.unionSets.sameSet(0, i)) 
            return false;
    }   
    return true;
  }

  firstLastLinked(){
    return this.unionSets.sameSet(0,this.cells - 1);
  }
  //取出随机的两个挨着的格子
  pickRandomCellPairs(){
    var cell = (Math.random() * this.cells) >> 0;
    //再取一个相邻格子，0 = 上，1 = 右，2 = 下，3 = 左
    var neiborCells = []; 
    var row = (cell / this.columns) >> 0,
        column = cell % this.rows;
    //不是第一排的有上方的相邻元素
    if(row !== 0){ 
        neiborCells.push(cell - this.columns);
    }   
    //不是最后一排的有下面的相邻元素
    if(row !== this.rows - 1){ 
        neiborCells.push(cell + this.columns);
    }   
    if(column !== 0){ 
        neiborCells.push(cell - 1); 
    }   
    if(column !== this.columns - 1){ 
        neiborCells.push(cell + 1); 
    }   
    var index = (Math.random() * neiborCells.length) >> 0;
    return [cell, neiborCells[index]];
  }

  addLinkedMap(x, y){
    if(!this.linkedMap[x]) this.linkedMap[x] = [];
    if(!this.linkedMap[y]) this.linkedMap[y] = [];
    if(this.linkedMap[x].indexOf(y) < 0){
        this.linkedMap[x].push(y);
    }
    if(this.linkedMap[y].indexOf(x) < 0){
        this.linkedMap[y].push(x);
    }
  }

  draw(){ 
    var linkedMap = this.linkedMap;
    var cellWidth = 20,//this.canvas.width / this.columns,
        cellHeight = 20;//this.canvas.height / this.rows;
    var ctx = this.canvas.getContext("2d");
    ctx.translate(25, 25);
    for(var i = 0; i < this.cells; i++){
        var row = i / this.columns >> 0,
            column = i % this.columns;
        //画右边的竖线
        if(column !== this.columns - 1 && (!linkedMap[i] || linkedMap[i].indexOf(i + 1) < 0)){
            ctx.moveTo((column + 1) * cellWidth >> 0, row * cellHeight >> 0);
            ctx.lineTo((column + 1) * cellWidth >> 0, (row + 1) * cellHeight >> 0);
        }
        //画下面的横线
        if(row !== this.rows - 1 && (!linkedMap[i] || linkedMap[i].indexOf(i + this.columns) < 0)){
            ctx.moveTo(column * cellWidth >> 0, (row + 1) * cellHeight >> 0);
            ctx.lineTo((column + 1) * cellWidth >> 0, (row + 1) * cellHeight >> 0);
        }
    }
    //最后再一次性stroke，提高性能
    ctx.stroke();
    //画迷宫的四条边框
    this.drawBorder(ctx, cellWidth, cellHeight);
  }

  drawBorder(ctx,cellWidth,cellHeight){
    ctx.moveTo(0,0);
    ctx.lineTo(400,0);
    ctx.lineTo(400,400);
    ctx.lineTo(0,400);
    ctx.lineTo(0,0);
    ctx.moveTo(-1,-1);
    ctx.stroke();
    let num1= [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
    let start = num1[Math.floor(num1.length*Math.random())];
    let end = num1[Math.floor(num1.length*Math.random())];

    ctx.clearRect(-1+start*cellWidth,-1,cellWidth,3);
    ctx.clearRect(-1+end*cellWidth,398,cellWidth,3);

  }

}

const column = 20,
      row = 20;
var canvas = document.getElementById("mazecan");
var maze = new Maze(column, row, canvas);

maze.generate();

maze.draw();
