var ID = 0;
const DEFAULT_LINE_W = 1;
const DEFUALT_STROKE = 'white'

// parent class
class Shape {
    constructor(padding, remainSpace) {
        this.ID = shapeID();
        this.padding = padding;

        this.remainSpace = remainSpace;
        this.next = null;
    }
}


class Circle extends Shape {
    constructor(options) {
        let padding = options.padding || 0;
        let lineWidth = options.lineWidth || DEFAULT_LINE_W;
        let stroke = options.stroke || DEFUALT_STROKE;
        super(padding, 100-padding);
        this.lineWidth = lineWidth;
        this.stroke = stroke;
    }

    draw(drawing, x0, y0, radius, angle) {
        console.log('drawing:', this, 'radius:', radius);
        
        var circle = svgCreate('circle', {
            'cx': x0,
            'cy': y0,
            'r': radius,
            'stroke': this.stroke,
            'stroke-width': this.lineWidth,
            'fill': 'none',
            'transform': `rotate(${angle},${x0},${y0})`
        });
        drawing.appendChild(circle);

        if(this.next !== null) {
            let newRadius = radius*this.remainSpace*0.01;
            this.next.draw(drawing, x0, y0, newRadius, angle);
        }
    }
}


class Text extends Shape {
    constructor(text, options) {
        let fontSize = options.fontSize || 20;
        let padding = options.padding || 0;
        let stroke = options.stroke || DEFUALT_STROKE;
        let font = options.font || 'Times'

        super(padding, 0);
        this.font = font;
        this.fontSize = fontSize;
        this.text = text;
        this.stroke = stroke;
    }

    draw(drawing, x0, y0, radius, angle) {
        console.log('drawing:', this, 'radius:', radius, 'angle', angle);

        var text = svgCreate('text', {
            'x': x0,
            'y': y0,
            'stroke': this.stroke,
            'font-size': radius*0.01*this.fontSize,
            'font-family': this.font,
            'alignment-baseline': 'middle',
            'text-anchor': "middle",
            'transform': `rotate(${angle},${x0},${y0})`
        });
        text.textContent = this.text;
        drawing.appendChild(text);
    }

    //leaf element, no next draw
}


class CircleText extends Shape {
    constructor(text, options) {
        let fontSize = options.fontSize || 14;
        let padding = options.padding || 0;
        let font = options.font || 'Times'
        let stroke = options.stroke || DEFUALT_STROKE;

        super(padding, 100-padding-fontSize);
        this.font = font;
        this.fontSize = fontSize;
        this.text = text;
        this.stroke = stroke;
    }

    draw(drawing, x0, y0, radius, angle) {
        console.log('drawing:', this, 'radius:', radius);

        var text = svgCreate('text', {
            'font-size': radius*0.01*this.fontSize,
            'font-family': this.font,
        });
        text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        var textPath = svgCreate('textPath', {
            'href': '#pathFor'+this.ID,
            'stroke': this.stroke,
            'font-size': radius*0.01*this.fontSize,
            'font-family': this.font,
            'textLength': 2*Math.PI*radius,
            'alignment-baseline': 'hanging'
        });
        textPath.textContent = this.text;
        var defs = document.getElementsByTagName('defs')[0];
        var path = svgCreate('path', {
            'id': 'pathFor'+this.ID,
            'd': circlePath(x0, y0, radius),
            'fill': 'none',
            'transform': `rotate(${angle},${x0},${y0})`
        });
        defs.appendChild(path);
        drawing.appendChild(defs);
        text.appendChild(textPath);
        drawing.appendChild(text);

        if(this.next !== null) {
            let newRadius = radius*this.remainSpace*0.01;
            this.next.draw(drawing, x0, y0, newRadius, angle);
        }
    }
}


class Star extends Shape {
    constructor(n, a, options) {
        let padding = options.padding || 0;
        let offset = options.offset || 0;
        let lineWidth = options.lineWidth || DEFAULT_LINE_W;
        let remainSpace = 100 * Math.abs(Math.cos(Math.PI*a/n))-padding;
        let stroke = options.stroke || DEFUALT_STROKE;

        super(padding, remainSpace);
        this.n = n;
        this.a = a;
        this.offset = offset;
        this.lineWidth = lineWidth;
        this.stroke = stroke;
    }
    
