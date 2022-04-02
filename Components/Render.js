import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
import OrbitControlsView from "./OrbitControlView";
import { useEffect, useState } from "react";
import axios from "axios";

const Render = () => {
    const onContextCreate = async (gl) => {
        // 1. Scene
        var scene = new THREE.Scene();
        // 2. Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            2000
        );
        // camera.position.z = 100;
        // camera.position.y = 0;
        // camera.position.x = 0;
        let diffZ = rangedPoints[5] - rangedPoints[4];
        let diffX = rangedPoints[1] - rangedPoints[0];
        let diffY = rangedPoints[3] - rangedPoints[2];
        var board = new THREE.Group();
        camera.position.set(0, 0, 100 * diffZ);
        setCamera(camera);
        // camera.lookAt(new THREE.Vector3(0, 0, 0));
        // 3. Renderer
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000000, 1);
        // 4. shapes
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
                const cylinderGeometry = new THREE.CylinderGeometry(
                    0.5,
                    0.5,
                    dist,
                    64
                );
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
                const cylinderMesh = new THREE.Mesh(
                    cylinderGeometry,
                    materialCyl
                );
                cylinderMesh.frustumCulled = false;
                board.add(cylinderMesh);
            }
        }
        scene.add(board);
        // const sphere1 = new THREE.Mesh(geometry, material);
        // const sphere1 = new THREE.Mesh(geometry, material);
        // const sphere2 = new THREE.Mesh(geometry, material);
        // sphere1.position.set(-5, 0, 0);
        // sphere2.position.set(5, 0, 0);
        // scene.add(sphere1);
        // scene.add(sphere2);
        /*cylinder*/
        // let dist = sphere1.position.distanceTo(sphere2.position);
        // const materialCyl = new THREE.MeshBasicMaterial({ color: 0xfffff0 });
        // const cylinder = new THREE.CylinderGeometry(
        //     0.5,
        //     0.5,
        //     sphere2.position.distanceTo(sphere1.position),
        //     64
        // );
        /********************************* */
        // let axis = new THREE.Vector3(
        //     sphere1.position.x - sphere2.position.x,
        //     sphere1.position.y - sphere2.position.y,
        //     sphere1.position.z - sphere2.position.z
        // ).normalize();
        // const quaternion = new THREE.Quaternion();
        // const cylinderUpAxis = new THREE.Vector3(0, 1, 0);
        // quaternion.setFromUnitVectors(cylinderUpAxis, axis);
        // cylinder.applyQuaternion(quaternion);
        // cylinder.translate(
        //     (sphere1.position.x + sphere2.position.x) / 2,
        //     (sphere1.position.y + sphere2.position.y) / 2,
        //     (sphere1.position.z + sphere2.position.z) / 2
        // );
        // const cylinderMesh = new THREE.Mesh(cylinder, materialCyl);
        // scene.add(cylinderMesh);
        /******************************** */
        // 5. Light
        // scene.add(cube);
        const light = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
        light.position.set(0, 0, 50);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 0, 100);
        scene.add(directionalLight);
        // 6. Draw
        const animate = () => {
            timeout = requestAnimationFrame(animate);

            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    const [camera, setCamera] = useState();
    const [load, setLoad] = useState(true);
    const [atoms, setAtoms] = useState([]);
    const [connections, setConnections] = useState([]);
    const [rangedPoints, setRangedPoints] = useState([]);
    let timeout;

    useEffect(() => {
        axios
            .get("https://files.rcsb.org/ligands/view/010_ideal.pdb")
            .then((res) => {
                dataParse(res.data);
                // console.log(res.data);
            });
        return () => clearTimeout(timeout);
    }, []);

    function dataParse(data) {
        const result = data.split(/\r?\n/);
        let atoms = [];
        let connections = [];

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
                        x: tmp[6] * 10,
                        y: tmp[7] * 10,
                        z: tmp[8] * 10,
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
        // let arr = new Array(6)
        // arr = [minX,  maxX,minY, maxY,minZ, maxZ]
        setRangedPoints([minX, maxX, minY, maxY, minZ, maxZ]);
        setAtoms(atoms);
        setConnections(connections);
        setLoad(false);
        // console.log(atoms.length, maxX, minX);
        // console.log(atoms);
        console.log(connections.length);
    }
    if (!load)
        return (
            <OrbitControlsView
                camera={camera}
                style={{ flex: 1 }}
                // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <GLView
                    // style={{ width :  }}
                    style={{ width: windowWidth, height: windowHeight }}
                    onContextCreate={onContextCreate}
                />
            </OrbitControlsView>
        );
    return (
        <View>
            <Text>loading</Text>
        </View>
    );
};

export default Render;
