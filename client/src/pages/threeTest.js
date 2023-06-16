
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Stats } from 'stats.js/src/stats.min.js';

import React, { useState, useEffect, useRef } from 'react';
import spaceImage from '../photo/space.png'
import planet1Image from '../photo/planet1_diff.jpg'
import planet2Image from '../photo/planet2_diff.jpg'
import planet1Normal from '../photo/planet1_nor.exr'
import planet2Normal from '../photo/planet2_nor.exr'
import planet1Disp from '../photo/planet1_disp.png'
import planet2Disp from '../photo/planet2_disp.png'
import planet1Rough from '../photo/planet1_rough.jpg'
import planet2Rough from '../photo/planet2_rough.exr'

export default function ThreeTest() {
    const mount = useRef(null);

    let oldTime = Date.now();
    
    // Initialization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    })
    
    const controls = new OrbitControls( camera, renderer.domElement );

    renderer.render(scene, camera);    
    
    // Create Geometry
    const planet1Texture = new THREE.TextureLoader().load(planet1Image);
    const planet1NormalMap = new THREE.TextureLoader().load(planet1Normal);
    const planet1DispMap = new THREE.TextureLoader().load(planet1Disp);
    const planet2DispMap = new THREE.TextureLoader().load(planet2Disp);
    const planet2NormalMap = new THREE.TextureLoader().load(planet2Normal);
    const planet1RoughMap = new THREE.TextureLoader().load(planet1Rough);
    const planet2RoughMap = new THREE.TextureLoader().load(planet2Rough);
    const spaceTexture = new THREE.TextureLoader().load(spaceImage);

    const geometry = new THREE.SphereGeometry( 8, 64, 64 ); 
    //const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
    const material1 = new THREE.MeshStandardMaterial({
        map: planet1Texture,
        normalMap: planet1NormalMap,
        displacementMap: planet1DispMap,
        roughnessMap: planet1RoughMap
    });
    const material2 = new THREE.MeshStandardMaterial({
        map: planet2Texture,
        normalMap: planet2NormalMap,
        displacementMap: planet2DispMap,
        roughnessMap: planet2RoughMap
    });
    
    const planet1 = new THREE.Mesh(geometry, material1);
    
    const planet2 = new THREE.Mesh(geometry, material2);
    
    // Lighting
    const pointLight1 = new THREE.PointLight( 0x80adbf, 1, 10 ); // soft white light
    pointLight1.position.set(-4, 5, 1);
    pointLight1.castShadow = true; // default false

    const pointLight2 = new THREE.PointLight( 0x80adbf, 1, 10 ); // soft white light
    pointLight2.position.set(4, 5, 1);
    
    const ambientLight = new THREE.AmbientLight(0xffffff);

    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    useEffect(() => {
        planet1.position.set(-15, 0, 0);
        planet1.rotation.x += 90;
        planet2.position.set(15, 0, 0);

        scene.add(planet1, planet2);

        const addStarParticles = () => {
            const geometry = new THREE.SphereGeometry(0.25 * 4, 24, 24);
            const material = new THREE.MeshStandardMaterial({color: 0xffffff});
            const star = new THREE.Mesh(geometry, material);

            const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
            
            star.position.set(x, y, z);
            scene.add(star);
        }

        Array(1000).fill().forEach(addStarParticles)

        scene.background = spaceTexture;
        
        scene.add( pointLight1, pointLight2, ambientLight );//Set up shadow properties for the light
        //scene.add( pointLight1, pointLight2 );

        const lightHelper1 = new THREE.PointLightHelper(pointLight1, 1);
        const lightHelper2 = new THREE.PointLightHelper(pointLight2, 1);
        const gridHelper = new THREE.GridHelper(2000, 50);
        //scene.add(lightHelper1, lightHelper2);
        //scene.add(lightHelper, gridHelper);

        // Add the renderer to the React Component
        mount.current.appendChild(renderer.domElement);
        
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);

        const update = () => {
            requestAnimationFrame(update);
            const newTime = Date.now();

			let diff = ( newTime - oldTime ) / 1000;
            oldTime = newTime;
            //planet1.rotation.x += diff;
            //planet1.rotation.y += 0.01;

            //planet2.rotation.x -= diff;
            //planet2.rotation.y -= 0.01;
            //planet2.rotation.y += 0.01;
            
	        stats.begin();
            controls.update();

            renderer.render(scene, camera);
            
	        stats.end();
        }

        update();
        window.addEventListener('scroll', () => {
            const t = window.body.getBoundingClientRect().top;

            planet1.rotation.x += 50;
            planet1.rotation.y += 75;
            planet1.rotation.z += 50;
            
            planet2.rotation.x += 50;
            planet2.rotation.y += 75;
            planet2.rotation.z += 50;

            camera.position.x = t * -0.1;
            camera.position.y = t * -0.002;
            camera.position.z = t * -0.002;
        });
    }, [mount]);

	return (
        <div 
            ref={mount}
        />
    )
}


