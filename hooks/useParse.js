import { useState } from "react";

const useParse = (data, setLoad, setAtoms, setConnections, setRangedPoints) => {
  const result = data.split(/\r?\n/);
  let atoms = [];
  let connections = [];
  console.log(data);
  const mapInterval = (val, A, B, a, b) => {
    // if (B - A === 0) console.log("asdfhaksjdfhlaskdfhlaks");
    //     // To map
    // [A, B] --> [a, b]
    // use this formula
    // (val - A)*(b-a)/(B-A) + a;
    return ((val - A) * (b - a)) / (B - A) + a;
  };
  // console.log(result[0].split(/\s+/));
  let [, , , , , , maxX, maxY, maxZ] = result[0].split(/\s+/);
  let [minX, minY, minZ] = [maxX, maxY, maxZ];
  // console.log("btata", minX, minX);
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
          if (x <= atoms.length && x > pikala) {
            con.connects.push(x);
          }
        }
        connections.push(con);
      }
    }
  }
  console.log("maxX : ", maxX);
  console.log("minX : ", minX);
  console.log("maxY : ", maxY);
  console.log("minY : ", minY);
  console.log("maxZ : ", maxZ);
  console.log("minZ : ", minZ);
  const mapedMaxX = mapInterval(maxX, minX, maxX, -10, 10);
  const mapedMinX = mapInterval(minX, minX, maxX, -10, 10);

  const mapedMinY = mapInterval(minY, minY, maxY, -10, 10);
  const mapedMaxY = mapInterval(maxY, minY, maxY, -10, 10);

  const mapedMinZ = mapInterval(minZ, minZ, maxZ, -10, 10);
  const mapedMaxZ = mapInterval(maxZ, minZ, maxZ, -10, 10);

  // const mapedDiffX = mapedMaxX - mapedMinX;
  // const mapedDiffY = mapedMaxY - mapedMinY;
  // const mapedDiffZ = mapedMaxZ - mapedMinZ;
  // console.log(mapedMinX);
  // console.log(mapedMinY);
  // console.log(mapedMinZ);
  // console.log(mapedMaxX);
  // console.log(mapedMaxY);
  // console.log(mapedMaxZ);
  let t = atoms.map((atom) => {
    let mapedAtom = {
      ...atom,
      position: {
        x: atom.position.x,
        y: atom.position.y,
        z: atom.position.z,
      },
    };
    mapedAtom.position.x = mapInterval(
      mapedAtom.position.x,
      minX,
      maxX,
      -10,
      10
    );
    mapedAtom.position.y = mapInterval(
      mapedAtom.position.y,
      minY,
      maxY,
      -10,
      10
    );
    mapedAtom.position.z = mapInterval(
      mapedAtom.position.z,
      minZ,
      maxZ,
      -10,
      10
    );
    // mapedAtom.position.x =
    //   mapInterval(mapedAtom.position.x, minX, maxX, -10, 10) -
    //   mapedMinX -
    //   mapedDiffX / 2;
    // mapedAtom.position.y =
    //   mapInterval(mapedAtom.position.y, minY, maxY, -10, 10) -
    //   mapedMinY -
    //   mapedDiffY / 2;
    // mapedAtom.position.z =
    //   mapInterval(mapedAtom.position.z, minZ, maxZ, -10, 10) -
    //   mapedMinZ -
    //   mapedDiffZ / 2;
    return mapedAtom;
  });
  setRangedPoints([minX, maxX, minY, maxY, minZ, maxZ]);
  setConnections(connections);
  setAtoms(t);
  // console.log(t);
};

export default useParse;
