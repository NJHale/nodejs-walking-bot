// package.js

// Constructor for Package object (Declares a Package's prototype)
function Package(pkgId, position, velocity, acceleration, tempurature, time) {
  this.pkgId = pkgId;
  this.position = position; // [latitude, longitude, altitude]
  this.velocity = velocity; // [x', y', z']
  this.acceleration = acceleration; // [x'', y'', z'']
  this.tempurature = tempurature;
  this.time = time;

  // Calculates the euclidean distance between two points in 3D space
  this.distance = (pkg) => {
    // Take the square root of the dot product of the difference
    // |B - A| = (<B - A> dot <B - A>)^1/2 = dist(A, B)
    var diff = [pkg.position[0] - this.position[0], // latitudes
                pkg.position[1] - this.position[1], // longitudes
                pkg.position[2] - this.position[2]];// altitudes
    // Reduce to sum of the squares (<B - A> dot <B - A> = <C> dot <C>; <B - A> = <C>)
    var dist = diff.reduce((sum, element) => {
      return sum + element * element;
    }, 0);
    //
    return Math.sqrt(dist);
  }

  // Calculates the velocity vector between this package and the given positon in 3D space over the given time
  this.findVelocity = (position, time) => {
    var diff = [position[0] - this.position[0], // latitudes
                position[1] - this.position[1], // longitudes
                position[2] - this.position[2]];// altitudes

    var vel = diff.map((dp) => {
      return dp / time;
    });

    return vel;
  }

  // Calculates the change in acceleration between this package and the given velocity in 3D space over the given time
  this.findAcceleration = (velocity, time) => {
    var diff = [velocity[0] - this.velocity[0], // latitudes
                velocity[1] - this.velocity[1], // longitudes
                velocity[2] - this.velocity[2]];// altitudes

    var acc = diff.map((dv) => {
      return dv / time;
    });

    return acc;
  }

  this.toString = () => {
    return `<${this.position[0]}, ${this.position[1]}, ${this.position[2]}>`;
  }

}

// Export the Package "constructor" as a named function
exports.Package = Package;
exports.Package.findVelocity = Package.findVelocity;
exports.Package.findAcceleration = Package.findAcceleration;
