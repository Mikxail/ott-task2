function generateMatrix(n, maxVal){
    maxVal = maxVal || 100;
    if (!n || n < 1) throw new Error("N should be positive value");

    var len = n * 2 - 1;
    var ret = (new Array(len)).fill(0);
    ret = ret.map(function(){
        return (new Array(len)).fill(0).map(function(){
            return Math.random() * maxVal | 0;
        });
    });
    return ret;
}

function padStr(str, len, char){
    str = String(str);
    char = typeof char == "undefined" ? " " : char;
    char = String(char);
    while (str.length < len) {
        str = char + str;
    }
    return str;
}

function printMatrix(arr, len) {
    len = len || 2;
    arr.forEach(function(row){
        console.log(row.map(s => padStr(s, len)).join(" "));
    });
}

function serializeMatrix_simple(arr) {
    if (!Array.isArray(arr)) throw new Error("arr should be Array");
    var maxY = arr.length;
    var centerY = maxY / 2 | 0;
    if (!Array.isArray(arr[0])) throw new Error("row array should be Array");
    var maxX = arr[0].length;
    var centerX = maxX / 2 | 0;

    var ret = [];
    var direction = 0;
    var x = centerX;
    var y = centerY;

    function calculateNewXY(){
        switch (direction % 4) {
            case 0: y--; break;
            case 1: x++; break;
            case 2: y++; break;
            case 3: x--; break;
        }
    }
    var w = 1;
    var h = 1;

    for (var n = 0, l = maxX * maxY; n<l; n++) {
        ret.push(arr[x][y]);
        var pd = direction;
        if (Math.abs(x - centerX) == w && direction % 2 == 1) {
            if (direction == 3) {
                w++;
            }
            direction++;
        } else if (Math.abs(y - centerY) == h && direction % 2 == 0) {
            if (direction == 2) {
                h++;
            }
            direction++;
        }
        calculateNewXY();
    }
    return ret;
}

function serializeMatrix(arr, startDirection){
    if (!Array.isArray(arr)) throw new Error("arr should be Array");
    var maxY = arr.length;
    var centerY = maxY / 2 | 0;
    if (!Array.isArray(arr[0])) throw new Error("row array should be Array");
    var maxX = arr[0].length;
    var centerX = maxX / 2 | 0;

    var ret = [];
    startDirection = typeof startDirection == 'undefined' ? 1 : startDirection;
    var direction = startDirection;

    var centerXY = [centerX, centerY];
    var xy = [centerX, centerY];
    var maxXY = [1, 1];
    for (var n = 0, l = maxX * maxY; n<l; n++) {
        ret.push(arr[xy[0]][xy[1]]);
        var ndirection = direction % 4;
        var el = (ndirection & 1);
        var op = (ndirection & 2) - 1;
        xy[el] += op;
        if (Math.abs(xy[el] - centerXY[el]) == maxXY[el]) {
            if (ndirection == ((startDirection+2)%4) || ndirection == ((startDirection+3)%4)) {
                maxXY[el]++;
            }
            direction++;
        }
    }
    return ret;
}

var N = process.argv[2];
N = Number(N);
N = N || 3;

var matrix = generateMatrix(N);
console.log("Matrix:");
printMatrix(matrix);

console.log("Simple serialization:", serializeMatrix_simple(matrix).join(" "));
console.log("");
console.log("Serialization (start left):", serializeMatrix(matrix).join(" "));
console.log("Serialization (start down):", serializeMatrix(matrix,2).join(" "));
console.log("Serialization (start right):", serializeMatrix(matrix,3).join(" "));
console.log("Serialization (start up):", serializeMatrix(matrix,4).join(" "));
