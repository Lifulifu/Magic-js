
class MagicCircle {
    
    constructor(container, radius) {
        this.root = null;
        this.last = null;
        this.origin = { x:null, y:null };

        this.container = container
        this.r = radius;
    }

    add(shape) {
        if(this.root === null) {
            this.root = shape;
            this.last = shape;
        }else {
            this.last.next = shape;
            this.last = this.last.next;
        }
        return this;
    }

    draw() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', this.r*2);
        svg.setAttribute('height', this.r*2);
        svg.setAttribute('id', 'drawing');
        // contains path for textPath
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
        svg.appendChild(defs);

        document.getElementById(this.container).appendChild(svg);
        this.root.draw(svg, this.r, this.r, this.r, 0); //draw recursively
    }
}

class Shapes { // shape factory

    // common options: padding, lineWidth

    static circle(options={}) { // options:
        return new Circle(options);
    }
    static text(text='no text', options={}) { // options: font, fontSize
        return new Text(text, options);
    }
    static circleText(text='no text', options={}) { // options: font, fontSize
        return new CircleText(text, options);
    }
    static star(n=6, a=2, options={}) { // options: offset
        return new Star(n, a, options);
    }
    static polygon(n=6, options={}) { // options: 
        return new Star(n, 1, options);
    }
    static lineStar(n=6, options={}) {
        return new LineStar(n, options);
    }
    static chain(shapeList=[], height=20, options={}) {
        return new Chain(shapeList, height, options);
    }

}







