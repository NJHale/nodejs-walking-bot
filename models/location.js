// location.js

// Constructor for Location object (Declares a Location's prototype)
function Location(pkgId, latitude, longitude, time) {
  this.pkgId = pkgId;
  this.latitude = latitude;
  this.longitude = longitude;
  this.time = time;

  this.distance = (location) => {
    // Take the square root of the dot product of the difference
    // |B - A| = (<B - A> dot <B - A>)^1/2 = dist(A, B)
    var diff = [location.latitude - this.latitude,
                location.longitude - this.longitude];
    // Reduce to sum of the squares (<B - A> dot <B - A> = <C> dot <C>; <B - A> = <C>)
    var dist = diff.reduce((sum, element) => {
      return sum + element * element;
    }, 0);
    //
    return Math.sqrt(dist);
  }
  this.toString = () => {
    return `<${this.latitude}, ${this.longitude}>`;
  }

}

// Export the Location "constructor" as a named function
exports.Location = Location;
