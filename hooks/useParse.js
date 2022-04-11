import { useState } from "react";

const useParse = (data, setLoad, setAtoms, setConnections, setRangedPoints) => {
  const result = data.split(/\r?\n/);
  let atoms = [];
  let connections = [];

  const mapInterval = (val, A, B, a, b) => {
    // To map
    // [A, B] --> [a, b]
    // use this formula
    // (val - A)*(b-a)/(B-A) + a
    return (val - A) * ((b - a) / (B - A)) + a;
  };
  let [, , , , , , maxX, maxY, maxZ] = result[0].split(/\s+/);
  let [minX, minY, minZ] = [maxX, maxY, maxZ];
  for (let i = 0; i < result.length; i++) {
    let tmp = result[i].split(/\s+/);
    if (tmp[0] === "ATOM") {
      if (tmp[6] > maxX) maxX = tmp[6];
      else if (tmp[6] < minX) minX = tmp[6];
      if (tmp[7] > maxY) maxY = tmp[7];
      else if (tmp[7] < minY) minY = tmp[7];
      if (tmp[8] > maxZ) maxZ = tmp[8];
      else if (tmp[8] < minZ) minZ = tmp[8];
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
  let diffX = maxX - minX;
  let diffY = maxY - minY;
  let diffZ = maxZ - minZ;
  let t = atoms.map((atom) => {
    let mapedAtom = {
      ...atom,
      position: {
        x: (atom.position.x - minX - diffX / 2) * 20,
        y: (atom.position.y - minY - diffY / 2) * 20,
        z: (atom.position.z - minZ - diffZ / 2) * 20,
      },
    };
    mapedAtom.position.x = mapInterval(mapedAtom.position.x, minX, maxX, -2, 2);
    mapedAtom.position.y = mapInterval(mapedAtom.position.y, minX, maxX, -2, 2);
    mapedAtom.position.z = mapInterval(mapedAtom.position.z, minX, maxX, -2, 2);
    return mapedAtom;
  });
  setRangedPoints([minX, maxX, minY, maxY, minZ, maxZ]);
  setConnections(connections);
  setAtoms(t);
  console.log(atoms);
};

export default useParse;
