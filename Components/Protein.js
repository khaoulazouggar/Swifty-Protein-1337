import { View, StyleSheet } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { useColorScheme } from "react-native-appearance";
import OrbitControlsView from "./OrbitControlView";
import { Renderer } from "expo-three";
import { GLView } from "expo-gl";
import useColors from "../hooks/useColors";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import * as THREE from "three";
import { Dimensions, ActivityIndicator } from "react-native";
import useOrientation from "../hooks/useOrientation";

const Protein = () => {
  const [mode, setMode] = useState("2");
  const [key, setKey] = useState(1);
  const [load, setLoad] = useState(false);
  const [coloringMode, setColoringMode] = useState("4");

  const options1 = [
    { label: "S", value: "1" },
    { label: "B&S", value: "2" },
  ];

  const options2 = [
    { label: "jmol", value: "3" },
    { label: "rasmol", value: "4" },
  ];
  const orientation = useOrientation();
  const colorScheme = useColorScheme();
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
  useEffect(() => {
    setLoad(true);
    setKey(key + 1);
    setLoad(false);
  }, [mode, coloringMode]);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  useEffect(() => {
    let hDim = Dimensions.get("window").height;
    let wDim = Dimensions.get("window").width;
    let p = wDim > hDim ? 0.25 : 0.2;
    setWidth(wDim);
    // setHeight(hDim - hDim * p);
    setHeight(hDim);
  }, [orientation]);
  /****************Three******************/
  // scene
  const scene = new THREE.Scene();
  //camera
  useEffect(() => {
    setLoad(true);
    let aspect = height - width > 0 ? height / width : width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    setLoad(false);
  }, [height]);

  const camera = new THREE.PerspectiveCamera(90, 0.5, 0.01, 2000);
  // Raycast
  const raycaster = new THREE.Raycaster();
  //sphere
  const geometry = new THREE.SphereGeometry(0.05);
  if (mode === "1") {
    for (let i = 0; i < atoms.length; i++) {
      let color;
      if (coloringMode == "3") color = useColors(atoms[i].name).jmol;
      else color = useColors(atoms[i].name).rasmol;
      const material = new THREE.MeshPhysicalMaterial({
        color: parseInt(`0x${color}`, 16),
        emissive: parseInt(`0x${color}`, 16),
        metalness: 1,
        roughness: 0,
        reflectivity: 0,
        clearcoat: 1,
        clearcoatRoughness: 0,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        atoms[i].position.x,
        atoms[i].position.y,
        atoms[i].position.z
      );
      sphere.name = atoms[i].name;
      scene.add(sphere);
    }
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
      let cylColor = mode === "1" ? 0x3c3939 : 0xffffff;
      const materialCyl = new THREE.MeshBasicMaterial({
        color: cylColor,
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
    if (intersects[0]?.object?.name) {
      alert(intersects[0]?.object?.name);
      console.log(intersects[0]?.object?.name);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={colorScheme === "light" ? styles.selector : styles.selectorD}
      >
        <SwitchSelector
          options={options1}
          initial={0}
          onPress={(value) => {
            if (value == "1") {
              setMode("2");
            } else if (value == "2") setMode("1");
          }}
          style={[styles.switch, { marginLeft: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        />

        <SwitchSelector
          options={options2}
          initial={0}
          onPress={(value) => {
            if (value === "3") setColoringMode("4");
            else if (value == "4") setColoringMode("3");
          }}
          style={[styles.switch, { marginRight: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        ></SwitchSelector>
      </View>
      {!load ? (
        <OrbitControlsView
          camera={camera}
          onTouchEndCapture={handleStateChange}
          // style={{ flex: 1 }}
          style={{ width: width, height: height }}
          key={height}
        >
          <GLView
            key={key}
            style={{ flex: 1 }}
            onContextCreate={async (gl) => {
              /*||||||||||||||Camera||||||||||||||*/
              camera.position.set(0, 0, 4);

              /*||||||||||||||Render||||||||||||||*/
              const renderer = new Renderer({ gl });
              renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
              renderer.setClearColor(
                colorScheme === "light" ? 0xffffff : 0x000000,
                1
              );
              /*||||||||||||||Light||||||||||||||*/
              const directionalLight = new THREE.DirectionalLight(
                0xffffff,
                0.5
              );
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
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
    </View>
  );
};

export default Protein;

const styles = StyleSheet.create({
  selector: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexDirection: "row",
    // position: "absolute",
  },
  selectorD: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "black",
    flexDirection: "row",
    // position: "absolute",
  },
  switch: {
    width: 100,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
});