    draw(drawing, x0, y0, radius, angle) {
        console.log('drawing', this, 'radius:', radius);

        let visited = new Array(this.n).fill(false);
        let currN = 0; // 0 ~ n-1
        let step = 2*Math.PI/this.n;
        let g = svgCreate('g');
        for(let aa=0; aa<this.a; aa++){ // start point offset
            for(let nn=0; nn<this.n; nn++){ 
                if(visited[currN])
                    break;
 
                let nextN = (currN+this.a)%this.n;
                let xy1 = polar2XY(x0, y0, radius, currN*step);
                let xy2 = polar2XY(x0, y0, radius, nextN*step);
                var line = svgCreate('line', {
                    'x1': xy1.x,
                    'y1': xy1.y,
                    'x2': xy2.x,
                    'y2': xy2.y,
                    'stroke': this.stroke,
                    'stroke-width': this.lineWidth,
                    'stroke-linecap': 'round'
                });
                g.appendChild(line);

                visited[currN] = true;
                currN = nextN;
            }
            currN += 1;
        }
        g.setAttribute('transform', `rotate(${angle},${x0},${y0})`);
        drawing.appendChild(g);

        if(this.next !== null) {
            let newRadius = radius*this.remainSpace*0.01;
            console.log(newRadius);
            this.next.draw(drawing, x0, y0, newRadius, angle);
        }
    }
}

// leaf shape
class LineStar extends Shape {
    constructor(n, options) {
        let padding = options.padding || 0;
        let lineWidth = options.lineWidth || DEFAULT_LINE_W;
        let stroke = options.stroke || DEFUALT_STROKE;

        super(padding, 0);
        this.n = n;
        this.lineWidth = lineWidth;
        this.stroke = stroke;
    }

    draw(drawing, x0, y0, radius) {
        console.log('drawing', this, 'radius:', radius);

        let step = 2*Math.PI/this.n;
        for(let i=0; i<this.n; i++){
            let xy = polar2XY(x0, y0, radius, i*step);
            var line = svgCreate('line', {
                'x1': x0,
                'y1': y0,
                'x2': xy.x,
                'y2': xy.y,
                'stroke': this.stroke,
                'stroke-width': this.lineWidth,
                'stroke-linecap': 'round'
            });
            drawing.appendChild(line);
        }
        // leaf shape, no need to call next.draw
    }
}


class Chain extends Shape {
    constructor(shapeList, height, options) {
        let padding = options.padding || 0;
        let circleAlign = options.circleAlign === undefined ? 
            true : options.circleAlign;
        let lineWidth = options.lineWidth || DEFAULT_LINE_W;
        
        super(padding, 100-padding-height);
        this.shapeList = shapeList;
        this.height = height;
        this.circleAlign = circleAlign;
    }

    draw(drawing, x0, y0, radius, angle) {
        console.log('drawing', this, 'radius:', radius);

        let step = 2*Math.PI/this.shapeList.length;   
        for(let i=0; i<this.shapeList.length; i++){
            let newxy0 = polar2XY(x0, y0, radius*(100-this.height*0.5)*0.01, 
                angle*(2*Math.PI/360) + i*step);
            let newR = radius*this.height*0.01*0.5;
            let newAngle = this.circleAlign ? 
                (angle + (i*step*(360/(2*Math.PI))) ) % 360 : angle;
            this.shapeList[i].root.draw(drawing, newxy0.x, newxy0.y, newR, newAngle);
        }
        if(this.next !== null) {
            let newRadius = radius*this.remainSpace*0.01;
            this.next.draw(drawing, x0, y0, newRadius, angle);
        }
    }
}



function shapeID(){
    return ID++;
}
function polar2XY(x0, y0, r, angle) {
    // -90 degrees to make top=0
    let xx = r * Math.cos(angle - Math.PI*0.5) + x0;
    let yy = r * Math.sin(angle - Math.PI*0.5) + y0;
    return { x: xx, y: yy };
}
function circlePath(x0, y0, r) {
	// draw from top
	return `M${x0} ${y0-r} A${r} ${r} 0 1 1 ${x0-1} ${y0-r} Z`;
}
function svgCreate(svgTag, attrs={}) {
    var svgThing = document.createElementNS("http://www.w3.org/2000/svg", svgTag);
    for(key in attrs)
        svgThing.setAttribute(key, attrs[key]);
    return svgThing;
}
