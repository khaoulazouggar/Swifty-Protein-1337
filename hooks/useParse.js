const useParse = (data, setAtoms, setConnections, setRangedPoints) => {
  const result = data.split(/\r?\n/);
  let atoms = [];
  let connections = [];
  console.log(data);
  const mapInterval = (val, A, B) => {
    const a = -1;
    const b = 1;
    // if (B - A === 0) console.log("asdfhaksjdfhlaskdfhlaks");
    //     // To map
    // [A, B] --> [a, b]
    // use this formula
    // (val - A)*(b-a)/(B-A) + a;
    return ((val - A) * (b - a)) / (B - A) + a;
  };
  let [, , , , , , maxX, maxY, maxZ] = result[0].split(/\s+/);
  let [minX, minY, minZ] = [maxX, maxY, maxZ];
  for (let i = 0; i < result.length; i++) {
    let tmp = result[i].split(/\s+/);
    if (tmp[0] === "ATOM") {
      if (tmp[6] - maxX > 0) maxX = tmp[6];
      else if (tmp[6] - minX < 0) minX = tmp[6];

      if (tmp[7] - maxY > 0) maxY = tmp[7];
      else if (tmp[7] - minY < 0) minY = tmp[7];

      if (tmp[8] - maxZ > 0) maxZ = tmp[8];
      else if (tmp[8] - minZ < 0) minZ = tmp[8];
      atoms.push({
        name: tmp[11],
        position: {
          x: tmp[6],
          y: tmp[7],
          z: tmp[8],
        },
      });
    } else if (tmp[0] === "CONECT" && tmp.length > 1) {
      let pikala = parseInt(tmp[1], 10);
      if (pikala <= atoms.length) {
        // connections.push([]);
        let con = { index: pikala, connects: [] };
        for (let j = 2; j < tmp.length; j++) {
          let x = parseInt(tmp[j]);
          if (x <= atoms.length) {
            con.connects.push(x);
          }
        }
        connections.push(con);
      }
    }
  }
  let t = atoms.map((atom) => {
    let mapedAtom = {
      ...atom,
      position: {
        x: atom.position.x,
        y: atom.position.y,
        z: atom.position.z,
      },
    };
    mapedAtom.position.x = mapInterval(mapedAtom.position.x, minX, maxX);
    mapedAtom.position.y = mapInterval(mapedAtom.position.y, minY, maxY);
    mapedAtom.position.z = mapInterval(mapedAtom.position.z, minZ, maxZ);
    return mapedAtom;
  });
  setRangedPoints([minX, maxX, minY, maxY, minZ, maxZ]);
  setConnections(connections);
  setAtoms(t);
  // console.log(t);
};

export default useParse;
