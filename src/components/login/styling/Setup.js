import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

const CLOUD_COUNT = 50;
const cloudObjects = [];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const canvas = document.createElement("canvas");

export const setupLoginAnimation = () => {
    canvas.style.display = "block";
    canvas.id = "myCanvas";
    document.body.appendChild(canvas);

    //Setup webGL renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("myCanvas"),
        antialias: true
    });

    camera.rotation.set(1.16, -0.12, 0.27);
    camera.position.z = 1;
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.001);
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const composer = postprocessing(renderer);
    loadLighting();
    loadClouds();

    const animate = () => {
        requestAnimationFrame(animate);
        composer.render();
        animateClouds();
    }
    animate();
};

const loadLighting = () => {
    const light0 = new THREE.AmbientLight(0x555555);
    const light1 = new THREE.DirectionalLight(0xff8c19);
    const light2 = new THREE.PointLight(0xffffff, 50, 450, 1.7);
    const light3 = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
    const light4 = new THREE.PointLight(0x3677ac, 50, 450, 1.7);

    light1.position.set(0, 0, 1);
    light2.position.set(200, 300, 100);
    light3.position.set(100, 300, 100);
    light4.position.set(300, 300, 200);

    scene.add(light0);
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    scene.add(light4);
};

const loadClouds = () => {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load("/textures/smoke.png", texture => {
        const cloudGeometry = new THREE.PlaneBufferGeometry(500, 500);
        const cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });
    
        for (let i = 0; i < CLOUD_COUNT; i++) {
            let cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    
            cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 500);
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.55;
            cloudObjects.push(cloud);
            scene.add(cloud);
        }
    }, undefined, error => {
        console.error(error);
    });
};

const animateClouds = () => {
    cloudObjects.forEach(cloud => {
        cloud.rotation.z += 0.001;
    });
};

const postprocessing = (renderer) => {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new BloomPass(1000, 25, 4, 256);
    
    composer.addPass(bloomPass);
    composer.addPass(renderPass);
    bloomPass.renderToScreen = true;

    return composer;
};