"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"

checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.

checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.

"""

from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
from checkio.referees import checkers

from tests import TESTS


cover = """def cover(f, data):
    return f(tuple(data))
"""

DIRS = {
    "N": (-1, 0),
    "S": (1, 0),
    "W": (0, -1),
    "E": (0, 1),
}

def checker(the_map, result):
    if (not isinstance(result, (tuple, list)) or len(result) != 4 or
            any(not isinstance(r, str) for r in result)):
        return False, "The result must be a list/tuple of four strings"
    stations = [None] * 4
    factory = None
    factory_supply = [0] * 4
    for i, row in enumerate(the_map):
        for j, ch in enumerate(row):
            if ch in "1234":
                stations[int(ch) - 1] = (i, j)
            if ch == "F":
                factory = (i, j)
    wmap = [list(row) for row in the_map]
    width = len(wmap[0])
    height = len(wmap)
    for numb, route in enumerate(result, 1):
        coor = stations[numb - 1]
        for i, ch in enumerate(route):
            if ch not in DIRS.keys():
                return False, "Routes must contain only NSWE"
            row, col = coor[0] + DIRS[ch][0], coor[1] + DIRS[ch][1]
            if not (0 <= row < height and 0 <= col < width):
                return False, "Ooops, we lost the route from station {}".format(numb)
            checked = wmap[row][col]
            if checked == "X":
                return False, "The route {} was struck {} {}".format(numb, coor, (row, col))
            if checked == "F":
                factory_supply[numb - 1] = 1
                if i >= len(route):
                    return False, "A route should be ended in the factory"
                break
            if checked != ".":
                return False, "Don't intersect routes"
            wmap[row][col] = str(numb)
            coor = row, col
    if factory_supply != [1, 1, 1, 1]:
        return False, "You should deliver all four resources"
    return True, "Great!"


api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        cover_code={
            'python-27': cover,  # or None
            'python-3': cover
        },
        function_name="supply_routes",
        checker=checker,
        # checker=None,  # checkers.float.comparison(2)
        # add_allowed_modules=[],
        # add_close_builtins=[],
        # remove_allowed_modules=[]
    ).on_ready)
