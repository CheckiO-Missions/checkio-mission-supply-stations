"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""
BASIC_TESTS = [
    ("..........",
     ".1X.......",
     ".2X.X....",
     ".XXX.....",
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

TESTS = {
    "Basics": [

    ],
    # "Extra": [
    # ]
}

for t in BASIC_TESTS:
    TESTS["Basics"].append({"input": t, "answer": t})