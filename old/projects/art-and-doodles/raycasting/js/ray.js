class Ray {
    constructor(pos, angle){
        this.pos = pos;
        this.dir = p5.Vector.fromAngle(angle);
    }

    show() {
        stroke(255);
        push();
        translate(this.pos.x, this.pos.y);
        line(0,0, this.dir.x*1, this.dir.y*1);
        pop();
    }

    lookAt(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    cast(wall) {
        // If 0<t<1 and u>0 (the ray is pointing in the right direction), then the line is intersecting the wall
        // Calculating t and u, the denominator for each is the same
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;
        
        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x; // essentially makes a line segment by adding 
        const y4 = this.pos.y + this.dir.y; // the vector to the current position
        // Denominator
        const den = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4); 
        if(den==0) return; // if the lines are parallel
        const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / den;
        const u = - ((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / den;

        if(t>0 && t<1 && u>0) {
            const pt = createVector();
            pt.x = x1 + t*(x2-x1);
            pt.y = y1 + t*(y2-y1);
            return pt;
        } else {
            return;
        }



    }
}