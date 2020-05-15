const SpaceType = {
	empty:  0,
	block:  1,

	startPiece: 2,

	knight: 3,
	bishop: 4,
	queen:  6,
	king:   7,
	pawn:   8,
};

function createGrid(value) {
	return Array(W.gdims.x).fill().map(i => new Array(W.gdims.y).fill(value));
}

// convert grid of values to array of squares
// defaults to filtering if the position is true
function gridToSquares(grid, cond)
{
	if(cond === undefined) {
		cond = (x) => x;
	}

	let squares = [];

	for(let x in grid) {
		for(let y in grid[x]) {
			if(cond(grid[x][y])) {
				squares.push(new Vector(+x, +y));
			}
		}
	}

	return squares;
}

class Board
{
	constructor(template)
	{
		this.board = createGrid(SpaceType.empty);
		this.stair = new Vector(15, 8);
		this.start = new Vector(0, 0);
		this.dragon = null;

		let setSquare = (x, y, letter) => {
			let type = SpaceType.empty;

			switch(letter) {
			case "#":
				type = SpaceType.block;
				break;
			case ">":
				this.stair = new Vector(x, y);
				break;
			case "@":
				this.start = new Vector(x, y);
				break;
			case "n":
				type = SpaceType.knight;
				break;
			case "b":
				type = SpaceType.bishop;
				break;
			case "q":
				type = SpaceType.queen;
				break;
			case "k":
				type = SpaceType.king;
				break;
			case "p":
				type = SpaceType.pawn;
				break;
			case "?":
				this.dragon = new Vector(x, y);
				break;
			}

			this.board[x][y] = type;
		};

		if(template !== undefined) {
			let rows = template.trim().split("\n");
			for(let x = 0; x < W.gdims.x; ++x) {
				for(let y = 0; y < W.gdims.y; ++y) {
					setSquare(x, y, rows[y][x]);
				}
			}
		}
	}

	at(x, y)
	{
		return this.board[x][y];
	}

	set(v, x, y) {
		return this.board[x][y] = v;
	}
};

function roomSelectionFromScore(score)
{
	if(score < 300) {
		return Rooms.a;
	} else if(score < 700) {
		return Rooms.a.concat(Rooms.b);
	} else if(score < 750) {
		return Rooms.egg;
	} else if(score < 1000) {
		return Rooms.b;
	} else if(score < 1500) {
		return Rooms.b.concat(Rooms.c);
	} else {
		return Rooms.c;
	}
}

const Rooms = {
	a: [ `
....########....
.@..########..>.
....########....
....########....
....########....
................
................
....k......k....
................
`, `
################
##............##
##.@..........##
##............##
##............##
##.........n..##
##..........>.##
##............##
################
`, `
################
##............##
##............##
##............##
##..........@.##
##..b.........##
##.>..........##
##............##
################
`, `
................
................
................
.......p........
.@....p.p.p...>.
.........p......
................
................
................
`, `
................
................
................
..........p.....
.@.......p..k.>.
..........p.....
................
................
................
`, `
................
.@.....pp.....>.
................
.#.#.#.#.#.#.#.#
################
################
####........####
####...kq...####
####........####
` ],
	b: [ `
....##p.........
.@..##..........
....##....b#....
....##....##....
....##....##....
....##....##....
....#b....##....
..........##..>.
.........p##....
`, `
...##......##...
.@.##......##.>.
...##.k..k.##...
...##..##..##...
...##..##..##...
...##..##..##...
.......##.......
...pp..##..pp...
.......##.......
`, `
.....###.....###
......###.....##
..@....###.....#
#...........p...
##.....p..n..p.>
#.....p.........
.......###.....#
......###.....##
.....###.....###
`, `
#####......#####
##.......p....##
#......np......#
....########....
.@.##########.>.
....########....
#......pn......#
##....p.......##
#####......#####
................
` ],
	c: [ `
................
#.@..#....#....#
................
..##...##...##..
..##...##...##..
................
#.pp.#.nb.#.pp.#
................
..##...##...##.>
`, `
#...##..b##...##
.@..............
..##...##...##..
.##...##...##...
........b.......
#...##...##...##
...##...##...##.
................
.##...##b..##.>.
`, `
....##......##..
....##......##..
.@......##......
........##......
.##........##...
.##...##.q.##...
......##........
..##......##..>.
..##......##....
` ],
	egg: [ `
#####.#..#.#####
....###..###....
....########....
.....######.....
.....##..##.....
.....##..##.....
.@............>.
.......?........
................
` ],
	debug: [ `
................
.@............>.
................
................
################
################
................
.k.q.n.b.p......
................
`, `
................
.@............>.
................
################
################
................
nnnnnnnnnnnnnnnn
nnnnnnnnnnnnnnnn
................
` ]
};
