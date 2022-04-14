import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
import OrbitControlsView from "./OrbitControlView";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import useOrientation from "../hooks/useOrientation";

const Protein = () => {
  const orientation = useOrientation();
  //   const [camera, setCamera] = useState();
  const [aspect, setAspect] = useState();
  const route = useRoute();
  const atoms = route?.params.atoms;
  const connections = route?.params.connections;
  let timeout;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  /****************Hooks******************/
  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  useEffect(() => {
    setWidth(Dimensions.get("window").width);
    setHeight(Dimensions.get("window").height);
  }, [orientation]);
  /****************Three******************/
  // scene
  const scene = new THREE.Scene();
  //camera
  //   useEffect(() => {
  //     let aspect = height - width > 0 ? height / width : width / height;
  //     camera.aspect = aspect;
  //     camera.updateProjectionMatrix();
  //   }, [height]);
  const camera = new THREE.PerspectiveCamera(90, aspect, 0.01, 2000);
  // Raycast
  const raycaster = new THREE.Raycaster();
  //sphere
  const geometry = new THREE.SphereGeometry(0.05);
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
    sphere.material.color.setHex(0x00ffff);
    sphere.position.set(
      atoms[i].position.x,
      atoms[i].position.y,
      atoms[i].position.z
    );
    // sphere.setColor(0xff00ff);
    // sphere.material.color = 0xff0000;
    scene.add(sphere);
  }
  //cylinder
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
      const cylinderGeometry = new THREE.CylinderGeometry(0.01, 0.01, dist, 64);
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
      scene.add(cylinderMesh);
    }
  }
  /****************Function raycast******************/
  const handleStateChange = ({ nativeEvent: { locationX, locationY } }) => {
    let mouse = new THREE.Vector2();
    mouse.x = (locationX / windowWidth) * 2 - 1;
    mouse.y = -(locationY / windowHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    console.log(intersects.length);
    for (let i = 0; i < intersects.length; i++) {
      // intersects[ i ].object.material.color.set( 0xff0000 );
      //   console.log(intersects[i]);
    }
  };

  return (
    <OrbitControlsView
      camera={camera}
      onTouchEndCapture={handleStateChange}
      style={{ width: width, height: height }}
    >
      <GLView
        style={{ width: width, height: height }}
        onContextCreate={async (gl) => {
          /*||||||||||||||Camera||||||||||||||*/
          //   camera.aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
          //   const camera = new THREE.PerspectiveCamera(
          // 90,
          // gl.drawingBufferWidth / gl.drawingBufferHeight,
          // 0.01,
          // 2000
          //   );
          camera.position.set(0, 0, 1);
          //   setCamera(camera);
          //   camera.updateProjectionMatrix();

          /*||||||||||||||Render||||||||||||||*/
          const renderer = new Renderer({ gl });
          renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
          renderer.setClearColor(0x000000, 1);
          /*||||||||||||||Light||||||||||||||*/
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
          directionalLight.position.set(0, 0, 100);
          scene.add(directionalLight);
          /*||||||||||||||Render Function||||||||||||||*/
          const animate = () => {
            timeout = requestAnimationFrame(animate);
            directionalLight.position.copy(camera.position);
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            gl.endFrameEXP();
          };
          /*||||||||||||||Render||||||||||||||*/
          animate();
        }}
      />
    </OrbitControlsView>
  );
};

export default Protein;
