import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Dimensions } from "react-native";
import OrbitControlsView from "./OrbitControlView";
import { useEffect, useState } from "react";
import axios from "axios";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

const Render = () => {
    const [load, setLoad] = useState(true);
    const [atoms, setAtoms] = useState([]);
    const [connections, setConnections] = useState([]);
    const [rangedPoints, setRangedPoints] = useState([]);

    useEffect(() => {
        axios
            .get("https://files.rcsb.org/ligands/view/010_ideal.pdb")
            .then((res) => {
                dataParse(res.data);
            });
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
        setRangedPoints([minX, maxX, minY, maxY, minZ, maxZ]);
        setAtoms(atoms);
        setConnections(connections);
        setLoad(false);
    }
    if (!load)
        return (
            <Draw
                rangedPoints={rangedPoints}
                atoms={atoms}
                connections={connections}
            />
        );
    return (
        <View>
            <Text>loading</Text>
        </View>
    );
};

export default Render;

const Draw = ({ rangedPoints, atoms, connections }) => {
    const onContextCreate = async (gl) => {
        var scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            2000
        );
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
        const light = new THREE.AmbientLight(0xffffff, 0.2);
        light.position.set(0, 0, 50);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 0, 100);
        scene.add(directionalLight);
        const animate = () => {
            timeout = requestAnimationFrame(animate);

            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };
    useEffect(() => {
        return () => clearTimeout(timeout);
    }, []);
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    const [camera, setCamera] = useState();
    let timeout;
    return (
        <OrbitControlsView camera={camera} style={{ flex: 1 }}>
            <GLView
                style={{ width: windowWidth, height: windowHeight }}
                onContextCreate={onContextCreate}
            />
        </OrbitControlsView>
    );
};
