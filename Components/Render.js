import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
import OrbitControlsView from "expo-three-orbit-controls";
import { useEffect, useState } from "react";
const Render = () => {
    const shapes = [
        {
            position: { x: 0, y: 0, z: 0 },
        },
        {
            position: { x: 10, y: 0, z: 40 },
        },
    ];
    const onContextCreate = async (gl) => {
        // 1. Scene
        var scene = new THREE.Scene();
        // orbit control
        // 2. Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );
        // camera.position.z = 100;
        // camera.position.y = 0;
        // camera.position.x = 0;
        camera.position.set(0, 0, i);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        // setCamera(camera);
        // 3. Renderer
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000000, 1);
        // 4. shapes
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
        /*cylinder*/
        // let dist = sphere1.position.distanceTo(sphere2.position);
        const materialCyl = new THREE.MeshBasicMaterial({ color: 0xfffff0 });
        const cylinder = new THREE.CylinderGeometry(
            0.5,
            0.5,
            sphere2.position.distanceTo(sphere1.position),
            64
        );
        let axis = new THREE.Vector3(
            sphere1.position.x - sphere2.position.x,
            sphere1.position.y - sphere2.position.y,
            sphere1.position.z - sphere2.position.z
        ).normalize();
        const quaternion = new THREE.Quaternion();
        const cylinderUpAxis = new THREE.Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(cylinderUpAxis, axis);
        cylinder.applyQuaternion(quaternion);
        cylinder.translate(
            (sphere1.position.x + sphere2.position.x) / 2,
            (sphere1.position.y + sphere2.position.y) / 2,
            (sphere1.position.z + sphere2.position.z) / 2
        );
        const cylinderMesh = new THREE.Mesh(cylinder, materialCyl);
        scene.add(cylinderMesh);
        // 5. Light
        // scene.add(cube);
        const light = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
        light.position.set(0, 0, 50);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 0, 5);
        scene.add(directionalLight);
        // 6. Draw
        function update() {
            camera.position.set(0, 0, camera.position.z + 1);
        }
        const animate = () => {
            timeout = requestAnimationFrame(animate);
            update();
            setI(i + 1);
            if (camera.position.z == 150) {
                camera.position.set(0, 0, i);
            }
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    const [camera, setCamera] = useState(null);
    const [test, settest] = useState("");
    const [i, setI] = useState(50);
    let timeout;

    useEffect(() => {
        // Clear the animation loop when the component unmounts
        return () => clearTimeout(timeout);
    }, []);
    return (
        <OrbitControlsView
            camera={camera}
            style={{ width: windowWidth, height: windowHeight }}
            // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <GLView
                style={{ flex: 1 }}
                key="d"
                // style={{ width: windowWidth, height: windowHeight }}
                onContextCreate={onContextCreate}
            />
            <Text>
                {"asdfasdfasdf i ==="}
                {i}
            </Text>
        </OrbitControlsView>
    );
};

export default Render;
