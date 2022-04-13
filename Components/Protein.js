import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
import OrbitControlsView from "./OrbitControlView";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import useOrientation from "../hooks/useOrientation";

const Protein = () => {
  const route = useRoute();
  const atoms = route?.params.atoms;
  const connections = route?.params.connections;
  const rangedPoints = route?.params.rangedPoints;

  return (
    <Draw rangedPoints={rangedPoints} atoms={atoms} connections={connections} />
  );
};

export default Protein;

// Draw function
const Draw = ({ atoms, connections }) => {
  const orientation = useOrientation();

  const handleStateChange = ({ nativeEvent: { pageX, pageY } }) => {
    console.log(pageX, pageY);
  };
  const onContextCreate = async (gl) => {
    var scene = new THREE.Scene();
    let aspect;
    aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 2000);
    var board = new THREE.Group();
    camera.position.set(0, 0, 500);
    setCamera(camera);
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 1);
    const geometry = new THREE.SphereGeometry(5);
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
      // sphere.frustumCulled = false;
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
        const cylinderGeometry = new THREE.CylinderGeometry(1, 1, dist, 64);
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

    if (pressed) {
      // const pointer = new THREE.Vector2();
      // pointer.x = (pressed.x / gl.drawingBufferWidth) * 2 - 1;
      // pointer.y = -(pressed.y / gl.drawingBufferHeight) * 2 + 1;
    }
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 100);
    scene.add(directionalLight);
    const animate = () => {
      timeout = requestAnimationFrame(animate);
      if (pressed) {
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2();
        pointer.x = (pressed.x / gl.drawingBufferWidth) * 2 - 1;
        pointer.y = -(pressed.y / gl.drawingBufferHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++) {
          intersects[i].object.material.color.set(0xff0000);
        }
        console.log(intersects);
      }
      camera.updateProjectionMatrix();
      directionalLight.position.copy(camera.position);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };
  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    console.log(pressed);
  }, [pressed]);
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
  }, [orientation]);
  return (
    <OrbitControlsView
      // pressed={pressed}
      // setPressed={setPressed}
      camera={camera}
      onTouchEndCapture={handleStateChange}
      style={{ width: width, height: height }}
    >
      <GLView
        style={{ width: width, height: height }}
        onContextCreate={onContextCreate}
      />
    </OrbitControlsView>
  );
};
