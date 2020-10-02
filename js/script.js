let car = [ {}, 
    { X: 90, Y: 381 },

    // Верх машины
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

    // Крыло справа
    { X: 650, Y: 381 },
    { X: 610, Y: 330 },
    { X: 575, Y: 320 },
    { X: 540, Y: 330 },
    { X: 500, Y: 381 },

    { X: 500, Y: 381 },
    { X: 280, Y: 381 },

    // Крыло слева
    { X: 280, Y: 381 },
    { X: 240, Y: 330 },
    { X: 205, Y: 320 },
    { X: 170, Y: 330 },
    { X: 130, Y: 381 },

    { X: 130, Y: 381 },
    { X: 90, Y: 381 },

    { X: 90, Y: 381 }
];

let plot = function (x, y, c) {
    if (isFinite(x) && isFinite(y)) {
        let color = { r: plot.color.r, g: plot.color.g, b: plot.color.b, a: plot.color.a * c };
        setPixel(x, y, color);
    }
};

// функция установки пикселя в js
let setPixel = (x, y, c) => {
    c = c || 1;
    let p = ctx.createImageData(1, 1);
    p.data[0] = c.r;
    p.data[1] = c.g;
    p.data[2] = c.b;
    p.data[3] = c.a;
    let data = ctx.getImageData(x, y, 1, 1).data;
    if (data[3] <= p.data[3])
        ctx.putImageData(p, x, y);
};

let drawSpline = (coords, k, color) => {
    let num = 0;
    for (let i = 0; i < 2 * k; i += 2) {
        if (i > 0) {
            let deltaX = coords[i / 2 + 1].X - coords[i / 2].X;
            let deltaY = coords[i / 2 + 1].Y - coords[i / 2].Y;
            num += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }
    }
    coords[0] = coords[1];
    coords[coords.length] = coords[coords.length - 1];
    plot.color = color;

    // в цикле по всем четвёркам точек
    for (let i = 1; i <= coords.length - 3; i++) {

        let a = [], b = [];
        arrs = { a: a, b: b };

        // считаем коэффициенты q  
        _SplineCoefficient(i, arrs, coords);

        // создаём массив промежуточных точек
        let points = {};

        for (let j = 0; j < num; j++) {

            // шаг интерполяции
            let t = j / num;

            // передаём массиву точек значения по методу beta-spline
            points.X = (arrs.a[0] + t * (arrs.a[1] + t * (arrs.a[2] + t * arrs.a[3])));
            points.Y = (arrs.b[0] + t * (arrs.b[1] + t * (arrs.b[2] + t * arrs.b[3])));

            plot(points.X, points.Y, color.a / 255);
        }
    }
};

// в функции рассчитываютс¤ коэффициенты a0-a3, b0-b3
let _SplineCoefficient = (i, arrs, coords) => {
    arrs.a[3] = (-coords[i - 1].X + 3 * coords[i].X - 3 * coords[i + 1].X + coords[i + 2].X) / 6;
    arrs.a[2] = (coords[i - 1].X - 2 * coords[i].X + coords[i + 1].X) / 2;
    arrs.a[1] = (-coords[i - 1].X + coords[i + 1].X) / 2;
    arrs.a[0] = (coords[i - 1].X + 4 * coords[i].X + coords[i + 1].X) / 6;
    arrs.b[3] = (-coords[i - 1].Y + 3 * coords[i].Y - 3 * coords[i + 1].Y + coords[i + 2].Y) / 6;
    arrs.b[2] = (coords[i - 1].Y - 2 * coords[i].Y + coords[i + 1].Y) / 2;
    arrs.b[1] = (-coords[i - 1].Y + coords[i + 1].Y) / 2;
    arrs.b[0] = (coords[i - 1].Y + 4 * coords[i].Y + coords[i + 1].Y) / 6;
};

// Инициализируем канвас
let ctx = document.getElementById("canvas").getContext('2d');

// Очищаем канвас
ctx.clearRect(0, 0, 1500, 800);

// Рисуем сплайн
drawSpline(car, car.length - 1, { r: 0, g: 0, b: 0, a: 255 });

ctx.beginPath()
ctx.strokeStyle = "black"

// Колесо справа
ctx.beginPath()
ctx.arc(575, 381, 40, 0, 2 * Math.PI)
ctx.stroke()

// Колесо слева
ctx.beginPath()
ctx.arc(205, 381, 40, 0, 2 * Math.PI)
ctx.stroke()