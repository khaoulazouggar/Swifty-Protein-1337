import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Text,
} from "react-native";
import OrbitControlsView from "./OrbitControlView";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import useOrientation from "../hooks/useOrientation";
import useColors from "../hooks/useColors";
import SwitchSelector from "react-native-switch-selector";
import { captureScreen } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

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
  useEffect(() => {
    let aspect = height - width > 0 ? height / width : width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // console.log(height, width);
  }, [height]);
  const camera = new THREE.PerspectiveCamera(90, aspect, 0.01, 2000);
  // Raycast
  const raycaster = new THREE.Raycaster();
  //sphere
  const geometry = new THREE.SphereGeometry(0.05);
  // const material = new THREE.MeshPhysicalMaterial({
  // color: 0xffaaaf,
  // emissive: 0x000000,
  // metalness: 0,
  // roughness: 0.5,
  // reflectivity: 1,
  // clearcoat: 0.5,
  // clearcoatRoughness: 0.2,
  // });
  for (let i = 0; i < atoms.length; i++) {
    let color = useColors(atoms[i].name).rasmol;
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
        color: 0x3c3939,
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

    console.log(intersects[0]?.object?.name);
  };

  const options1 = [
    { label: "M1", value: "1" },
    { label: "M2", value: "2" },
  ];

  const options2 = [
    { label: "M3", value: "3" },
    { label: "M4", value: "4" },
  ];

  const snapshot = async () => {
    try {
      let result = await MediaLibrary.requestPermissionsAsync(true);
      console.log(result);
      if (result.granted == true) {
        let uri = await captureScreen({
          format: "jpg",
          quality: 0.8,
        });
        // await Sharing.shareAsync(uri, {
        //   dialogTitle: "Share this image",
        // });
        let r = await MediaLibrary.saveToLibraryAsync(uri);
        console.log(r);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View>
      <View style={styles.selector}>
        <SwitchSelector
          options={options1}
          initial={0}
          onPress={(value) => console.log(`Call onPress with value: ${value}`)}
          style={[styles.switch, { marginLeft: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        />

        <SwitchSelector
          options={options2}
          initial={0}
          onPress={(value) => console.log(`Call onPress with value: ${value}`)}
          style={[styles.switch, { marginRight: 15 }]}
          buttonColor="#9CB9D8"
          borderColor="#9CB9D8"
          borderRadius={18}
          hasPadding={true}
        />
      </View>
      {/* <Pressable onPress={snapshot} style={{ width: 100, height: 100 }}>
        <Text>asdfads</Text>
      </Pressable> */}
      <OrbitControlsView
        camera={camera}
        onTouchEndCapture={handleStateChange}
        style={{ width: width, height: height }}
      >
        <GLView
          key={height}
          style={{ width: width, height: height }}
          onContextCreate={async (gl) => {
            /*||||||||||||||Camera||||||||||||||*/
            camera.position.set(0, 0, 4);

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
    </View>
  );
};

export default Protein;

const styles = StyleSheet.create({
  selector: {
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "black",
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
