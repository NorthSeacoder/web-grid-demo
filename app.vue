<template>
    <div>
		<div id="container"></div>
		<div id="menu">
			<button  @click="click('table')">TABLE</button>
			<button  @click="click('sphere')">SPHERE</button>
			<button  @click="click('helix')">HELIX</button>
			<button  @click="click('grid')">GRID</button>
		</div>

    </div>
</template>

<script>
import * as THREE from 'three';
import {TWEEN} from 'three/examples/jsm/libs/tween.module.min.js';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js';
import {CSS3DRenderer, CSS3DObject} from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import {table} from './constant/record';
export default {
    name: 'App',

    data() {
        return {
            table,
            camera: null,
            scene: null,
            renderer: null,
            controls: null,
            objects: [],
            targets: {table: [], sphere: [], helix: [], grid: []},
            n: 0
        };
    },
    mounted() {
        const vm = this;
        vm.init();
        vm.animate();
    },
    methods: {
        render() {
            const vm = this
            vm.renderer.render(vm.scene, vm.camera);
        },

        animate() {
            const vm = this
            requestAnimationFrame(vm.animate);
            TWEEN.update();
            vm.controls.update();

            vm.n++
        },

        onWindowResize() {
            const vm = this;
            vm.camera.aspect = window.innerWidth / window.innerHeight;
            vm.camera.updateProjectionMatrix();
            vm.renderer.setSize(window.innerWidth, window.innerHeight);
            vm.render();
        },
        transform(targets, duration) {
            const vm = this;
            TWEEN.removeAll();
            for (let i = 0; i < vm.objects.length; i++) {
                let object = vm.objects[i];
                let target = targets[i];
                new TWEEN.Tween(object.position)
                    .to({x: target.position.x, y: target.position.y, z: target.position.z}, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                new TWEEN.Tween(object.rotation)
                    .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z}, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }
            new TWEEN.Tween(window)
                .to({}, duration * 2)
                .onUpdate(vm.render)
                .start();
        },

        click(key) {
            const vm = this;
            vm.transform(vm.targets[key], 2000);
        },

        init() {
            const vm = this;
            vm.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
            vm.camera.position.z = 3000;
            vm.scene = new THREE.Scene();
            vm.setTable();
            // vm.setSphere();
            // vm.setHelix();
            // vm.setGrid();
            // vm.initRender();
            // vm.$nextTick(() => {
            //     vm.transform(vm.targets.table, 2000);
            //     //
            //     window.addEventListener('resize', vm.onWindowResize(), false);
            // })

        },

        setTable() {
            const vm = this;
            for (let i = 0; i < vm.table.length; i += 5) {
                let element = document.createElement('div');
                element.className = 'element';
                element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
                let number = document.createElement('div');
                number.className = 'number';
                number.textContent = (i / 5) + 1;
                element.appendChild(number);
                let symbol = document.createElement('div');
                symbol.className = 'symbol';
                symbol.textContent = table[i];
                element.appendChild(symbol);
                let details = document.createElement('div');
                details.className = 'details';
                details.innerHTML = table[i + 1] + '<br>' + table[i + 2];
                element.appendChild(details);
                let object = new CSS3DObject(element);
                object.position.x = Math.random() * 4000 - 2000;
                object.position.y = Math.random() * 4000 - 2000;
                object.position.z = Math.random() * 4000 - 2000;
                vm.scene.add(object);
                vm.objects.push(object);
                //
                let object1 = new THREE.Object3D();
                object1.position.x = (table[i + 3] * 140) - 1330;
                object1.position.y = - (table[i + 4] * 180) + 990;
                vm.targets.table.push(object1);
            }

            let vector1 = new THREE.Vector3();
            for (let i = 0, l = vm.objects.length; i < l; i++) {
                let phi = Math.acos(- 1 + (2 * i) / l);
                let theta = Math.sqrt(l * Math.PI) * phi;
                let object = new THREE.Object3D();
                object.position.setFromSphericalCoords(800, phi, theta);
                vector1.copy(object.position).multiplyScalar(2);
                object.lookAt(vector1);
                vm.targets.sphere.push(object);
            }
            let vector = new THREE.Vector3();
            for (let i = 0, l = vm.objects.length; i < l; i++) {
                let theta = i * 0.175 + Math.PI;
                let y = - (i * 8) + 450;
                let object = new THREE.Object3D();
                object.position.setFromCylindricalCoords(900, theta, y);
                vector.x = object.position.x * 2;
                vector.y = object.position.y;
                vector.z = object.position.z * 2;
                object.lookAt(vector);
                vm.targets.helix.push(object);
            }
            for (let i = 0; i < vm.objects.length; i++) {
                let object = new THREE.Object3D();
                object.position.x = ((i % 5) * 400) - 800;
                object.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
                object.position.z = (Math.floor(i / 25)) * 1000 - 2000;
                vm.targets.grid.push(object);
            }
            vm.renderer = new CSS3DRenderer();
            vm.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('container').appendChild(vm.renderer.domElement);
            //
            vm.controls = new TrackballControls(vm.camera, vm.renderer.domElement);
            vm.controls.minDistance = 500;
            vm.controls.maxDistance = 60000;
            vm.controls.addEventListener('change', vm.render);
            vm.controls.rotateSpeed = 2;// 旋转速度
            vm.controls.zoomSpeed = 2;// 缩放速度
            vm.controls.panSpeed = 1;// 平controls
            vm.transform(vm.targets.table, 2000);
            //
            window.addEventListener('resize', vm.onWindowResize, false);
            // vm.controls.update();
        },

        setSphere() {
            const vm = this;
            let vector = new THREE.Vector3();
            for (let i = 0, l = vm.objects.length; i < l; i++) {
                let phi = Math.acos(- 1 + (2 * i) / l);
                let theta = Math.sqrt(l * Math.PI) * phi;
                let object = new THREE.Object3D();
                object.position.setFromSphericalCoords(800, phi, theta);
                vector.copy(object.position).multiplyScalar(2);
                object.lookAt(vector);
                vm.targets.sphere.push(object);
            }
        },

        setHelix() {
            const vm = this;
            let vector = new THREE.Vector3();
            for (let i = 0, l = vm.objects.length; i < l; i++) {
                let theta = i * 0.175 + Math.PI;
                let y = - (i * 8) + 450;
                let object = new THREE.Object3D();
                object.position.setFromCylindricalCoords(900, theta, y);
                vector.x = object.position.x * 2;
                vector.y = object.position.y;
                vector.z = object.position.z * 2;
                object.lookAt(vector);
                vm.targets.helix.push(object);
            }
        },

        setGrid() {
            const vm = this;
            for (let i = 0; i < vm.objects.length; i++) {
                let object = new THREE.Object3D();
                object.position.x = ((i % 5) * 400) - 800;
                object.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
                object.position.z = (Math.floor(i / 25)) * 1000 - 2000;
                vm.targets.grid.push(object);
            }
        },

        initRender() {
            const vm = this;
            vm.renderer = new CSS3DRenderer();
            vm.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('container').appendChild(vm.renderer.domElement);
            //
            vm.controls = new TrackballControls(vm.camera, vm.renderer.domElement);
            vm.controls.minDistance = 500;
            vm.controls.maxDistance = 6000;
            vm.controls.addEventListener('change', vm.render);
        }

    },


};

</script>
