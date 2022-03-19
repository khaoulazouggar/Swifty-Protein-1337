import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import ExpoTHREE from "expo-three";
import { Renderer } from "expo-three";
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
        // 3. Renderer
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        //scene.add(cube);

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <GLView
                style={{ width: 300, height: 300 }}
                onContextCreate={onContextCreate}
            />
        </View>
    );
};

export default Render;
