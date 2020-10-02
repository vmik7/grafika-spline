var car = [ {}, 
    { X: 90, Y: 381 },
    { X: 90, Y: 381 },
    { X: 94, Y: 300 },
    { X: 260, Y: 300 },
    { X: 340, Y: 200 },
    { X: 418, Y: 200 },
    { X: 600, Y: 200 },
    { X: 596, Y: 258 },
    { X: 681, Y: 312 },
    { X: 681, Y: 381 },
    { X: 681, Y: 381 },
    { X: 650, Y: 381 },

    // Колесо справа
    { X: 650, Y: 381 },
    { X: 610, Y: 330 },
    { X: 575, Y: 320 },
    { X: 540, Y: 330 },
    { X: 500, Y: 381 },

    { X: 500, Y: 381 },
    { X: 280, Y: 381 },

    // Колесо слева
    { X: 280, Y: 381 },
    { X: 240, Y: 330 },
    { X: 205, Y: 320 },
    { X: 170, Y: 330 },
    { X: 130, Y: 381 },

    { X: 130, Y: 381 },
    { X: 90, Y: 381 },
    { X: 90, Y: 381 }
];
var car_k = car.length - 1;

var plot = function (x, y, c) { // ”становить пиксель в т. (x, y) с прозрачностью c 
    if (isFinite(x) && isFinite(y)) {
        var color = {
            r: plot.color.r,
            g: plot.color.g,
            b: plot.color.b,
            a: plot.color.a * c
        };

        setPixel(x, y, color);
    }
};

function setPixel(x, y, c) { // функция установки пикселя в js
    c = c || 1;
    var p = ctx.createImageData(1, 1);
    p.data[0] = c.r;
    p.data[1] = c.g;
    p.data[2] = c.b;
    p.data[3] = c.a;
    var data = ctx.getImageData(x, y, 1, 1).data;
    if (data[3] <= p.data[3])
        ctx.putImageData(p, x, y);
}

function drawSpline(coords, k, color) {
    var num = 0;
    for (var i = 0; i < 2 * k; i += 2) {
        if (i > 0) {
            var deltaX = coords[i / 2 + 1].X - coords[i / 2].X;
            var deltaY = coords[i / 2 + 1].Y - coords[i / 2].Y;
            num += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }
    }
    coords[0] = coords[1];
    coords[coords.length] = coords[coords.length - 1];
    plot.color = color;
    for (var i = 1; i <= coords.length - 3; i++)// в цикле по всем четвёркам точек
    {
        var a = [], b = [];
        arrs = { a: a, b: b };
        _SplineCoefficient(i, arrs, coords);// считаем коэффициенты q   `
        var points = {};// создаём массив промежуточных точек
        for (var j = 0; j < num; j++) {
            var t = j / num;// шаг интерполяции
            // передаём массиву точек значения по методу beta-spline
            points.X = (arrs.a[0] + t * (arrs.a[1] + t * (arrs.a[2] + t * arrs.a[3])));
            points.Y = (arrs.b[0] + t * (arrs.b[1] + t * (arrs.b[2] + t * arrs.b[3])));
            plot(points.X, points.Y, color.a / 255);
        }
    }
}

function _SplineCoefficient(i, arrs, coords)// в функции рассчитываютс¤ коэффициенты a0-a3, b0-b3
{
    arrs.a[3] = (-coords[i - 1].X + 3 * coords[i].X - 3 * coords[i + 1].X + coords[i + 2].X) / 6;
    arrs.a[2] = (coords[i - 1].X - 2 * coords[i].X + coords[i + 1].X) / 2;
    arrs.a[1] = (-coords[i - 1].X + coords[i + 1].X) / 2;
    arrs.a[0] = (coords[i - 1].X + 4 * coords[i].X + coords[i + 1].X) / 6;
    arrs.b[3] = (-coords[i - 1].Y + 3 * coords[i].Y - 3 * coords[i + 1].Y + coords[i + 2].Y) / 6;
    arrs.b[2] = (coords[i - 1].Y - 2 * coords[i].Y + coords[i + 1].Y) / 2;
    arrs.b[1] = (-coords[i - 1].Y + coords[i + 1].Y) / 2;
    arrs.b[0] = (coords[i - 1].Y + 4 * coords[i].Y + coords[i + 1].Y) / 6;
}

var ctx = document.getElementById("canvas").getContext('2d');

ctx.clearRect(0, 0, 1500, 800);

drawSpline(car, car_k, { r: 0, g: 0, b: 0, a: 255 }, car[car_k - 3].X, car[car_k - 3].Y, car[car_k - 2].X, car[car_k - 2].Y, car[car_k - 1].X, car[car_k - 1].Y, car[car_k].X, car[car_k].Y);

ctx.beginPath()
ctx.strokeStyle = "black"

ctx.beginPath()
ctx.arc(575, 381, 40, 0, 2 * Math.PI)
ctx.stroke()

ctx.beginPath()
ctx.arc(205, 381, 40, 0, 2 * Math.PI)
ctx.stroke()