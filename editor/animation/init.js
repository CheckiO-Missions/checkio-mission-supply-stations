//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'supply_routes';

            var checkioInput = data.in || ["..2..", ".....", "1.F.3", ".....", "..4.."];
            var checkioInputStr = fname + '((';
            for (var i = 0; i < checkioInput.length; i++) {
                checkioInputStr += '<br>"' + checkioInput[i] + '",';
            }
            checkioInputStr += "))";

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');

            var svg = new SupplyStations($content.find(".explanation")[0]);
            svg.prepare(checkioInput);


            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_addon = data.ext["result_addon"];

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];

                svg.routes(userResult);

                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));
                if (!result) {
                    $content.find('.answer').html(result_addon);
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }

            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });

        function SupplyStations(dom) {

            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var colors = ["#66CC66", "#FF6666", colorOrange1, colorBlue1];

            var p = 10;

            var cell = 40;

            var sizeX, sizeY;

            var paper;
            var map = [];

            var stations = [];
            var factory;
            var factoryFills = {};

            var attrCell = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorGrey1};
            var aText = {"font-family": "Roboto", "font-weight": "bold", "font-size": cell * 0.9};

            this.prepare = function (data) {
                sizeX = cell * data[0].length + 2 * p;
                sizeY = cell * data.length + 2 * p;
                paper = Raphael(dom, sizeX, sizeY);

                for (var row = 0; row < data.length; row++) {
                    var temp = [];
                    for (var col = 0; col < data[0].length; col++) {
                        var r = paper.rect(p + cell * col, p + cell * row, cell, cell).attr(attrCell);
                        var ch = data[row][col];
                        r.mark = ch;
                        temp.push(r);
                        if (ch == "F") {
                            factory = [row, col];
                            r.attr("stroke-width", 5);
                            factoryFills = paper.set();
                            var center = [p + col * cell + cell / 2, p + row * cell + cell / 2];
                            factoryFills = {
                                "S": paper.path([
                                    ["M", p + cell * col, p + cell * row],
                                    ["H", p + cell * col + cell],
                                    ["L", center[0], center[1]],
                                    ["Z"]
                                ]).attr(attrCell),

                                "W": paper.path([
                                    ["M", p + cell * col + cell, p + cell * row],
                                    ["V", p + cell * row + cell],
                                    ["L", center[0], center[1]],
                                    ["Z"]
                                ]).attr(attrCell),
                                "N": paper.path([
                                    ["M", p + cell * col + cell, p + cell * row + cell],
                                    ["H", p + cell * col],
                                    ["L", center[0], center[1]],
                                    ["Z"]
                                ]).attr(attrCell),
                                "E": paper.path([
                                    ["M", p + cell * col, p + cell * row + cell],
                                    ["V", p + cell * row],
                                    ["L", center[0], center[1]],
                                    ["Z"]
                                ]).attr(attrCell)};
                        }
                        else if (ch == "X") {
                            r.attr("fill", colorGrey4);
                        }
                        else if ("1234".indexOf(ch) !== -1) {
                            var t = paper.text(p + cell * col + cell / 2, p + cell * row + cell / 2, ch).attr(aText);
                            r.attr("fill", colors[Number(ch) - 1]);
                            stations[Number(ch) - 1] = [row, col];
                        }
                    }
                    map.push(temp);
                }
                map[factory[0]][factory[1]].attr("fill-opacity", 0).toFront();
            };


            var DIRS = {
                "N": [-1, 0],
                "S": [1, 0],
                "W": [0, -1],
                "E": [0, 1]
            };

            this.routes = function (data) {
                var tCount = 0;
                var stepTime = 200;
                var fullStepTime = 300;
                if (!data || !data.length || data.length != 4) {
                    return false;
                }
                for (var i = 0; i < 4; i++) {
                    var st = stations[i];
                    var color = colors[i];
                    if (typeof data[i] != "string") {
                        continue;
                    }
                    var route = data[i];
                    for (var c = 0; c < route.length; c++) {
                        var ch = route[c];

                        if ("NSWE".indexOf(ch) === -1) {
                            break;
                        }
                        var row = st[0] + DIRS[ch][0];
                        var col = st[1] + DIRS[ch][1];
                        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
                            setTimeout(function(x, y, cl) {
                                return function() {
                                    paper.rect(p + cell * x, p + cell * y, cell, cell).attr(
                                {"stroke": colorBlue4, "stroke-width": 0, "fill": cl});
                                }}(col, row, color), fullStepTime * tCount);
                            tCount++;
                            break;
                        }

                        var r = map[row][col];

                        if (r.mark === "." || "1234".indexOf(r.mark) !== -1) {
                            setTimeout(function(el, cl) {
                                return function() {
                                    el.animate({"fill": cl}, stepTime);
                                }}(r, color), fullStepTime * tCount);
                            r.mark = String(i + 1);
                            tCount++;
                        }
                        else if (r.mark === "X") {
                            setTimeout(function(x, y, cl) {
                                return function() {
                                    paper.circle(p + cell * x + cell / 2, p + cell * y + cell / 2, cell / 4).attr(
                                {"stroke": colorBlue4, "stroke-width": 2, "fill": cl});
                                }}(col, row, color), fullStepTime * tCount);
                            tCount++;
                            break;
                        }
                        else if (r.mark === "F") {
                            setTimeout(function(numb, cl) {
                                return function() {
                                    factoryFills[numb].attr("fill", cl);
                                }}(ch, color), fullStepTime * tCount);
                            tCount++;
                        }
                        st = [row, col];
                    }

                }
            }
        }


    }
);
