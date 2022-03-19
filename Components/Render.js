import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
const Render = () => {
    const onContextCreate = async (gl) => {
        // 1. Scene
        var scene = new THREE.Scene();
        // 2. Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );
        camera.position.z = 5;
        camera.position.y = 0;
        camera.position.x = 0;
        // 3. Renderer
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.shadowMap.enabled = true;
        const geometry = new THREE.SphereGeometry();
        // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffaaaf,
            emissive: 0x000000,
            metalness: 0,
            roughness: 0.5,
            reflectivity: 1,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.receiveShadow = true;
        scene.add(sphere);
        camera.lookAt(sphere.position);
        // 4. Light
        // scene.add(cube);
        const light = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
        light.position.set(0, 0, 50);
        scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

        directionalLight.position.set(0, 0, 5);
        scene.add(directionalLight);
        // 4. Draw
        const animate = () => {
            requestAnimationFrame(animate);
            directionalLight.position.x = Math.sin(Date.now() / 1000) * 5;
            // camera.rotateX(0.01);
            // camera.rotation.y += 0.01;
            // camera.lookAt(sphere.position);
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <GLView
                style={{ width: windowWidth, height: windowHeight }}
                onContextCreate={onContextCreate}
            />
        </View>
    );
};

export default Render;
