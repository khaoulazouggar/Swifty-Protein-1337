import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
import OrbitControlsView from "./OrbitControlView";
import { useEffect, useState } from "react";
import axios from "axios";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { useRoute } from "@react-navigation/native";
import useOrientation from "../hooks/useOrientation";

const Protein = () => {
  // const [load, setLoad] = useState(true);
  // const [atoms, setAtoms] = useState([]);
  // const [connections, setConnections] = useState([]);
  // const [rangedPoints, setRangedPoints] = useState([]);
  const route = useRoute();
  const result = route?.params.data;
  const load = route?.params.load;
  const atoms = route?.params.atoms;
  const connections = route?.params.connections;
  const rangedPoints = route?.params.rangedPoints;

  useEffect(() => {
    // console.log(route.params);
  }, []);

  return (
    <Draw rangedPoints={rangedPoints} atoms={atoms} connections={connections} />
  );
};

export default Protein;

const Draw = ({ rangedPoints, atoms, connections }) => {
  const orientation = useOrientation();
  const onContextCreate = async (gl) => {
    var scene = new THREE.Scene();
    let aspect;
    aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
    let diffZ = rangedPoints[5] - rangedPoints[4];
    let diffX = rangedPoints[1] - rangedPoints[0];
    let diffY = rangedPoints[3] - rangedPoints[2];
    var board = new THREE.Group();
    camera.position.set(0, 0, 100 * diffZ);
    setCamera(camera);
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 1);
    scene.add(new THREE.AxesHelper(100));
    const geometry = new THREE.SphereGeometry((diffX * 5) / 10);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffaaaf,
      emissive: 0x000000,
      metalness: 0,
      roughness: 0.5,
      reflectivity: 1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });
    for (let i = 0; i < atoms.length; i++) {
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        atoms[i].position.x,
        atoms[i].position.y,
        atoms[i].position.z
      );
      sphere.frustumCulled = false;
      board.add(sphere);
    }
    for (let i = 0; i < connections.length; i++) {
      let start = new THREE.Vector3(
        atoms[connections[i].index - 1].position.x,
        atoms[connections[i].index - 1].position.y,
        atoms[connections[i].index - 1].position.z
      );
      for (let j = 0; j < connections[i].connects.length; j++) {
        let end = new THREE.Vector3(
          atoms[connections[i].connects[j] - 1].position.x,
          atoms[connections[i].connects[j] - 1].position.y,
          atoms[connections[i].connects[j] - 1].position.z
        );
        let dist = start.distanceTo(end);
        const materialCyl = new THREE.MeshBasicMaterial({
          color: 0xfffff0,
        });
        const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, dist, 64);
        let axis = new THREE.Vector3(
          start.x - end.x,
          start.y - end.y,
          start.z - end.z
        ).normalize();
        const quaternion = new THREE.Quaternion();
        const cylinderUpAxis = new THREE.Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(cylinderUpAxis, axis);
        cylinderGeometry.applyQuaternion(quaternion);
        cylinderGeometry.translate(
          (start.x + end.x) / 2,
          (start.y + end.y) / 2,
          (start.z + end.z) / 2
        );
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, materialCyl);
        cylinderMesh.frustumCulled = false;
        board.add(cylinderMesh);
      }
    }
    scene.add(board);
    const light = new THREE.AmbientLight(0xffffff, 0.2);
    light.position.set(0, 0, 50);
    scene.add(light);

    if (pressed) {
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      // pointer.x = (pressed.x / gl.drawingBufferWidth) * 2 - 1;
      // pointer.y = -(pressed.y / gl.drawingBufferHeight) * 2 + 1;
    }
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 100);
    scene.add(directionalLight);
    const animate = () => {
      // console.log(scene.children);
      camera.updateProjectionMatrix();
      timeout = requestAnimationFrame(animate);
      if (pressed) {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++) {
          intersects[i].object.material.color.set(0xff0000);
        }
      }
      // if (width / height >= 1) camera.aspect = width / height;
      // else camera.aspect = height / width;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };
  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);
  const [pressed, setPressed] = useState(null);
  // const windowWidth = Dimensions.get("window").width;
  // const windowHeight = Dimensions.get("window").height;
  const [camera, setCamera] = useState();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  let timeout;

  useEffect(() => {
    setWidth(Dimensions.get("window").width);
    setHeight(Dimensions.get("window").height);
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    // console.log("width :", width);
    // console.log("height:", height);
  }, [orientation]);
  return (
    <OrbitControlsView
      pressed={pressed}
      setPressed={setPressed}
      camera={camera}
      style={{ width: width, height: height }}
    >
      <GLView
        style={{ width: width, height: height }}
        onContextCreate={onContextCreate}
      />
    </OrbitControlsView>
  );
};
