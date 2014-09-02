"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""
from random import choice, random

BASIC_TESTS = [
    ("..........",
     ".1X.......",
     ".2X.X.....",
     ".XXX......",
     ".X..F.....",
     ".X........",
     ".X..X.....",
     ".X..X.....",
     "..3.X...4.",
     "....X....."),
    ("1...2",
     ".....",
     "..F..",
     ".....",
     "3...4"),
    ("..2..",
     ".....",
     "1.F.3",
     ".....",
     "..4.."),

]

EXTRA_TESTS = [
    (
        "..........",
        ".F..XXXXX.",
        "..........",
        ".X........",
        ".X........",
        ".X........",
        ".X........",
        ".X......4.",
        ".X.....3X2",
        "........1.",
    ),
    (
        ".X...X4..",
        "X..X.X...",
        "3.XX.XX..",
        "XXXX.XXX.",
        "....F....",
        ".XXX.XXXX",
        "..XX.XX.1",
        "...X.X..X",
        "..2X...X.",
    ),
    (
        ".....",
        "..F..",
        ".....",
        "2.X.4",
        ".1X3.",
    ),
    (
        "2.......",
        "X.XXX.X.",
        ".F..X.X.",
        "..X.X.X.",
        "1.3...X4",
    )

]

RANDOM_TEMPLATES = [
    (
        "..........",
        ".0.W.W.....",
        "..........",
        ".0.W.W....",
        "...W.W.F..",
        "...W.W....",
        ".0.W.W....",
        "..........",
        ".0.W.W....",
        "..........",
    ),
    (
        ".....",
        "WWWWW",
        "WW...",
        "..0..",
        ".0X0.",
        ".W0..",
        ".W...",
        "..F..",
        ".....",
    ),
    (
        "0........0",
        ".WWW.W.W..",
        ".WWW.W.W..",
        ".WWW......",
        "....F.WW..",
        "..........",
        "....WW..W.",
        "....WWW...",
        "...WWWWW..",
        "0.WWWWWWW.0",
    )
]

TESTS = {
    "1. Basics": [

    ],
    "2. Extra": [
    ],
    "3. Random": [

    ],

}

for t in BASIC_TESTS:
    TESTS["1. Basics"].append({"input": t, "answer": t})

for t in EXTRA_TESTS:
    TESTS["2. Extra"].append({"input": t, "answer": t})


def generate_from_template(temp):
    wmap = [list(row) for row in temp]
    stations = ["1", "2", "3", "4"]
    for i, row in enumerate(wmap):
        for j, ch in enumerate(row):
            if ch == "0":
                wmap[i][j] = choice(stations)
                stations.remove(wmap[i][j])
            if ch == "W":
                wmap[i][j] = "X" if random() > 0.5 else "."
    return ["".join(row) for row in wmap]


for _ in range(2):
    for template in RANDOM_TEMPLATES:
        t = generate_from_template(template)
        TESTS["0. Random"].append({"input": t, "answer": t})


