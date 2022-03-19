import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
const Render = () => {
    const shapes = [
        {
            position: { x: -5, y: 0, z: 0 },
        },
        {
            position: { x: 5, y: 0, z: 0 },
        },
    ];
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
        camera.position.z = 80;
        camera.position.y = 0;
        camera.position.x = 0;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        // 3. Renderer
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000000, 1);
        // 4. shapes
        // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        scene.add(new THREE.AxesHelper(100));
        const geometry = new THREE.SphereGeometry(2);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffaaaf,
            emissive: 0x000000,
            metalness: 0,
            roughness: 0.5,
            reflectivity: 1,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
        });
        const sphere1 = new THREE.Mesh(geometry, material);
        const sphere2 = new THREE.Mesh(geometry, material);
        sphere1.position.set(
            shapes[0].position.x,
            shapes[0].position.y,
            shapes[0].position.z
        );
        sphere2.position.set(
            shapes[1].position.x,
            shapes[1].position.y,
            shapes[1].position.z
        );
        scene.add(sphere1);
        scene.add(sphere2);
        const geometryCyl = new THREE.CylinderGeometry(
            0.5,
            0.5,
            sphere1.position.distanceTo(sphere2.position),
            64
        );
        const materialCyl = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const cylinder = new THREE.Mesh(geometryCyl, materialCyl);
        cylinder.lookAt(sphere1.position);
        scene.add(cylinder);
        // 5. Light
        // scene.add(cube);
        const light = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
        light.position.set(0, 0, 50);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 0, 5);
        scene.add(directionalLight);
        // 6. Draw
        const animate = () => {
            requestAnimationFrame(animate);
            // directionalLight.position.x = Math.sin(Date.now() / 1000) * 5;
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
